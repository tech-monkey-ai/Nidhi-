# Nidhi — Complete Run Guide

> **TL;DR for judges / testers**: `npm install --legacy-peer-deps` → `eas build -p android --profile development` → sideload APK → `npm start`. Voice is currently broken on our side; everything else works.

---

## Quick Start (EAS dev build — the only supported test path)

Nidhi is **Android-only** and uses native modules (`expo-audio`, `react-native-purchases`, `react-native-google-mobile-ads`) that aren't present in Expo Go. **Use the EAS dev build for all testing** — Expo Go is not supported.

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
Takes 1–3 minutes. The `--legacy-peer-deps` flag is required for Expo SDK 57. A `postinstall` script auto-runs to patch 4 known SDK 57 bugs (TS type augmentation, missing polyfills, `ErrorUtils` guard, `setUpErrorHandling` guard).

### 4. Install EAS CLI and log in
```bash
npm i -g eas-cli
eas login
eas whoami    # verify you're logged in
```
Don't have an Expo account? Sign up free at https://expo.dev/signup — the free tier includes 15 Android builds/month.

### 5. Build the dev APK in the cloud
```bash
eas build -p android --profile development
```
Takes 10–15 minutes the first time, ~5 minutes on subsequent builds (EAS caches the gradle/NDK layers). When it finishes, EAS prints a download link — click it to download the `.apk` file to your computer.

### 6. Sideload the APK onto your Android phone
1. Transfer the `.apk` to your phone (USB, Google Drive, Send Anywhere).
2. On your phone, open the `.apk` file (use a file manager if needed).
3. Allow "Install unknown apps" for your file manager / browser when prompted.
4. Tap **Install**.
5. Open **Nidhi** from your app drawer. You'll see a screen saying "Waiting for Metro" — that's the dev build waiting for the JS bundle from your computer.

### 7. Connect phone + computer to the same Wi-Fi
Critical — the dev build talks to Metro over the local network.

### 8. Start the Metro dev server
```bash
npm start
```
The dev build on your phone auto-discovers Metro and loads the JS bundle. From here on, every code change hot-reloads instantly — no rebuild needed.

> The `npm start` script sets `EXPO_OFFLINE=1` automatically (via `cross-env`). This skips Expo's online version-check step which crashes on Node 20+ due to a known `@expo/cli` bug. If you ever need the online check, run `npm run start:online` instead.

### 9. Use the app
Language picker loads in ~10–30 seconds (first load bundles the JS). Pick a language, complete onboarding, explore the 5 tabs.

> Your data is stored on your phone only — nothing is sent to any server. Uninstalling Nidhi wipes the data.

---

## Where to Insert API Keys (EXACT locations)

The app works **100% without any API keys** — voice notes and ads silently no-op. You only need keys to test those specific features.

> ⚠️ **Note on voice keys**: even with a valid `SARVAM_API_KEY`, voice notes are currently broken on our side (see **Known Issues** at the end of this guide). The key is still worth setting — it works the moment the `expo-audio` bug is fixed, and can be verified independently via curl.

### There are 3 places you can put keys. Use the one that matches your workflow:

---

### Option A: Local `.env` file (for testing on your own phone via EAS dev build)

**Step 1**: Create the file
```bash
cp .env.example .env
```

**Step 2**: Open `.env` in any text editor (VS Code, Notepad, vim, etc.)

**Step 3**: Fill in your keys on the right side of the `=`:
```env
SARVAM_API_KEY=your_actual_sarvam_key_here
REVENUECAT_ANDROID_KEY=your_actual_revenuecat_android_key_here
GOOGLE_ADS_ANDROID_APP_ID=
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
| Voice notes | Mic button shows "Set SARVAM_API_KEY to enable". Entry saves without a note. | Mic records → Sarvam transcribes → transcript stored (⚠️ currently broken — see Known Issues) |
| RevenueCat | No-op (silently skips init) | Tracks ad revenue to your RC dashboard |
| Google Ads | Banner renders labelled "Ad" placeholder. No interstitial. | Real banner + interstitial ads from AdMob |

---

## Rebuilding the dev build

You only need to rebuild when you change something that requires native compilation:
- Any file under `plugins/`
- `app.config.ts` (permissions, plugins, SDK versions, ad unit IDs)
- A new native dependency (a package that requires its own native module)

For pure JS/TS changes (anything under `src/`, `app/`, `App.tsx`, `src/strings/`), just keep `npm start` running — Metro hot-reloads instantly, no rebuild needed.

```bash
# Rebuild after native changes
eas build -p android --profile development

# Then re-sideload the new APK (uninstall the old one first if signing differs)
```

### Build gotchas we already patched (don't undo these)

- `.npmrc` has `legacy-peer-deps=true`
- `babel.config.js` uses `babel-preset-expo` only (no nativewind babel plugin)
- `app.config.ts` sets `compileSdkVersion: 36`, `targetSdkVersion: 36`, `minSdkVersion: 24`, and uses `./plugins/with-gradle-version` to bump the Gradle JVM heap to 4 GB
- `scripts/postinstall-patch.js` auto-applies 4 patches on every `npm install`
- Pinned to **Gradle 9.3.1 + Kotlin 2.1.20** — do NOT upgrade to Gradle 9.4.1, it causes a Kotlin version mismatch crash at build time

---

## Other build profiles (for distribution)

### Preview build (release APK for QA / sharing)

Use this when you want a standalone APK to share with testers, without Metro dev server dependency.

```bash
eas build -p android --profile preview
```

This produces a **release-mode APK** (no dev menu, no Metro dependency — runs standalone with the JS bundle baked in). Sideload it the same way as the dev build. Takes 15–20 minutes.

### Production build (signed AAB for Play Store)

```bash
eas build -p android --profile production
```

Produces a signed `.aab` ready for Play Console upload. See `README.md` → "Build for Google Play Store" for the full walkthrough.

---

## Which API keys do you actually need?

| Key | Required? | What it does | Where to get it |
|---|---|---|---|
| `SARVAM_API_KEY` | Optional | Voice note transcription (⚠️ currently broken — see Known Issues) | https://sarvam.ai/ |
| `REVENUECAT_ANDROID_KEY` | Optional | Ad revenue attribution | https://app.revenuecat.com/ |
| `GOOGLE_ADS_ANDROID_APP_ID` | Optional (defaults to test ID) | AdMob app ID | https://apps.admob.com/ |
| `GOOGLE_ADS_BANNER_UNIT_ID` | Optional (defaults to test ID) | Banner ad unit | https://apps.admob.com/ |
| `GOOGLE_ADS_INTERSTITIAL_UNIT_ID` | Optional (defaults to test ID) | Interstitial ad unit | https://apps.admob.com/ |

> **For development**: leave the Google Ads keys BLANK — the app uses Google's official **test ad unit IDs** by default. This protects you from being flagged for invalid traffic on your real ad units.

> **For production**: set all keys via EAS secrets (Option B) before running `eas build -p android --profile production`.

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

### Dev build can't connect to Metro ("Waiting for Metro" forever)
- **Most common cause**: your phone and computer are on different networks. Verify both are on the same Wi-Fi.
- In the dev build, shake your phone to open the dev menu → tap "Change Metro URL" → enter the URL shown in your terminal (something like `exp://192.168.1.42:8081`).
- Restart the dev server: press `Ctrl+C` in your terminal, then `npm start` again.

### Dev build shows "Network error" after loading
- Your phone can't reach your computer. Check that:
  - Both are on the same Wi-Fi network (not a guest network)
  - Your computer's firewall isn't blocking port 8081
  - On Windows: allow Node.js through the firewall when prompted
- Try tunnel mode: `npm start -- --tunnel` (slower but works through firewalls). Then in the dev build, shake phone → Change Metro URL → enter the tunnel URL.

### Voice notes don't work
⚠️ **Currently broken on our side.** After `recorder.stop()` returns, `recorder.uri` is `null` in `src/components/ui/MicButton.tsx`, so no audio file is sent to Sarvam. The Sarvam API itself is fine — verify with:
```bash
curl -X POST https://api.sarvam.ai/speech-to-text \
  -H "api-subscription-key: $SARVAM_API_KEY" \
  -F "model=saaras:v4" \
  -F "file=@sample.wav"
```
If the curl call returns a transcript, your key works — the bug is in our `expo-audio` integration. See **Known Issues** in the main README for the full diagnosis and fix plan.

### Ads don't show
Ads require the EAS dev build (not Expo Go). Also check that `REVENUECAT_ANDROID_KEY` and Google Ads keys are set. In development, the app uses Google's test ad unit IDs — real ads only appear in production builds.

### `eas build` fails
- Make sure you're logged in (`eas whoami`).
- Check the build logs in the Expo dashboard (link in your terminal).
- The build profile `development` in `eas.json` uses `buildType: apk` + `developmentClient: true` + `distribution: internal` — don't change these.
- If the build fails with a Kotlin/Gradle error, verify the pinned versions: **Gradle 9.3.1 + Kotlin 2.1.20**. Don't upgrade to Gradle 9.4.1 (causes a Kotlin version mismatch crash).

### `npm install` fails with peer dependency errors
Use `npm install --legacy-peer-deps` (required for Expo SDK 57). A `.npmrc` with `legacy-peer-deps=true` is already in the repo, so a plain `npm install` should also work.

### Prebuild fails
Run `node scripts/postinstall-patch.js` to apply the SDK 57 patches, then retry.

---

## Known Issues

### ⚠️ Sarvam voice-notes flow is broken on our side (Sarvam API itself is fine)

**Symptom**: User taps the mic button, records a voice note, stops recording, and sees "Couldn't transcribe — entry will still save without a note". The entry still saves correctly. No transcript is ever produced.

**Root cause**: The bug is in `src/components/ui/MicButton.tsx`, in Nidhi's integration with `expo-audio`. After `recorder.stop()` returns, `recorder.uri` is `null` and the recording-status callback never fires with a valid `status.url`. No audio file is produced → no request is made to Sarvam → no transcript.

**What's NOT the cause**:
- ❌ Not a Sarvam outage or API issue — Sarvam's `saaras:v4` endpoint works fine when called directly with curl
- ❌ Not a missing API key — `SARVAM_API_KEY` is read correctly
- ❌ Not a permissions issue — `RECORD_AUDIO` permission is granted
- ❌ Not an `expo-audio` SDK bug at the package level

**Impact**: Voice notes are the only affected feature. Everything else (logging, savings, insights, notifications, ads, haptics) works fully.

**Workaround**: Disable voice notes in Settings → "Voice notes" toggle off. The mic button is hidden and the logging flow works perfectly without it.

See the main `README.md` → **Known Issues** section for the full suspected-fix-areas list.
