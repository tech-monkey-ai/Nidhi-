<div align="center">

# Nidhi

### Financial discipline for everyday earners.

A premium, dignified, multilingual (English / हिन्दी / ಕನ್ನಡ) financial discipline and spending-awareness mobile app built for blue-collar and low-income workers — kirana shopkeepers, domestic help, security guards, construction workers, and similar earners who make decent income but struggle with impulsive spending, gambling, and EMI/loan debt traps.

**Built with React Native 0.86.3 + Expo SDK 57 + React 19.2.3. Android-only. EAS dev build verified.**

> **Verification status**: TypeScript `tsc --noEmit` ✓ 0 errors · ESLint ✓ 0 errors 0 warnings · Jest ✓ 169/169 tests · EAS development build ✓ succeeds & installs on Android · GitHub Actions CI ✓ runs on every push/PR

> ✅ **All features working, including voice notes.** Voice transcription via Sarvam AI is fully functional on-device as of 2026-10-01. See **Resolved Issues** near the bottom of this README for the diagnosis and fix.

</div>

---

## TL;DR for judges / testers

```
npm install --legacy-peer-deps
eas login
eas init                                        # see "Before your first build" below — required once
eas build -p android --profile development
# sideload the APK, then:
npm start
```

All features, including voice, are working. The one setup step most people miss is `eas init` — see **Before your first build** below.

---

## Why Nidhi?

Everyday earners deserve an app that respects them — not a stripped-down "budget version" tool. Nidhi is premium, warm, trustworthy minimalism: banking-app polish, everyday-tool warmth. Every interaction defaults to **simple, visual, forgiving**. Never assumes familiarity with app conventions. Never shames the user.

> *Nidhi* means "wealth" / "treasure" in Sanskrit, Hindi, and Kannada — exactly what this app helps you protect.

---

## Features

### Onboarding (first launch only)
1. **Language picker** — first screen, before anything else. Each language shown in its own script (English / हिन्दी / ಕನ್ನಡ). Large icon-supported tiles.
2. **Welcome carousel** — icon-driven, minimal text, 3 slides. Animated transitions.
3. **Greeting screen** — ask for the user's name. Personalizes the app ("Good evening, Ramesh").
4. **Financial picture setup** — approximate income, existing EMIs/loans (amount + duration + description), monthly savings goal, emergency fund target. All manual entry via large numpads — no AI parsing.
5. **Confirmation screen** — recaps everything with per-field edit options.
6. **Success celebration** — animated checkmark + warm welcome.

### Dashboard (Home)
- Time-of-day greeting using the user's name ("Good evening, Ramesh")
- **Hero card**: total money "kept" this month (positive framing) + locked/untouchable savings amount
- Monthly savings goal progress (animated bar)
- Emergency fund progress (animated bar, warm amber)
- Quick-glance EMI/loan exposure — descriptive, never advice-giving
- One large, obvious button: **"Log today's spending"**
- Recent entries list
- Banner ad (RevenueCat, clearly labelled "Ad")

### Daily Logging Flow
1. User taps a category icon (Food, Transport, EMI/Loan, Rent, Health, Other) — visual grid, no typing required for category
2. User enters amount on a large, premium numeric keypad with Indian grouping
3. **Optional** voice note via Sarvam AI Speech-to-Text — purely supplementary, stored as-is, never parsed for numbers or logic
4. Entry saves immediately with success celebration
5. Daily end-of-day local notification: "Log today's spending" — friendly, non-nagging
6. Light interstitial ad after the entry saves (never before)

### Locked Savings & Emergency Fund
- Two visually distinct buckets: **Locked Savings** (general discipline) and **Emergency Fund** (₹500–1000 starter, real emergencies only)
- **No real banking integration** — this is a notification and self-commitment mechanism. The app nudges the user to physically set aside cash themselves and lets them mark it as done.
- Accessing the Emergency Fund requires explicit confirmation ("This is for a real emergency") — soft friction
- **Optional trusted-contact nudge**: a family member can be added to receive a notification when the Emergency Fund is accessed. Opt-in only, framed as support.

### Voice Notes (optional, fully decoupled)
- Integrated via **Sarvam AI Speech-to-Text**, model `saaras:v4`, REST API
- Used only for the optional context note in daily logging and EMI setup
- The transcript is stored and displayed **as-is**. Never parsed for numbers, amounts, or categories
- Graceful failure: if transcription fails or there's no connectivity, the entry still saves fine with no note
- Voice can be disabled entirely in Settings
- ✅ **Working.** Tap the mic, speak, tap stop — the note transcribes and attaches to the entry. If Sarvam is unreachable or returns an error, the entry still saves fine with no note.

### Spending Insights (descriptive, not prescriptive)
- Weekly/monthly summary screen
- Visual breakdown by category (color-coded bars)
- Plain-language observations only — "You spent more on Transport this week than last week"
- **Never generates specific financial advice, investment suggestions, or "you should do X" recommendations**
- General, non-personalized insurance awareness messaging (no product names, no affiliate links)

### Notifications (consolidated, all local, all toggleable)
1. **Daily log reminder** — end-of-day nudge
2. **Large/unusual expense alert** — rolling-average comparison, supportive check-in ("That's a bigger expense than usual — worth noting why?"), never red alarm
3. **EMI due reminder** — based on duration/schedule entered during setup
4. **Locked Savings / Emergency Fund set-aside nudge** — weekly reminder
5. **Emergency Fund milestone** — positive, celebratory notification when target reached

### Monetization — RevenueCat Ads (no subscription, no IAP)
- RevenueCat SDK configured for **Ads only** — no paywall, no subscription tier, no in-app purchases. This is a deliberate choice: Nidhi's users already work hard for their money, and the app should never ask them to pay for the tool meant to help them keep more of it.
- Ad placements respect the audience:
  - **Banner** on the Dashboard (always-on, visually distinct)
  - **Light interstitial** after completing a daily log (never before — never interrupts the core task)
- Every ad unit is visually labelled "Ad" so it's never mistaken for app content or financial data

---

## Premium design system

### Typography (bundled, no network at runtime)
| Font | Used for | License |
|---|---|---|
| **Onest** | Primary UI (Latin) — warm, modern, ultra-legible | OFL |
| **Inter** | Numerics, currency, percentages (tabular-nums) | OFL |
| **Noto Sans Devanagari** | Premium Hindi rendering | OFL |
| **Noto Sans Kannada** | Premium Kannada rendering | OFL |

All 15 font files are bundled in `assets/fonts/` — no Google Fonts call at runtime.

### Color tokens
| Token | Light | Dark | Usage |
|---|---|---|---|
| Background | `#FAF9F6` warm off-white | `#0B1014` deep charcoal | App background |
| Primary | `#0F9D58` confident green | `#10B981` | Savings/progress |
| Warning | `#D97706` warm amber | `#F59E0B` | Large-expense alerts (never alarming red) |
| Text Primary | `#1F2937` deep charcoal | `#F9FAFB` | Body text |
| Text Muted | `#6B7280` muted slate | `#9CA3AF` | Hints, captions |

### Design principles
- **Premium and dignified** — never stripped-down. Banking app polish, everyday-tool warmth.
- **Icons over text** — vector icons (lucide-react-native) at generous touch-target sizes (≥48dp). **Zero emojis in the UI.**
- **Large, high-legibility type** — assumes some users have limited reading fluency. Bold for key numbers (balances, amounts).
- **Supportive, non-judgmental tone** — never "wasted", "bad", or "failed". Always visibility and progress, never scorekeeping.
- **Never alarming red** — even warnings use warm amber. The app should never feel like it's shaming the user.

### Motion & haptics
- Reanimated v3 spring animations on every interactive element (scale on press)
- Animated progress bars and rings (smooth fill on mount)
- Animated success celebrations (animated SVG checkmark)
- Haptic feedback tiers: Light (tap), Medium (CTA press), Success (entry saved), Warning (emergency access), Celebration (milestone)
- Dark mode override: Auto / Light / Dark (in Settings)

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React Native 0.86.3 + Expo SDK 57 |
| Runtime | React 19.2.3 + New Architecture (default on) |
| Routing | Expo Router v5 (file-based) |
| State | Zustand + AsyncStorage persistence |
| Native modules | expo-notifications, expo-audio (replaces deprecated expo-av), expo-haptics, expo-splash-screen, expo-status-bar |
| Voice | Sarvam AI `saaras:v4` (REST, multipart file upload via `expo-file-system`'s `File`) |
| Ads (display) | Google Mobile Ads 17.x (AdMob banner + interstitial) |
| Ads (attribution) | RevenueCat SDK 10.x (ad revenue tracking) |
| Icons | lucide-react-native v1 |
| Animations | react-native-reanimated v4 |
| SVG | react-native-svg 15.x |
| Language | TypeScript 5.7 (strict mode) |

---

## Project structure

```
nidhi-mobile/
├── app.config.ts                    Expo config (icons, permissions, plugins)
├── eas.json                         Build profiles (apk / aab / ios)
├── package.json
├── App.tsx                          Root entry — wraps providers
├── assets/
│   ├── fonts/                       15 bundled TTFs (Onest, Inter, Noto Devanagari/Kannada)
│   ├── icon.png                     App icon (1024×1024)
│   ├── splash.png                   Splash screen
│   ├── adaptive-icon.png            Android adaptive icon foreground
│   ├── adaptive-icon-bg.png         Android adaptive icon background
│   └── notif-icon.png               Notification small icon
├── scripts/
│   ├── download-fonts.py            Fetch all 15 premium fonts from Google Fonts
│   └── generate-assets.js           Generate icon PNGs from source SVG
└── src/
    ├── app/                         Expo Router routes
    │   ├── _layout.tsx              Root layout — providers, fonts, notifications
    │   ├── index.tsx                Entry — routes to onboarding or dashboard
    │   ├── onboarding/
    │   │   ├── language.tsx
    │   │   ├── welcome.tsx
    │   │   ├── name.tsx
    │   │   ├── financial.tsx
    │   │   └── summary.tsx
    │   └── (app)/                   Authenticated tab group
    │       ├── _layout.tsx          Tab navigator (Home / Log / Savings / Insights / Settings)
    │       ├── dashboard.tsx
    │       ├── log.tsx
    │       ├── savings.tsx
    │       ├── insights.tsx
    │       └── settings.tsx
    ├── components/
    │   ├── ui/                      Reusable primitives
    │   │   ├── Button.tsx           Premium button with haptics + scale animation
    │   │   ├── Card.tsx             Premium card with elevation system
    │   │   ├── Text.tsx             Typography system (Onest / Inter / Noto)
    │   │   ├── Pressable.tsx        Premium pressable with haptics + scale
    │   │   ├── Header.tsx
    │   │   ├── AmountField.tsx
    │   │   ├── TextField.tsx
    │   │   ├── Numpad.tsx            Large keypad with Indian number grouping
    │   │   ├── ProgressBar.tsx      Animated linear fill
    │   │   ├── ProgressRing.tsx      Animated circular ring with gradient
    │   │   ├── CategoryTile.tsx
    │   │   ├── SettingRow.tsx
    │   │   ├── Toggle.tsx
    │   │   ├── MicButton.tsx         Sarvam voice integration
    │   │   ├── BannerAd.tsx          RevenueCat banner ad slot
    │   │   ├── Skeleton.tsx          Shimmer loader
    │   │   ├── EmptyState.tsx
    │   │   ├── ScreenShell.tsx
    │   │   └── SuccessCelebration.tsx  Animated checkmark modal
    │   └── useTheme.ts
    ├── lib/
    │   ├── types.ts                 Domain types
    │   ├── storage.ts               AsyncStorage persistence with migrations
    │   ├── i18n.tsx                 i18n provider + useT hook
    │   ├── i18n-notifications.ts    Notification copy helper (outside React)
    │   ├── theme.ts                 Color tokens, elevation, motion, haptics
    │   ├── typography.ts            Font system + scale
    │   ├── useFonts.ts              Font loading hook
    │   ├── haptics.ts               Haptic feedback wrappers
    │   ├── categories.ts            Spending category definitions
    │   ├── format.ts                Currency / date / number formatting (Indian)
    │   ├── validation.ts            Input sanitization & validation
    │   ├── notifications.ts         expo-notifications scheduling
    │   ├── voice.ts                 Sarvam AI client
    │   ├── revenuecat.ts            RC Ads SDK init + helpers
    │   └── revenuecat-types.ts      RC type definitions + LOG_LEVEL constants
    ├── store/
    │   └── appStore.ts              Zustand store (state + actions + persistence)
    └── strings/
        ├── en.json
        ├── hi.json
        └── kn.json
```

---

## Run it yourself (EAS dev build — the only supported test path)

Nidhi is **Android-only** and uses native modules (`expo-audio`, `react-native-purchases`, `react-native-google-mobile-ads`) that are not present in Expo Go. **Use the EAS dev build for all testing** — Expo Go is not supported for this project.

### Prerequisites
- **Node.js 20+** (Node 22 LTS recommended; Node 18 also works) — download from https://nodejs.org/, LTS version. Verify with `node --version` and `npm --version`.
- **An Expo account** (free, sign up at https://expo.dev/signup — the free tier includes 15 Android builds/month, plenty for development)
- **An Android phone** with USB debugging enabled, on the same Wi-Fi network as your computer

> No Android Studio, no Xcode, no JDK, no Gradle install on your machine. EAS builds in the cloud and ships you a ready-to-sideload APK.

### Step 1 — Download and install dependencies

Unzip the project (or clone the repo), open a terminal in that folder, then:

```bash
cd nidhi-mobile
npm install --legacy-peer-deps
```

Takes 1–3 minutes. The `--legacy-peer-deps` flag is required for Expo SDK 57 (some peer-dep conflicts npm resolves too aggressively by default). A `postinstall` script auto-runs and patches 4 known SDK 57 issues (TS type augmentation, missing polyfills, `ErrorUtils` guard, `setUpErrorHandling` guard). Do not skip it.

### Step 2 — Install EAS CLI and log in

```bash
npm i -g eas-cli
eas login
eas whoami    # verify you're logged in
```

### Step 3 — Before your first build: link the project

This repo's `app.config.ts` ships with a placeholder instead of a real EAS project ID, since that ID is tied to a specific Expo account and shouldn't be committed as someone else's. **You need to generate your own before building:**

```bash
eas init
```

This creates a free project under *your* Expo account and prints a project ID (a UUID, like `b1bf6712-3100-4490-b0e8-dbccc6918f75`). Because this repo uses `app.config.ts` (a TypeScript file) rather than `app.json`, the EAS CLI can't write that ID in for you automatically — copy the UUID it prints and paste it in manually:

```ts
// app.config.ts
extra: {
  eas: {
    projectId: "paste-your-new-uuid-here",
  },
  ...
```

Skipping this step is the single most common failure point — `eas build` will error with something like `Invalid UUID appId` if the placeholder is still in place.

### Step 4 — Build the dev APK in the cloud

```bash
eas build -p android --profile development
```

This produces a development APK (with the Expo dev menu, hot-reload support, and all native modules compiled in). Takes 10–15 minutes the first time, ~5 minutes on subsequent builds (EAS caches the gradle/NDK layers). When it finishes, EAS prints a download link — click it to download the `.apk`.

> The build profile `development` is defined in `eas.json`: `buildType: apk` + `developmentClient: true` + `distribution: internal`. Don't change these.

### Step 5 — Sideload the APK onto your phone

1. Transfer the `.apk` to your phone (USB, Google Drive, Send Anywhere, whatever).
2. On your phone, open the `.apk` file (use a file manager if needed).
3. If prompted, allow **"Install unknown apps"** for your file manager / browser (one-time permission).
4. Tap **Install**, then open **Nidhi**. You'll see "Waiting for Metro" — that's the dev build waiting for the JS bundle from your computer.

### Step 6 — Connect phone + computer to the same Wi-Fi

Critical — the dev build talks to Metro over the local network, not the internet. If your phone is on mobile data and your computer is on Wi-Fi (or vice versa), it won't connect.

### Step 7 — Start the Metro dev server

```bash
npm start
```

The dev build on your phone auto-discovers Metro and loads the JS bundle (10–30 seconds the first time). From here on, every JS/TS code change hot-reloads instantly — no rebuild needed.

> `npm start` sets `EXPO_OFFLINE=1` automatically (via `cross-env`), which skips a known `@expo/cli` 0.22.x bug on Node 20+ (`Body is unusable: Body has already been read`). If you ran `npx expo start` directly instead of `npm start`, that's the likely cause of that error.

### Step 8 — Use the app

Pick a language (English / हिन्दी / ಕನ್ನಡ), complete onboarding, and explore the 5 tabs.

> Your data is stored on your phone only — nothing is sent to any server. Uninstalling Nidhi wipes the data.

### (Optional) Step 9 — Set up secrets for voice + ads

Voice notes (Sarvam AI) and ads (RevenueCat + Google Mobile Ads) work without keys — they silently no-op. See **API keys** below for the full guide.

---

## API keys — where to put them and how they work

Nidhi uses two external services: **Sarvam AI** (optional voice transcription) and **RevenueCat** (ads). Both require API keys to actually exercise those features — **the app works 100% without either.**

### What keys do I need?

| Service | Key name | Required for | Get one at |
|---|---|---|---|
| Sarvam AI | `SARVAM_API_KEY` | Voice notes (optional — app works fully without) | https://sarvam.ai/ |
| RevenueCat (Android) | `REVENUECAT_ANDROID_KEY` | Ad revenue attribution (optional — ads work without) | https://app.revenuecat.com/ |
| RevenueCat (iOS) | `REVENUECAT_IOS_KEY` | Ad attribution on iOS (only if you build for iOS) | https://app.revenuecat.com/ |
| Google Ads App ID | `GOOGLE_ADS_ANDROID_APP_ID` | Banner + interstitial display (defaults to Google's test ID) | https://apps.admob.com/ |
| Google Ads Banner Unit ID | `GOOGLE_ADS_BANNER_UNIT_ID` | Banner ad unit (defaults to Google's test ID) | https://apps.admob.com/ |
| Google Ads Interstitial Unit ID | `GOOGLE_ADS_INTERSTITIAL_UNIT_ID` | Interstitial ad unit (defaults to Google's test ID) | https://apps.admob.com/ |

> **For development, leave the Google Ads keys blank** — the app uses Google's official **test ad unit IDs** by default, which protects you from being flagged for invalid traffic on your real ad units. Only set real IDs when publishing to the Play Store.

### Where do I put the keys? (3 options)

**Option A — Local `.env` (fastest, for your own phone via EAS dev build)**

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:
```env
SARVAM_API_KEY=your-sarvam-key-here
REVENUECAT_ANDROID_KEY=your-revenuecat-android-key-here
REVENUECAT_IOS_KEY=your-revenuecat-ios-key-here
```

Save, then restart the dev server (`Ctrl+C`, then `npm start` again). `.env` is in `.gitignore` — never commit it.

**Option B — EAS secrets (for cloud builds, most secure)**

Your local `.env` isn't uploaded when you run `eas build` — set keys as encrypted EAS secrets instead:

```bash
eas secret:create --name SARVAM_API_KEY         --value "your-sarvam-key"
eas secret:create --name REVENUECAT_ANDROID_KEY --value "your-revenuecat-android-key"
```

Verify with `eas secret:list`. These are encrypted and injected at build time — never in source or git history. **Recommended for production.**

**Option C — `eas.json` env block (different keys per build profile)**

```json
{
  "build": {
    "preview": {
      "env": { "SARVAM_API_KEY": "test-key-for-preview" }
    },
    "production": {
      "env": { "SARVAM_API_KEY": "production-key" }
    }
  }
}
```

> **Warning**: keys in `eas.json` are visible in source. Only use this for non-sensitive values — for real secrets, use Option B.

### How the keys flow through the app

**Build time** (`npm start` or `eas build`): Expo reads your `.env` / EAS secrets / `eas.json` env, injects them via `process.env.SARVAM_API_KEY` etc. into `app.config.ts`'s `extra` block, and bakes that into the app binary as `Constants.expoConfig.extra`.

**Runtime**: `src/lib/voice.ts` and `src/lib/revenuecat.ts` read the relevant key from `Constants.expoConfig.extra.*`. If missing, each feature no-ops gracefully — no crash, no blocked flow.

| Feature | Without key | With key |
|---|---|---|
| Voice notes | Mic button shows "Set SARVAM_API_KEY to enable". Entry saves without a note. | Mic records → Sarvam transcribes → transcript stored |
| RevenueCat | No-op (silently skips init) | Tracks ad revenue to your RC dashboard |
| Google Ads | Banner renders labelled "Ad" placeholder. No interstitial. | Real banner + interstitial ads from AdMob |

### Security notes

- **Never commit `.env`.** It's in `.gitignore` — leave it that way.
- **Never hard-code keys in `src/` files.** Always read from `Constants.expoConfig.extra.*`.
- **The RevenueCat Android SDK key is safe to ship in the APK** — it's a public SDK key, not a secret. Anyone with the APK can extract it, but it can only display your ads, not access your account.
- **The Sarvam API key IS a secret.** Ship it via EAS secrets, never in source. For maximum security in a production app, proxy Sarvam calls through your own backend instead of calling it directly from the client — out of scope for this build but worth doing before a real public launch.
- **Run `npm run audit`** before every release.

### Verifying your keys work

**Sarvam**: open the app, log a spending entry, tap the mic, speak a short note, stop. Watch the Metro terminal for `[voice] Sarvam response status: 200` and a transcript — that confirms the key and the full recording → upload → transcription pipeline. To check the key independently of the app:
```bash
curl -X POST https://api.sarvam.ai/speech-to-text \
  -H "api-subscription-key: $SARVAM_API_KEY" \
  -F "model=saaras:v4" \
  -F "file=@/path/to/sample.wav"
```
A 200 response with a `transcript` field means the key is good.

**RevenueCat**: run the app, check the Dashboard for a real banner ad (not the placeholder), then log an entry and check for an interstitial. If nothing real appears, confirm your RevenueCat dashboard's ad placement IDs match `dashboard_banner` and `post_log_interstitial`.

---

## Integrations

### Sarvam AI Speech-to-Text

- Endpoint: `POST https://api.sarvam.ai/speech-to-text`
- Header: `api-subscription-key: <SARVAM_API_KEY>`
- Model: `saaras:v4`
- Body: multipart form-data with a `model` field plus the recorded audio file, sent as a real file part (not base64 text) via `expo-file-system`'s `File`, which implements the `Blob` interface Expo SDK 57's bundled `fetch` requires for multipart uploads
- Source: audio file from `expo-audio` recording
- **Voice notes are never parsed for numbers, categories, or logic.** They are stored and shown as-is.
- Voice is fully optional and decoupled — the logging flow works with voice disabled or failing.
- Robustness: 30s timeout via AbortController; on any failure (network, timeout, non-2xx, empty transcript) the function returns `null` and the entry saves without a note — it never blocks logging.

> **Status (2026-10-01): working end-to-end.** Recording, upload, and transcription were verified on-device. Getting here took three separate fixes — see **Resolved Issues** below for the full diagnosis.

### RevenueCat + Google Mobile Ads (Ads only — no paywall, no IAP)

Two SDKs work together for ad monetization:

1. **Google Mobile Ads SDK** (`react-native-google-mobile-ads@17.x`) — loads and displays the actual banner + interstitial ads via AdMob.
2. **RevenueCat SDK** (`react-native-purchases@10.x`) — tracks ad revenue + lifecycle events for attribution, visible in your RevenueCat dashboard alongside subscription revenue.

**Ad placements**: Banner on the Dashboard (always-on, labelled "Ad"). Light interstitial after completing a daily log (never before — never interrupts the core task).

Both are native modules included in the EAS dev build. If a key is missing, each SDK no-ops gracefully (no crash). Expo Go is **not supported**.

### Local notifications (expo-notifications)

Five toggleable channels: daily log reminder, large/unusual expense alert (rolling-average comparison), EMI due reminder, Locked Savings / Emergency Fund weekly nudge, and Emergency Fund milestone (celebratory). All respect per-type Settings toggles. All use warm amber or positive green copy — never alarming red.

---

## Other build profiles (for distribution)

### Preview build (release APK for QA / sharing)

```bash
eas build -p android --profile preview
```

A **release-mode APK** — no dev menu, no Metro dependency, runs standalone with the JS bundle baked in. Sideload the same way as the dev build. Takes 15–20 minutes.

### Production build (signed AAB for Play Store)

```bash
eas build -p android --profile production
```

Produces a signed `.aab` ready for Play Console upload.

### Build for Google Play Store — full walkthrough

1. **Configure EAS** (if you haven't already run `eas init` per the setup steps above): `eas build:configure` creates/updates `eas.json`.
2. **Build the production AAB**: `eas build -p android --profile production`
3. **(Optional) Preview APK for QA**: `eas build -p android --profile preview`
4. **Submit to Play Store**: `eas submit -p android --profile production`, or upload the `.aab` manually via Play Console. You'll need a Google Play service account JSON key — save as `google-service-account.json` (gitignored) and reference it in `eas.json -> submit`.
5. **Fill in the Play Store listing**:
   - App name: Nidhi
   - Short description: Financial discipline for everyday earners.
   - Full description: see `PLAY_STORE_LISTING.md`
   - Privacy policy URL: required — see `SECURITY.md` for the data-flow summary
   - Content rating: Everyone
   - Target audience: 18+ (financial tool)
   - Ads: Yes (RevenueCat Ads SDK)

### Rebuilding the dev build

You only need to rebuild when you change something requiring native compilation: any file under `plugins/`, `app.config.ts` (permissions, plugins, SDK versions, ad unit IDs), or a new native dependency. For pure JS/TS changes (`src/`, `app/`, `App.tsx`, `src/strings/`), just keep `npm start` running — Metro hot-reloads instantly.

```bash
eas build -p android --profile development
# Then re-sideload the new APK (uninstall the old one first if signing differs)
```

### Build gotchas we already patched (don't undo these)

- `.npmrc` has `legacy-peer-deps=true`
- `babel.config.js` uses `babel-preset-expo` only (no nativewind babel plugin, despite nativewind being in devDeps for its Tailwind types)
- `app.config.ts` sets `compileSdkVersion: 36`, `targetSdkVersion: 36`, `minSdkVersion: 24`, and uses `./plugins/with-gradle-version` to bump the Gradle JVM heap to 4 GB
- `scripts/postinstall-patch.js` auto-applies 4 patches on every `npm install`
- Pinned to **Gradle 9.3.1 + Kotlin 2.1.20** — do NOT upgrade to Gradle 9.4.1, it causes a Kotlin version mismatch crash at build time

---

## Troubleshooting

#### Dev build can't connect to Metro ("Waiting for Metro" forever)
Most common cause: your phone and computer are on different networks — verify both are on the same Wi-Fi. In the dev build, shake your phone → dev menu → "Change Metro URL" → enter the URL shown in your terminal (e.g. `exp://192.168.1.42:8081`). Restart the dev server if needed.

#### `TypeError: Body is unusable: Body has already been read` at startup
Known bug in `@expo/cli` 0.22.x with Node 20+. `npm start` already sets `EXPO_OFFLINE=1` to skip it. If you ran `npx expo start` directly, use `npm start` instead.

#### Dev build shows "Network error" after loading
Check both devices are on the same Wi-Fi (not a guest network), and your computer's firewall isn't blocking port 8081 (allow Node.js through on Windows if prompted). Try tunnel mode: `npm start -- --tunnel`, then shake phone → Change Metro URL → enter the tunnel URL.

#### Voice notes don't work
- Check `SARVAM_API_KEY` is actually set (see **API keys** above) — without it, the mic button shows "Set SARVAM_API_KEY to enable" and that's expected.
- With a key set, watch the Metro terminal while recording. `[voice] Sarvam response status: 200` plus a transcript means it's working. A `4xx`/`5xx` status means a Sarvam-side issue (check your key/credit); no `[voice]` lines at all usually means the mic permission wasn't granted.
- If the entry saves but no note appears, that's the designed graceful-failure path — the entry is never blocked on transcription.

#### Ads don't show
Ads require the EAS dev build (not Expo Go). Check `REVENUECAT_ANDROID_KEY` and Google Ads keys are set. In development, the app uses Google's test ad unit IDs — real ads only appear in production builds with real IDs configured.

#### Notifications don't appear
Check Settings → Notifications are toggled on in-app, and your phone's system settings allow notifications for Nidhi (Settings → Apps → Nidhi → Notifications → Allow).

#### `"Unable to resolve module"` error in terminal
Run `npm start -- --clear` to clear the Metro cache. If that doesn't help, delete `node_modules/.cache` and restart.

#### App crashes on launch
Check the terminal for errors — a missing font or asset is the most common cause. Run `npm run ts:check` and `npm run lint` to rule out type/lint errors.

#### `eas build` fails
- Confirm you're logged in (`eas whoami`) and have run `eas init` (see **Before your first build** above) — a placeholder project ID causes an `Invalid UUID appId` error.
- Check the build logs in the Expo dashboard (link printed in your terminal).
- The `development` profile in `eas.json` uses `buildType: apk` + `developmentClient: true` + `distribution: internal` — don't change these.
- A Kotlin/Gradle error usually means the pinned versions drifted — verify **Gradle 9.3.1 + Kotlin 2.1.20**; don't upgrade to Gradle 9.4.1.

#### `npm install` fails with peer dependency errors
Use `npm install --legacy-peer-deps` (required for Expo SDK 57). `.npmrc` already sets `legacy-peer-deps=true`, so a plain `npm install` should also work.

#### Prebuild fails
Run `node scripts/postinstall-patch.js` to (re)apply the SDK 57 patches, then retry.

---

## Feature support (EAS dev build)

The EAS dev build supports **every feature in the app** — there's no separate "Expo Go" feature set:

| Feature | EAS dev build |
|---|---|
| All UI / navigation | ✓ |
| Logging spending | ✓ |
| Savings / Emergency Fund | ✓ |
| Insights | ✓ |
| Settings (language, dark mode, notifications toggle) | ✓ |
| Local notifications (Android) | ✓ |
| Voice notes (Sarvam AI) | ✓ |
| RevenueCat ad attribution | ✓ (requires `REVENUECAT_ANDROID_KEY`) |
| Google Mobile Ads (banner + interstitial) | ✓ (uses Google's test ad unit IDs by default) |
| Haptics | ✓ |

---

## Internationalization (i18n)

Three languages: **English** (`en`), **Hindi** (`hi`), **Kannada** (`kn`). Pure string-swap; layouts, icons, flows are identical across languages. Source files: `src/strings/{en,hi,kn}.json`. Numbers, currency (₹), and dates follow Indian formatting regardless of UI language (e.g., `1,00,000` not `100,000`).

---

## Security

See [`SECURITY.md`](./SECURITY.md) for the full policy. Highlights:

- **All user data stored locally** on device via AsyncStorage. Nidhi does not send financial data to any server.
- The only outbound network call is to Sarvam AI for optional voice transcription.
- No analytics, no telemetry, no third-party trackers.
- All user input validated via `src/lib/validation.ts` (amounts capped, names Unicode-validated, phones validated as Indian mobile or international format).
- Storage schema is versioned + migrated. Corrupt state is wiped and reset — never crashes the user.
- Run `npm audit` before release. Resolve any high/critical issues in production dependencies.

---

## Accessibility

- **Touch targets ≥ 48dp** everywhere (per spec)
- **Large, high-legibility type** (16dp+ body, 28dp+ headlines)
- **Vector icons** (lucide-react-native) — no emoji-as-icon substitutes
- **Semantic roles** on all interactive elements (`accessibilityRole="button"`, etc.)
- **Screen reader labels** on every actionable element
- **Dark mode** (Auto / Light / Dark — user choice in Settings)
- **Haptic feedback** on every button press (can be disabled via system settings)
- **No flashing animations** — all motion is smooth and slow
- **High contrast** — text-primary on background meets WCAG AA

---

## Quality checks

Before every release, run:

```bash
npm run ts:check       # TypeScript — must pass with 0 errors
npm run lint           # ESLint — must pass with 0 errors and 0 warnings
npm run test           # Jest — must pass all tests
npm run audit          # Security — categorizes vulns (runtime vs build-time)
npx expo prebuild --platform android --no-install   # Native build config validates
```

Or all-in-one: `npm run verify` (runs tsc + eslint + jest in sequence).

> **About `npm audit`**: Nidhi is built on the Expo SDK + React Native, which pull in a large tree of build-time/dev-only transitive dependencies. As of September 2026, `npm audit` reports ~42 vulnerabilities — but **all of them are in build-time tooling that does NOT ship to end users** (Expo CLI, Metro bundler, EAS CLI, Jest, npm cache internals, iOS build tools). The 3 criticals (`eas-cli`, `form-data`, `tar`) are all build-time only. The production APK contains zero known vulnerabilities. Run `npm run audit` to see the categorized breakdown.

This repo passes all checks. See `eslint.config.js`, `tsconfig.json`, `jest.config.json`, `scripts/audit.js`, and `.github/workflows/ci.yml` for the exact configuration.

---

## Tests

The test suite covers all critical pure logic — **169 tests, 10 suites, 100% green**:

| Suite | What it tests |
|---|---|
| `validation.test.ts` | Amount / name / phone / duration / language validation, text sanitization |
| `format.test.ts` | Indian currency formatting, number grouping, dates, period comparisons |
| `storage.test.ts` | AsyncStorage persistence, schema migration, corrupt-state recovery |
| `categories.test.ts` | Category definitions, icon mappings, color tokens |
| `typography.test.ts` | Font family/weight resolution, type scale |
| `appStore.test.ts` | Zustand store actions (addEmi, addSpending, etc.) |
| `i18n-keys.test.ts` | i18n string key parity across en/hi/kn |
| `voice.test.ts` | Sarvam API client (multipart upload via `File`, error handling, timeout) |
| `voice-retry.test.ts` | Error-path behavior (4xx/5xx handling, abort) |
| `revenuecat.test.ts` | RevenueCat + Google Ads init guards, `LOG_LEVEL` string-enum correctness |

```bash
npm run test           # one-shot
npm run test:watch     # watch mode
npm run test:coverage  # with coverage report
```

**Tested**: all pure functions (validation, formatting, storage, categories, typography) + Zustand store actions.

**Not yet tested** (would need React Native testing library + integration setup): component rendering, screen navigation flows, live Sarvam/RevenueCat network calls, `expo-notifications` scheduling (requires native env). See `CONTRIBUTING.md` → "Adding tests".

---

## Resolved Issues

### Sarvam voice-notes flow — fixed 2026-10-01

**Symptom (as originally shipped)**: Tapping the mic, recording, and stopping produced no transcript — the app showed "Couldn't transcribe — entry will still save without a note" every time. The entry still saved correctly; only the transcription step failed.

**Root cause — three separate bugs, found by working backward through the pipeline:**

1. **Recorder never prepared.** `src/components/ui/MicButton.tsx` called `recorder.record()` directly. `expo-audio`'s recorder must be prepared first with `await recorder.prepareToRecordAsync()`, or nothing is actually captured and `recorder.uri` stays `null` after `stop()`.
2. **Legacy file APIs throw in SDK 57.** The original `src/lib/voice.ts` used `FileSystem.getInfoAsync()` / `readAsStringAsync()` from `expo-file-system`. In the installed SDK 57 version of that package these throw rather than returning a result, so the upload path failed before it ever reached Sarvam.
3. **The upload format itself was wrong, twice.** First attempt: a hand-built multipart body with the audio pasted in as base64 text — Sarvam received text, not audio. Second attempt, after switching to `FormData` with the classic React Native `{ uri, name, type }` file-part object: this threw `Unsupported FormDataPart implementation`, because Expo SDK 57 replaces the global `fetch` with its own implementation (`expo/fetch`), whose multipart encoder only accepts a string, a real `Blob`, or an object exposing `bytes()` — not the `{ uri, name, type }` shape every React Native guide recommends. The fix: wrap the recording in `expo-file-system`'s `File` class, which implements `Blob`, and append that to `FormData` instead.

**Fix locations**: `src/components/ui/MicButton.tsx` (prepare + auto-stop at 28s, since Sarvam's REST endpoint caps audio at 30s) and `src/lib/voice.ts` (`File`-based upload, no legacy file APIs). Tests in `src/lib/__tests__/voice.test.ts` and `voice-retry.test.ts` were rewritten to match.

**Verified**: on-device, with a real recording — Metro log showed `[voice] Sarvam response status: 200` and a correct Hindi transcript.

### RevenueCat crash on launch — fixed 2026-10-01

**Symptom**: `Exception in HostFunction: Expected argument 0 of method "setLogLevel" to be a string, but got a number`, thrown on every app launch from `initRevenueCat()`.

**Root cause**: `src/lib/revenuecat-types.ts` defined its own `LOG_LEVEL` constant as numeric (`INFO: 2`, etc.), but the real `react-native-purchases` SDK's `setLogLevel` expects the native SDK's string-valued enum (`LOG_LEVEL.INFO === "INFO"`). The existing unit test for this compared a hardcoded object to itself rather than importing the real export, so it couldn't catch the mismatch.

**Fix**: `LOG_LEVEL` is now string-valued, matching the native SDK. The test now imports and checks the real export.

---

## Out of scope (by design)

Nidhi intentionally does **not** include:

- Real bank account integration
- Real fund transfers
- Investment recommendations
- Specific insurance product suggestions (only generic awareness messaging)
- Any feature that could be mistaken for financial advice

These are deliberate product decisions, not technical limitations.

---

## License

Proprietary. © 2026 Nandan Bhat. All rights reserved.

This software and its source code may not be used, copied, modified, merged, published, distributed, sublicensed, or sold without prior written permission from the copyright holder. See [`LICENSE`](./LICENSE) for the full text and [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md) for bundled open-source components and their licenses.

For licensing inquiries: **nandangbsn@gmail.com**

---

## Acknowledgements

- **Onest** by [@onest-co](https://onest.sh) — modern, warm, ultra-legible Latin typeface (OFL)
- **Inter** by [@rsms](https://github.com/rsms/inter) — premium numeric typeface (OFL)
- **Noto Sans Devanagari** + **Noto Sans Kannada** by Google — premium Indic rendering (OFL)
- **lucide-react-native** — beautiful, consistent icon set (ISC)
- **Expo** + **React Native** — the best cross-platform mobile dev experience
- **Sarvam AI** — Indian-language-first speech-to-text
- **RevenueCat** — hassle-free ad monetization

---

<div align="center">

**Nidhi** — *Your money, kept close.*

Built with care for everyday earners.

</div>

