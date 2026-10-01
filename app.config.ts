/// <reference types="expo/types" />

// Nidhi — Android-only app config
// Notifications removed. iOS config removed. Clean Android-only build.

const VERSION_NAME = "1.0.0";

interface ConfigContext {
  config: Record<string, unknown>;
}

type NidhiExpoConfig = Record<string, unknown> & {
  name: string;
  slug: string;
  version: string;
};

export default ({ config }: ConfigContext): NidhiExpoConfig => ({
  ...config,
  name: "Nidhi",
  slug: "nidhi",
  version: VERSION_NAME,
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "nidhi",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "cover",
    backgroundColor: "#FAFAFA",
  },
  android: {
    package: "com.nidhi.app",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundImage: "./assets/adaptive-icon-bg.png",
      backgroundColor: "#0F9D58",
    },
    permissions: [
      "RECORD_AUDIO",
      "VIBRATE",
    ],
  },
  plugins: [
    "expo-router",
    [
      "expo-build-properties",
      {
        android: {
          minSdkVersion: 24,
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          buildToolsVersion: "36.0.0",
        },
      },
    ],
    [
      "react-native-google-mobile-ads",
      {
        androidAppId: process.env.GOOGLE_ADS_ANDROID_APP_ID ?? "ca-app-pub-3940256099942544~3347511713",
      },
    ],
    "./plugins/with-gradle-version",
  ],
  experiments: {
    tsconfigPaths: true,
  },
  extra: {
    eas: {
      projectId: "REPLACE WITH YOUR EAS PROJECT KEY",
    },
    sarvamApiKey: process.env.SARVAM_API_KEY ?? "",
    revenueCatAndroidApiKey: process.env.REVENUECAT_ANDROID_KEY ?? "REPLACE_WITH_YOUR_REVENUECAT_ANDROID_SDK_KEY",
    googleAdsAndroidAppId: process.env.GOOGLE_ADS_ANDROID_APP_ID ?? "ca-app-pub-3940256099942544~3347511713",
    googleAdsBannerUnitId: process.env.GOOGLE_ADS_BANNER_UNIT_ID ?? "ca-app-pub-3940256099942544/9214589741",
    googleAdsInterstitialUnitId: process.env.GOOGLE_ADS_INTERSTITIAL_UNIT_ID ?? "ca-app-pub-3940256099942544/1033173712",
  },
});
