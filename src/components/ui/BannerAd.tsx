// NIDHI — BannerAd (Google Mobile Ads + RevenueCat attribution)
//
// Renders a real banner ad via react-native-google-mobile-ads when available.
// Falls back to a labelled placeholder in Expo Go or when ads aren't configured.
//
// Always renders a labelled container — even when no real ad is loaded.
// This guarantees the visual distinction: the user can always tell "this is an ad"
// vs. real financial data.

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/components/useTheme";
import { useI18n } from "@/lib/i18n";
import { isAdsEnabled, getBannerAdUnitId, trackBannerAdDisplayed } from "@/lib/revenuecat";

interface BannerAdProps {
  placement?: string;
}

export function BannerAd(_props: BannerAdProps) {
  const { colors } = useTheme();
  const t = useI18n().t;
  const [adComponent, setAdComponent] = useState<React.ComponentType<any> | null>(null);
  const [bannerSize, setBannerSize] = useState<any>(null);
  const [adUnitId, setAdUnitId] = useState<string | null>(null);
  const enabled = isAdsEnabled();

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    void (async () => {
      try {
        const gma = await import("react-native-google-mobile-ads");
        const unitId = getBannerAdUnitId();
        if (!unitId) return;
        if (cancelled) return;
        setAdComponent(() => gma.BannerAd);
        setBannerSize(gma.BannerAdSize.ANCHORED_ADAPTIVE_BANNER);
        setAdUnitId(unitId);
      } catch (e) {
        console.warn("[ads] BannerAd component load failed:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  // Always render a labelled container — even when no real ad is loaded.
  // This guarantees the visual distinction: the user can always tell "this is an ad"
  // vs. real financial data.
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceMuted,
          borderColor: colors.border,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={t("ads.bannerLabel")}
    >
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          {t("ads.bannerLabel")}
        </Text>
      </View>
      {adComponent && adUnitId && bannerSize ? (
        <View style={styles.adWrap}>
          {React.createElement(adComponent, {
            unitId: adUnitId,
            size: bannerSize,
            requestOptions: {
              requestNonPersonalizedAdsOnly: false,
            },
            onAdLoaded: () => {
              void trackBannerAdDisplayed(adUnitId);
            },
          })}
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={[styles.placeholderText, { color: colors.textMuted }]}>
            {enabled ? t("ads.loading") : t("ads.bannerLabel")}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  labelRow: {
    position: "absolute",
    top: 4,
    left: 8,
    zIndex: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  adWrap: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  placeholderText: {
    fontSize: 12,
  },
});
