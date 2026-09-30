// NIDHI — Type shim for react-native-purchases SDK 10.
//
// CRITICAL: react-native-purchases is a NATIVE module. It is NOT included in
// Expo Go. If we import it statically at module-eval time, Expo Go crashes
// immediately with "NativeModule RNPurchases is null" or similar.
//
// Solution: lazy-load via `require()` inside a try/catch, only when actually
// needed. The shim returns no-op fallbacks if the native module isn't present,
// so the rest of the app keeps working in Expo Go (where ads are silently disabled).
//
// When you build a real dev build (`expo run:android`) or production build
// (`eas build`), react-native-purchases IS bundled and the real PURCHASES
// module is used.
//
// SDK 10 API (verified against react-native-purchases@10.10.2):
//   - Purchases.configure({ apiKey })  // synchronous, void return
//   - Purchases.setLogLevel(LOG_LEVEL.INFO)
//   - Purchases.adTracker.trackAdDisplayed(data)
//   - Purchases.adTracker.trackAdRevenue(data)
//   - Purchases.adTracker.trackAdLoaded(data)
//   - Purchases.adTracker.trackAdOpened(data)
//   - Purchases.adTracker.trackAdFailedToLoad(data)

export interface AdEventData {
  mediatorName: string;
  adFormat: string;
  adUnitId: string;
  impressionId: string;
  networkName?: string | null;
  placement?: string | null;
}

export interface AdRevenueData extends AdEventData {
  revenueMicros: number;
  currency: string;
  precision: string;
}

export interface AdFailedToLoadData extends AdEventData {
  error: string;
}

export interface PurchasesAdTracker {
  trackAdDisplayed(data: AdEventData): Promise<void>;
  trackAdOpened(data: AdEventData): Promise<void>;
  trackAdLoaded(data: AdEventData): Promise<void>;
  trackAdRevenue(data: AdRevenueData): Promise<void>;
  trackAdFailedToLoad(data: AdFailedToLoadData): Promise<void>;
}

export interface PurchasesAdsModule {
  configure(configuration: { apiKey: string }): void;
  setLogLevel(level: number): void;
  readonly adTracker?: PurchasesAdTracker;
  shutdown?(): Promise<void>;
}

const NO_OP_MODULE: PurchasesAdsModule = {
  configure: () => {},
  setLogLevel: () => {},
  adTracker: undefined,
  shutdown: async () => {},
};

let _runtime: PurchasesAdsModule | null = null;
let _initialized = false;

function loadPurchasesModule(): PurchasesAdsModule {
  if (_initialized) return _runtime ?? NO_OP_MODULE;
  _initialized = true;
  try {
    // Lazy require — only runs when this function is called, not at module eval.
    // In Expo Go, the underlying native module is null, but `require()` itself
    // doesn't throw — only the native method calls do, and they're caught by
    // the outer try/catch in revenuecat.ts.
    const mod = require("react-native-purchases");
    // The SDK exports a default `Purchases` object with static methods.
    // We pull it out and treat it as the module surface.
    _runtime = (mod.default ?? mod) as PurchasesAdsModule;
  } catch (e) {
    console.warn("[revenuecat] module load failed:", e);
    _runtime = null;
  }
  return _runtime ?? NO_OP_MODULE;
}

export const PURCHASES: PurchasesAdsModule = {
  configure: (opts) => loadPurchasesModule().configure(opts),
  setLogLevel: (level) => loadPurchasesModule().setLogLevel?.(level),
  get adTracker() {
    return loadPurchasesModule().adTracker;
  },
  shutdown: () => loadPurchasesModule().shutdown?.() ?? Promise.resolve(),
};

export const LOG_LEVEL = {
  DEBUG: 0,
  VERBOSE: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
} as const;
