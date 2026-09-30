// NIDHI — RevenueCat + Google Mobile Ads integration (Ads only — no paywall, no IAP).
//
// HOW IT WORKS:
//   1. Google Mobile Ads SDK (react-native-google-mobile-ads) loads and displays
//      the actual banner + interstitial ads.
//   2. RevenueCat SDK (react-native-purchases) tracks ad revenue + ad lifecycle
//      events for attribution. This lets you see ad revenue in your RevenueCat
//      dashboard alongside subscription revenue (when you add it later).
//
// AD PLACEMENTS (per spec):
//   1. Banner on the Dashboard (always-on, visually distinct from real financial data)
//   2. Light interstitial AFTER completing a daily log (never before — never
//      interrupts the core task of logging)
//
// All ad units are visually labelled "Ad" so they are never mistaken for app content.
//
// CRITICAL — Expo Go vs Dev Build:
//   - `react-native-purchases` and `react-native-google-mobile-ads` are BOTH
//     native modules. Neither is included in Expo Go.
//   - In Expo Go, this module auto-detects and silently no-ops (no ads, no crash).
//   - In a dev build (`expo run:android`) or production build (`eas build`),
//     both modules are bundled and ads work properly.
//
//   To build the dev build: `npm run dev:android`
//   To build the production AAB: `npm run build:aab`
//
// CONFIG:
//   - Ad unit IDs are loaded from `app.config.ts` -> `extra.googleAdsAndroidAppId`
//     and `extra.googleAdsBannerUnitId` / `extra.googleAdsInterstitialUnitId`.
//   - For development, set these to Google's test ad unit IDs (TestIds.BANNER etc.)
//     so you don't get flagged for invalid traffic on your real ad units.
//   - RevenueCat API key is loaded from `extra.revenueCatAndroidApiKey`.

import { Platform } from "react-native";
import Constants from "expo-constants";
import { PURCHASES, LOG_LEVEL } from "./revenuecat-types";

let _rcInitialized = false;
let _adsInitialized = false;
let _hasAds = false;

// Google Mobile Ads is loaded lazily so Expo Go doesn't crash at import time.
let _googleMobileAds: typeof import("react-native-google-mobile-ads") | null = null;
async function loadGoogleMobileAds() {
  if (_googleMobileAds) return _googleMobileAds;
  try {
    _googleMobileAds = await import("react-native-google-mobile-ads");
  } catch (e) {
    console.warn("[revenuecat] google-mobile-ads load failed:", e);
    _googleMobileAds = null;
  }
  return _googleMobileAds;
}

// Ad unit IDs — for RevenueCat Ads these come from the RC dashboard after ad configuration.
// For local development without keys, the ad slots render a clearly-labelled placeholder.
const BANNER_PLACEMENT = "dashboard_banner";
const INTERSTITIAL_PLACEMENT = "post_log_interstitial";

function getApiKey(): string {
  const extra = Constants.expoConfig?.extra ?? {};
  if (Platform.OS === "android") {
    return (extra.revenueCatAndroidApiKey as string) || "";
  }
  if (Platform.OS === "ios") {
    return (extra.revenueCatIosApiKey as string) || "";
  }
  return "";
}

function getAdUnitIds() {
  const extra = Constants.expoConfig?.extra ?? {};
  return {
    appId: (extra.googleAdsAndroidAppId as string) || "",
    bannerUnitId: (extra.googleAdsBannerUnitId as string) || "",
    interstitialUnitId: (extra.googleAdsInterstitialUnitId as string) || "",
  };
}

// Detect if we're running inside Expo Go. Native modules (react-native-purchases,
// react-native-google-mobile-ads) are NOT in Expo Go's module set.
// Calling their methods would crash. Skip entirely in Expo Go.
function isExpoGo(): boolean {
  try {
    const g = globalThis as unknown as { __expo_dev_server_url__?: string };
    if (g.__expo_dev_server_url__) return true;
  } catch {}
  try {
    const env = Constants.executionEnvironment as string;
    if (env === "StoreClient") return true;
  } catch {}
  return false;
}

/**
 * Initialize RevenueCat SDK (for ad revenue attribution).
 * Safe to call in Expo Go — no-ops.
 */
export async function initRevenueCat(): Promise<void> {
  if (_rcInitialized) return;

  if (isExpoGo()) {
    console.info("[revenuecat] Expo Go detected; RevenueCat disabled (native module not present).");
    _rcInitialized = true;
    return;
  }

  const key = getApiKey();
  if (!key || key.startsWith("REPLACE_WITH")) {
    console.info("[revenuecat] No API key configured; RevenueCat disabled in this build.");
    _rcInitialized = true;
    return;
  }

  try {
    // RevenueCat SDK 10: Purchases.configure takes a PurchasesConfiguration object.
    // It's synchronous (void), not async — we wrap it in await for ergonomics.
    PURCHASES.configure({ apiKey: key });
    PURCHASES.setLogLevel(LOG_LEVEL.INFO);
    _rcInitialized = true;
    console.info("[revenuecat] Initialized successfully.");
  } catch (e) {
    console.warn("[revenuecat] init failed:", e);
    _rcInitialized = true; // don't keep retrying every render
  }
}

/**
 * Initialize Google Mobile Ads SDK (for actual ad display).
 * Safe to call in Expo Go — no-ops.
 */
export async function initGoogleMobileAds(): Promise<void> {
  if (_adsInitialized) return;

  if (isExpoGo()) {
    console.info("[ads] Expo Go detected; ads disabled (native module not present).");
    _adsInitialized = true;
    _hasAds = false;
    return;
  }

  const { appId, bannerUnitId, interstitialUnitId } = getAdUnitIds();
  if (!appId || !bannerUnitId || !interstitialUnitId) {
    console.info("[ads] Ad unit IDs not configured; ads disabled in this build.");
    _adsInitialized = true;
    _hasAds = false;
    return;
  }

  try {
    const gma = await loadGoogleMobileAds();
    if (!gma) {
      console.warn("[ads] google-mobile-ads module failed to load.");
      _adsInitialized = true;
      _hasAds = false;
      return;
    }
    // Initialize the Google Mobile Ads SDK with the app ID.
    // This must be called before any ad request.
    await gma.MobileAds().initialize();
    _adsInitialized = true;
    _hasAds = true;
    console.info("[ads] Google Mobile Ads initialized successfully.");
  } catch (e) {
    console.warn("[ads] Google Mobile Ads init failed:", e);
    _adsInitialized = true;
    _hasAds = false;
  }
}

/**
 * Combined initialization — call once on app startup.
 * Initializes both RevenueCat (attribution) and Google Mobile Ads (display).
 */
export async function initAds(): Promise<void> {
  await Promise.all([initRevenueCat(), initGoogleMobileAds()]);
}

export function isAdsEnabled(): boolean {
  return _hasAds;
}

/**
 * Get the banner ad unit ID for use with the <BannerAd> React component.
 * Returns null if ads aren't configured.
 */
export function getBannerAdUnitId(): string | null {
  if (!_hasAds) return null;
  const { bannerUnitId } = getAdUnitIds();
  return bannerUnitId || null;
}

/**
 * Track a banner ad display event with RevenueCat (for revenue attribution).
 * Called by the BannerAd component when an ad loads.
 */
export async function trackBannerAdDisplayed(adUnitId: string): Promise<void> {
  if (!_rcInitialized) return;
  try {
    await PURCHASES.adTracker?.trackAdDisplayed({
      mediatorName: "AdMob",
      adFormat: "banner",
      adUnitId,
      impressionId: `imp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      placement: BANNER_PLACEMENT,
    });
  } catch (e) {
    // Never let attribution tracking break the ad flow
    console.warn("[revenuecat] trackAdDisplayed failed:", e);
  }
}

/**
 * Track a banner ad revenue event with RevenueCat.
 * Called when the ad network reports paid revenue.
 */
export async function trackAdRevenue(
  adUnitId: string,
  revenueMicros: number,
  currency: string,
): Promise<void> {
  if (!_rcInitialized) return;
  try {
    await PURCHASES.adTracker?.trackAdRevenue({
      mediatorName: "AdMob",
      adFormat: "banner",
      adUnitId,
      impressionId: `imp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      revenueMicros,
      currency,
      precision: "publisher_defined",
      placement: BANNER_PLACEMENT,
    });
  } catch (e) {
    console.warn("[revenuecat] trackAdRevenue failed:", e);
  }
}

/**
 * Load and show an interstitial ad after a daily log entry completes.
 * Never blocks the user — interstitial failures are silently ignored.
 * If no ad is ready, the function returns immediately without showing anything.
 */
export async function showInterstitialAfterLog(): Promise<void> {
  if (!_hasAds) return;

  const { interstitialUnitId } = getAdUnitIds();
  if (!interstitialUnitId) return;

  try {
    const gma = await loadGoogleMobileAds();
    if (!gma) return;

    // Create an interstitial ad request
    const interstitial = gma.InterstitialAd.createForAdRequest(interstitialUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    // Set up event listeners
    const unsubscribeLoaded = interstitial.addAdEventListener(
      gma.AdEventType.LOADED,
      () => {
        console.info("[ads] Interstitial loaded, showing.");
        interstitial.show();
        // Track with RevenueCat for attribution
        void trackInterstitialDisplayed(interstitialUnitId);
      },
    );
    const unsubscribeError = interstitial.addAdEventListener(
      gma.AdEventType.ERROR,
      (error: { message: string }) => {
        console.warn("[ads] Interstitial error:", error.message);
      },
    );
    const unsubscribeClosed = interstitial.addAdEventListener(
      gma.AdEventType.CLOSED,
      () => {
        console.info("[ads] Interstitial closed.");
        unsubscribeLoaded();
        unsubscribeError();
        unsubscribeClosed();
      },
    );

    // Load the ad — when it loads, the LOADED listener shows it automatically.
    interstitial.load();
  } catch (e) {
    // Never block the user — interstitial failures are silently ignored.
    console.warn("[ads] interstitial failed:", e);
  }
}

async function trackInterstitialDisplayed(adUnitId: string): Promise<void> {
  if (!_rcInitialized) return;
  try {
    await PURCHASES.adTracker?.trackAdDisplayed({
      mediatorName: "AdMob",
      adFormat: "interstitial",
      adUnitId,
      impressionId: `imp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      placement: INTERSTITIAL_PLACEMENT,
    });
  } catch (e) {
    console.warn("[revenuecat] interstitial trackAdDisplayed failed:", e);
  }
}

export async function shutdownRevenueCat(): Promise<void> {
  if (!_rcInitialized) return;
  try {
    await PURCHASES.shutdown?.();
  } catch (e) {
    console.warn("[revenuecat] shutdown failed:", e);
  }
}
