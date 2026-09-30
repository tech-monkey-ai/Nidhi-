# Nidhi — Complete Run Guide

> **TL;DR for judges / testers**: `npm install --legacy-peer-deps` → `npm start` → scan QR with Expo Go. Voice + ads need a dev build: `npm run dev:android` (one-time, then `npm start`).

---

## Quick Start (Expo Go — UI testing, no voice/ads)

### 1. Install Node.js 20+
Download from https://nodejs.org/ (LTS version). Verify:
```bash
node --version    # should print v20.x or higher
npm --version     # should print 10.x or higher
```

### 2. Download + unzip the project
Unzip `nidhi-mobile.zip` anywhere on your computer.

### 3. Install dependencies
```bash
cd nidhi-mobile
npm install --legacy-peer-deps
```
Takes 1–3 minutes. The `--legacy-peer-deps` flag is required for Expo SDK 57. A `postinstall` script auto-runs to patch 2 known SDK 57 bugs (TypeScript type augmentation + missing polyfills file).

### 4. Install Expo Go on your phone
- **Android**: Play Store → search "Expo Go" → Install
- **iPhone**: App Store → search "Expo Go" → Install

### 5. Connect phone + computer to the same Wi-Fi
Critical — Expo Go talks to your computer over the local network.

### 6. Start the dev server
```bash
npm start
```
A QR code appears in your terminal.

### 7. Scan the QR code
- **Android**: open Expo Go → tap "Scan QR code" → point at the QR
- **iPhone**: open Camera app → point at the QR → tap "Expo Go" notification

### 8. Use the app
Language picker loads in ~10–30 seconds (first load bundles the JS). Pick a language, complete onboarding, explore the 5 tabs.

---

## Where to Insert API Keys (EXACT locations)

The app works **100% without any API keys** — voice notes and ads silently no-op. You only need keys to test those specific features.

### There are 3 places you can put keys. Use the one that matches your workflow:

---

### Option A: Local `.env` file (for testing on your own phone)

**Step 1**: Create the file
```bash
cp .env.example .env
```

**Step 2**: Open `.env` in any text editor (VS Code, Notepad, vim, etc.)

**Step 3**: Fill in your keys on the right side of the `=`:
```env
SARVAM_API_KEY=your_actual_sarvam_key_here
REVENUECAT_ANDROID_KEY=your_actual_revenuecat_android_key_here
REVENUECAT_IOS_KEY=your_actual_revenuecat_ios_key_here
GOOGLE_ADS_ANDROID_APP_ID=
GOOGLE_ADS_IOS_APP_ID=
GOOGLE_ADS_BANNER_UNIT_ID=
GOOGLE_ADS_INTERSTITIAL_UNIT_ID=
```

**Step 4**: Save the file. Restart the dev server (`Ctrl+C`, then `npm start` again).

> **Security**: `.env` is in `.gitignore` — it will never be committed to git. Never share your `.env` file publicly.

---

### Option B: EAS Secrets (for cloud builds — most secure)

When you run `eas build`, your local `.env` file isn't uploaded. Set keys as encrypted EAS secrets instead:

```bash
eas login
eas secret:create --name SARVAM_API_KEY        --value "your-sarvam-key"
eas secret:create --name REVENUECAT_ANDROID_KEY --value "your-revenuecat-android-key"
eas secret:create --name REVENUECAT_IOS_KEY     --value "your-revenuecat-ios-key"
eas secret:create --name GOOGLE_ADS_ANDROID_APP_ID --value "ca-app-pub-XXXX~YYYY"
eas secret:create --name GOOGLE_ADS_BANNER_UNIT_ID --value "ca-app-pub-XXXX/YYYY"
eas secret:create --name GOOGLE_ADS_INTERSTITIAL_UNIT_ID --value "ca-app-pub-XXXX/YYYY"
```

Verify they're set:
```bash
eas secret:list
```

These are stored encrypted in EAS and injected at build time. They never appear in your source code or git history. **This is the recommended way for production.**

---

### Option C: `eas.json` env block (for different keys per environment)

Edit `eas.json` to add an `env` block to each build profile:

```json
{
  "build": {
    "preview": {
      "env": {
        "SARVAM_API_KEY": "test-key-for-preview-builds",
        "REVENUECAT_ANDROID_KEY": "test-rc-key"
      }
    },
    "production": {
      "env": {
        "SARVAM_API_KEY": "production-key",
        "REVENUECAT_ANDROID_KEY": "production-rc-key"
      }
    }
  }
}
```

> **Warning**: keys in `eas.json` ARE visible in source. Only use this for non-sensitive keys. For real secrets (like Sarvam), use Option B (EAS secrets).

---

## How the Keys Flow Through the App

Here's exactly what happens:

### Build time (when you run `npm start` or `eas build`)

1. Expo reads your `.env` file (or EAS secrets, or `eas.json` env)
2. It injects them into `app.config.ts` via `process.env.SARVAM_API_KEY` etc.
3. The `extra` block in `app.config.ts` packages them:
   ```ts
   extra: {
     sarvamApiKey: process.env.SARVAM_API_KEY ?? "",
     revenueCatAndroidApiKey: process.env.REVENUECAT_ANDROID_KEY ?? "REPLACE_WITH...",
     googleAdsBannerUnitId: process.env.GOOGLE_ADS_BANNER_UNIT_ID ?? "ca-app-pub-3940256099942544/9214589741",
   }
   ```
4. Expo bakes these into the app binary as `Constants.expoConfig.extra`

### Runtime (when the app runs on a phone)

1. `src/lib/voice.ts` reads the Sarvam key:
   ```ts
   const apiKey = Constants.expoConfig?.extra?.sarvamApiKey;
   if (!apiKey) return null;  // voice disabled — entry still saves without a note
   ```

2. `src/lib/revenuecat.ts` reads the RevenueCat + Google Ads keys:
   ```ts
   const rcKey = Constants.expoConfig?.extra?.revenueCatAndroidApiKey;
   if (!rcKey || rcKey.startsWith("REPLACE_WITH")) return;  // ads disabled
   const { bannerUnitId } = Constants.expoConfig?.extra;
   ```

3. If keys are present, the app calls Sarvam's API and Google Mobile Ads SDK with them.

### Fallback behavior (when keys are missing)

| Feature | Without key | With key |
|---|---|---|
| Voice notes | Mic button shows "Set SARVAM_API_KEY to enable". Entry saves without a note. | Mic records → Sarvam transcribes → transcript stored |
| RevenueCat | No-op (silently skips init) | Tracks ad revenue to your RC dashboard |
| Google Ads | Banner renders labelled "Ad" placeholder. No interstitial. | Real banner + interstitial ads from AdMob |
| Expo Go | All 3 above no-op (native modules not present) | N/A — use dev build |

---

## Dev Build (for testing voice + ads — requires Android Studio)

Voice notes (`expo-audio` recording) and ads (`react-native-purchases` + `react-native-google-mobile-ads`) are native modules not included in Expo Go. To test them, you need a dev build.

### One-time setup

1. Install Android Studio (https://developer.android.com/studio) — includes Android SDK
2. Open Android Studio → SDK Manager → install Android SDK 35 (or latest)
3. Connect your Android phone via USB (enable USB debugging in Developer Options) OR start an Android emulator

### Build the dev APK + install on your device

```bash
npm run dev:android
```
This runs `expo run:android`, which:
- Runs `expo prebuild` (generates `android/` folder)
- Compiles the native Android project via Gradle
- Installs the APK on your connected device/emulator

First build takes **5–10 minutes** (Gradle downloads + compiles native code). Subsequent builds are much faster.

### Subsequent runs

After the dev build is installed, you don't need to rebuild every time. Just:
```bash
npm start
```
The dev build connects to the Metro dev server and hot-reloads on JS changes.

### What works in Expo Go vs Dev Build

| Feature | Expo Go | Dev Build |
|---|---|---|
| All UI / navigation | ✓ | ✓ |
| Logging spending | ✓ | ✓ |
| Savings / Emergency Fund | ✓ | ✓ |
| Insights | ✓ | ✓ |
| Settings (language, dark mode, notifications) | ✓ | ✓ |
| Local notifications (Android) | ✓ | ✓ |
| **Voice notes (Sarvam AI)** | ✗ | ✓ |
| **RevenueCat ad attribution** | ✗ | ✓ |
| **Google Mobile Ads (banner + interstitial)** | ✗ | ✓ |
| Haptics | partial | ✓ |

---

## Production Build (for Play Store)

### Build the AAB (Android App Bundle)

```bash
eas build -p android --profile production
```

EAS builds it in the cloud and gives you a downloadable `.aab` file. Takes 10–20 minutes.

### Submit to Play Store

```bash
eas submit -p android --profile production
```

Or manually upload the `.aab` via the Play Console. See `PLAY_STORE_LISTING.md` for the full step-by-step guide.

---

## Which API keys do you actually need?

| Key | Required? | What it does | Where to get it |
|---|---|---|---|
| `SARVAM_API_KEY` | Optional | Voice note transcription | https://sarvam.ai/ |
| `REVENUECAT_ANDROID_KEY` | Optional | Ad revenue attribution | https://app.revenuecat.com/ |
| `REVENUECAT_IOS_KEY` | Optional (iOS only) | Ad attribution on iOS | https://app.revenuecat.com/ |
| `GOOGLE_ADS_ANDROID_APP_ID` | Optional (defaults to test ID) | AdMob app ID | https://apps.admob.com/ |
| `GOOGLE_ADS_BANNER_UNIT_ID` | Optional (defaults to test ID) | Banner ad unit | https://apps.admob.com/ |
| `GOOGLE_ADS_INTERSTITIAL_UNIT_ID` | Optional (defaults to test ID) | Interstitial ad unit | https://apps.admob.com/ |

> **For development**: leave the Google Ads keys BLANK — the app uses Google's official test ad unit IDs by default. This protects you from being flagged for invalid traffic on your real ad units.

> **For production**: set all keys via EAS secrets (Option B) before running `eas build`.

---

## Security Best Practices

1. **Never commit `.env` to git.** It's in `.gitignore` — leave it that way.
2. **Never hard-code keys in `src/` files.** Always read from `Constants.expoConfig.extra.*`.
3. **Use EAS secrets for production** (Option B) — keys are encrypted, never in source.
4. **The RevenueCat key is a public SDK key** — safe to ship in the APK. Anyone with the APK can extract it, but it can only display your ads.
5. **The Sarvam API key IS a secret.** Ship it via EAS secrets, never in source. For maximum security, proxy Sarvam calls through your own backend server.
6. **Run `npm run audit`** before every release to check for vulnerabilities.

---

## Troubleshooting

### `expo start` crashes with "Body is unusable: Body has already been read"
The `npm start` script sets `EXPO_OFFLINE=1` to bypass this. If you ran `npx expo start` directly, use `npm start` instead.

### App crashes on launch in Expo Go
Make sure you're using the latest Expo Go (SDK 57). The app auto-detects Expo Go and skips native module calls (voice, ads) — they no-op silently.

### Voice notes don't work
Voice recording requires a dev build (`npm run dev:android`), not Expo Go. Also check that `SARVAM_API_KEY` is set in your `.env`.

### Ads don't show
Ads require a dev build. Also check that `REVENUECAT_ANDROID_KEY` and Google Ads keys are set. In development, the app uses Google's test ad unit IDs — real ads only appear in production builds.

### `npm install` fails with peer dependency errors
Use `npm install --legacy-peer-deps` (required for Expo SDK 57).

### Prebuild fails
Run `node scripts/postinstall-patch.js` to apply the SDK 57 patches, then retry.
