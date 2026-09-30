// NIDHI — Root layout (providers, fonts, notifications, RevenueCat init)

import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Appearance, LogBox } from "react-native";
import { I18nProvider } from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";
import { initNotifications, syncScheduledNotifications } from "@/lib/notifications";
import { initAds } from "@/lib/revenuecat";
import { useTheme } from "@/components/useTheme";
import { useLoadFonts } from "@/lib/useFonts";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Silence some non-critical warnings that flood the dev console in Expo Go:
//   - NativeModule RNPurchases warnings (we handle this gracefully)
//   - AsyncStorage deprecation warnings (third-party)
//   - Reanimated 3 worklet warnings (cosmetic)
LogBox.ignoreLogs([
  "NativeModule RNPurchases",
  "AsyncStorage has been extracted",
  "Reanimated 2 failed",
  "Reanimated 3",
]);

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppInner() {
  const { theme, colors } = useTheme();
  const hydrated = useAppStore((s) => s._hydrated);
  const language = useAppStore((s) => s.language);
  const darkModeOverride = useAppStore((s) => s.darkModeOverride);

  // Apply dark mode override (auto / light / dark)
  useEffect(() => {
    if (darkModeOverride === "light" || darkModeOverride === "dark") {
      Appearance.setColorScheme(darkModeOverride);
    }
    // For "auto", we don't call setColorScheme at all — the system handles it naturally.
    // Passing null crashes the native AppearanceModule on Android.
  }, [darkModeOverride]);

  // Init native services once after hydration.
  // Each init is wrapped in its own try/catch so a failure in one (e.g.
  // notifications permission denied, RevenueCat native module missing in Expo Go)
  // never blocks the rest of the app from loading.
  useEffect(() => {
    if (!hydrated) return;
    void (async () => {
      try {
        await initNotifications();
      } catch (e) {
        console.warn("[layout] initNotifications failed:", e);
      }
      try {
        await initAds(); // initializes RevenueCat + Google Mobile Ads together
      } catch (e) {
        console.warn("[layout] initAds failed:", e);
      }
      try {
        const state = useAppStore.getState();
        await syncScheduledNotifications(state);
      } catch (e) {
        console.warn("[layout] syncScheduledNotifications failed:", e);
      }
    })();
  }, [hydrated]);

  // Re-sync notification schedule whenever relevant state changes
  const notifSettings = useAppStore((s) => s.notifications);
  const emis = useAppStore((s) => s.emis);
  useEffect(() => {
    if (!hydrated) return;
    const state = useAppStore.getState();
    void syncScheduledNotifications(state).catch((e) => {
      console.warn("[layout] notification sync failed:", e);
    });
  }, [hydrated, notifSettings, emis, language]);

  if (!hydrated) return null;

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/language" />
        <Stack.Screen name="onboarding/welcome" />
        <Stack.Screen name="onboarding/name" />
        <Stack.Screen name="onboarding/financial" />
        <Stack.Screen name="onboarding/summary" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const hydrate = useAppStore((s) => s.hydrate);
  const language = useAppStore((s) => s.language);
  const hydrated = useAppStore((s) => s._hydrated);
  const { loaded: fontsLoaded, error: fontError } = useLoadFonts();

  useEffect(() => {
    void hydrate();
    // Safety net: if AsyncStorage hangs (rare but possible on some Android devices),
    // force the app to render after 5 seconds so the user never sees a stuck splash.
    const t = setTimeout(() => {
      if (!useAppStore.getState()._hydrated) {
        console.warn("[layout] hydration timeout — forcing app render");
        useAppStore.setState({ _hydrated: true });
      }
    }, 5000);
    return () => clearTimeout(t);
  }, [hydrate]);

  // Don't render until both fonts and storage are loaded
  if (!hydrated || !fontsLoaded) {
    return null;
  }

  if (fontError) {
    // Even on font error, render the app with system fonts — never block the user
    console.warn("[layout] font load error:", fontError);
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <I18nProvider key={language} initialLang={language}>
            <AppInner />
          </I18nProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
