// NIDHI — Font loading hook (uses expo-font + the typography assets)

import { useCallback, useEffect, useState } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { FONT_ASSETS, text, type FontWeight } from "@/lib/typography";

let _loaded = false;

export function useLoadFonts(): { loaded: boolean; error: Error | null } {
  const [loaded, setLoaded] = useState(_loaded);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (_loaded) return;
    let mounted = true;
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync(FONT_ASSETS as unknown as Record<string, string>);
        _loaded = true;
        if (mounted) {
          setLoaded(true);
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        if (mounted) {
          setError(e as Error);
          // Hide splash even on failure so the user isn't stuck
          await SplashScreen.hideAsync().catch(() => {});
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { loaded, error };
}

// Helper for one-off font status checks (e.g. from a non-component context)
export function areFontsLoaded(): boolean {
  return _loaded;
}

// Wait for fonts to load in an async context (used during app bootstrap)
export async function loadFontsAsync(): Promise<void> {
  if (_loaded) return;
  await Font.loadAsync(FONT_ASSETS as unknown as Record<string, string>);
  _loaded = true;
}

// Convenience hook: returns a memoized style prop with the chosen font family
export function useFontStyle(
  family: "ui" | "numeric" | "hindi" | "kannada" = "ui",
  weight: FontWeight = "400",
) {
  return useCallback(() => text(family, weight), [family, weight])();
}
