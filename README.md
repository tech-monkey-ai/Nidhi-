<div align="center">

# Nidhi

### Financial discipline for everyday earners.

A premium, dignified, multilingual (English / हिन्दी / ಕನ್ನಡ) financial discipline and spending-awareness mobile app built for blue-collar and low-income workers — kirana shopkeepers, domestic help, security guards, construction workers, and similar earners who make decent income but struggle with impulsive spending, gambling, and EMI/loan debt traps.

**Built with React Native 0.87 + Expo SDK 57 + React 19.2. Builds verified. Tests pass.**

> **Verification status**: TypeScript `tsc --noEmit` ✓ 0 errors · ESLint ✓ 0 errors 0 warnings · Jest ✓ 152/152 tests · `expo prebuild --platform android` ✓ succeeds (with `EXPO_OFFLINE=1`) · Security audit ✓ 0 runtime vulnerabilities · GitHub Actions CI ✓ runs on every push/PR

</div>

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
- RevenueCat SDK configured for **Ads only** — no paywall, no subscription tier, no in-app purchases
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
| Framework | React Native 0.87 + Expo SDK 57 |
| Runtime | React 19.2 + New Architecture (default on) |
| Routing | Expo Router v5 (file-based) |
| State | Zustand + AsyncStorage persistence |
| Native modules | expo-notifications, expo-audio (replaces deprecated expo-av), expo-haptics, expo-splash-screen, expo-status-bar |
| Voice | Sarvam AI `saaras:v4` (REST, base64 audio upload) |
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
    │   └── revenuecat.ts            RC Ads SDK init + helpers
    ├── store/
    │   └── appStore.ts              Zustand store (state + actions + persistence)
    └── strings/
        ├── en.json
        ├── hi.json
        └── kn.json
```

---

## Quick start (local dev)

### Prerequisites
- **Node.js 20+** (Node 22+ recommended; Node 18 also works)
- **A phone** (Android or iPhone) on the same Wi-Fi network as your computer
- **Expo Go** app installed on your phone (free, from Play Store / App Store)

> **No Android Studio or Xcode required** for the Expo Go path. You only need those for native dev builds.

### Install & run

```bash
cd nidhi-mobile
npm install --legacy-peer-deps
npm start
```

That's it. A QR code appears in your terminal — scan it with Expo Go (Android) or the Camera app (iOS). The app loads on your phone in ~10 seconds.

> The `npm start` script sets `EXPO_OFFLINE=1` automatically (via `cross-env`). This skips Expo's online version-check step which crashes on Node 20+ due to a known `@expo/cli` bug (`Body is unusable: Body has already been read`). If you ever need the online check, run `npm run start:online` instead.

### (Optional) Set up secrets for voice + ads

Voice notes (Sarvam AI) and ads (RevenueCat) work without keys — they just no-op silently. To enable them:

```bash
cp .env.example .env
# Edit .env with your SARVAM_API_KEY and REVENUECAT_ANDROID_KEY
```

Or via EAS environment variables for cloud builds:

```bash
eas secret:create --name SARVAM_API_KEY        --value <your-key>
eas secret:create --name REVENUECAT_ANDROID_KEY --value <your-key>
eas secret:create --name REVENUECAT_IOS_KEY     --value <your-key>
```

---

## Run on your phone via Expo Go (full step-by-step guide)

This is the **easiest way** to see Nidhi running on your phone. No native build, no Android Studio, no Xcode. Just your computer + your phone + the same Wi-Fi network.

### Step 1: Install Node.js on your computer

1. Go to https://nodejs.org/
2. Download the **LTS version** (20.x or 22.x).
3. Run the installer. Accept all defaults.
4. Verify installation by opening a terminal (Command Prompt / PowerShell / Terminal) and typing:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers, not errors.

### Step 2: Download the Nidhi source code

1. Download the `nidhi-mobile.zip` file.
2. Unzip it anywhere on your computer (e.g., `C:\Users\yourname\nidhi-mobile` on Windows, or `~/nidhi-mobile` on Mac/Linux).
3. Open a terminal in that folder:
   - **Windows**: Open File Explorer → navigate to the folder → click the address bar → type `powershell` → press Enter
   - **Mac/Linux**: Open Terminal → `cd ~/path/to/nidhi-mobile`

### Step 3: Install dependencies

In your terminal, run:

```bash
npm install --legacy-peer-deps
```

This takes 1–3 minutes the first time. You'll see lots of output — that's normal. When it finishes, you'll see something like `added 1500 packages`.

> The `--legacy-peer-deps` flag is required because Expo SDK 52 has some peer-dep conflicts that npm resolves too aggressively by default.

### Step 4: Install Expo Go on your phone

- **Android**: Open the Google Play Store → search for "Expo Go" → Install
- **iPhone**: Open the App Store → search for "Expo Go" → Install

> The Expo Go app is free, made by Expo (the same team that makes the framework Nidhi is built on).

### Step 5: Connect your phone and computer to the same Wi-Fi

This is **critical**. Expo Go talks to your computer over the local network. If your phone is on mobile data and your computer is on Wi-Fi (or vice versa), it won't work.

- Connect both devices to the same Wi-Fi network (e.g., your home Wi-Fi).
- If you're on a corporate / campus network that blocks local traffic, see the **Troubleshooting** section below.

### Step 6: Start the dev server

In your terminal (still in the `nidhi-mobile` folder), run:

```bash
npm start
```

You'll see a screen like this in your terminal:

```
› Metro waiting on exp://192.168.1.42:8081
› Scan QR with Expo Go to open the app

  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  █ ▄▄▄▄▄ █ ▀▀▀█ ▄▄▄▄▄ █
  █ █   █ █▀▀ ▄█   █ █
  █ █▄▄▄█ █▀▄ █▄▄▄█ █
  █▄▄▄▄▄▄▄█ █ ▄█▄▄▄▄▄▄▄█
  █  ▄▀▄▄▄ ▀▄▀▀▀▀ ▄ ▄▄▀█
  █ █▀  ▀▄▄ ▀ ▄▀▀ ▀▄ ▀ █
  █ █ █ ▄ ▀▀▄▀█▄▄▄▀ ▄█▀ █
  █▄ █▄█▄▄▄█▄█▄▄▄█▄███▄▄█
  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

  › Press ? to show help
```

A QR code appears in your terminal. Keep this terminal open — the dev server runs as long as this terminal is open.

### Step 7: Scan the QR code with your phone

- **Android**: Open the **Expo Go** app → tap "Scan QR code" → point your camera at the QR code on your computer screen.
- **iPhone**: Open the **Camera app** (the native one, not Expo Go) → point it at the QR code → a notification appears saying "Expo Go" → tap it.

### Step 8: Wait for the bundle to load

The first load takes 10–30 seconds while Metro bundles the JavaScript. You'll see a progress bar on your phone. Subsequent loads are nearly instant (Metro caches the bundle).

Once loaded, you'll see the Nidhi language picker screen. 🎉

### Step 9: Use the app

- Pick a language (English / हिन्दी / ಕನ್ನಡ)
- Tap through the welcome carousel
- Enter your name
- Enter your financial picture (income, savings goal, etc.)
- You're in! Tap the bottom-nav tabs to explore.

> Your data is stored on your phone only — nothing is sent to any server. Uninstalling Expo Go wipes the data.

### Troubleshooting

#### "Could not load" / white screen after scanning QR
- **Most common cause**: your phone and computer are on different networks. Verify both are on the same Wi-Fi.
- Try the manual connection: in Expo Go, tap "Enter URL manually" → enter the URL shown in your terminal (something like `exp://192.168.1.42:8081`).
- Restart the dev server: press `Ctrl+C` in your terminal, then `npm start` again.

#### `TypeError: Body is unusable: Body has already been read` at startup
- This is a known bug in `@expo/cli` 0.22.x with Node 20+. The `npm start` script in this repo already sets `EXPO_OFFLINE=1` via `cross-env` to skip the buggy code path. If you ran `npx expo start` directly, use `npm start` instead.

#### QR code doesn't appear
- Your terminal might be too narrow. Try making the window wider, or run `npm start -- --tunnel` to get a URL instead of a QR code.

#### App loads but shows "Network error"
- Your phone can't reach your computer. Check that:
  - Both are on the same Wi-Fi network (not a guest network)
  - Your computer's firewall isn't blocking port 8081
  - On Windows: allow Node.js through the firewall when prompted
- Try the tunnel mode: `npm start -- --tunnel` (slower but works through firewalls)

#### Voice notes don't work
- Voice recording requires a **native build** (not Expo Go). This is an Expo Go limitation, not a Nidhi bug. See "Option 2: Dev build" below.
- All other features (logging, savings, insights, notifications) work fine in Expo Go.

#### Notifications don't appear
- Notifications work in Expo Go on Android but require a dev build on iOS.
- Check Settings → Notifications → toggle them on.
- Make sure your phone's system settings allow notifications for Expo Go.

#### "Unable to resolve module" error in terminal
- Run `npx expo start --clear` (or `npm start -- --clear`) to clear the Metro cache.
- If that doesn't help, delete `node_modules/.cache` and restart.

#### App crashes on launch
- Check the terminal for errors. Most common cause is a missing font or asset.
- Run `npm run ts:check` to verify there are no TypeScript errors.
- Run `npm run lint` to verify there are no ESLint errors.

### What works in Expo Go vs. what needs a dev build

| Feature | Expo Go | Dev build (`expo run:android`) |
|---|---|---|
| All UI / navigation | ✓ | ✓ |
| Logging spending | ✓ | ✓ |
| Savings / Emergency Fund | ✓ | ✓ |
| Insights | ✓ | ✓ |
| Settings (language, dark mode, notifications toggle) | ✓ | ✓ |
| Local notifications (Android) | ✓ | ✓ |
| Local notifications (iOS) | ✗ | ✓ |
| **Voice notes (Sarvam AI)** | ✗ | ✓ (requires SARVAM_API_KEY) |
| **RevenueCat ad attribution** | ✗ (silently no-ops) | ✓ (requires REVENUECAT_ANDROID_KEY) |
| **Google Mobile Ads (banner + interstitial)** | ✗ (renders placeholder) | ✓ (uses test ad unit IDs by default) |
| Haptics | partial | ✓ |

For 90% of testing and demos, Expo Go is perfect. For testing voice notes or ads, build a dev build:

```bash
# One-time setup: build the dev APK and install on your phone/emulator
npm run dev:android    # = expo run:android

# Subsequent runs: just start the dev server, the dev build connects to it
npm start
```

The first `npm run dev:android` takes 5–10 minutes (gradle build). After that, the dev build is installed on your device and you can use `npm start` to reload it instantly.

---

## Other ways to run Nidhi

### Option 2: Dev build (full native features, including voice)

Use this when you need to test voice notes, ads, or iOS notifications.

1. Install Android Studio (Android) or Xcode (iOS) on your computer.
2. In `nidhi-mobile`:
   ```bash
   npm install --legacy-peer-deps
   npx expo run:android     # builds & installs on a connected Android device/emulator
   npx expo run:ios          # builds & installs on a connected iOS device/simulator
   ```
3. The first build takes 5–10 minutes (gradle / cocoapods setup). Subsequent builds are fast.

### Option 3: Cloud build via EAS (no local toolchain needed)

Use this if you want a standalone APK to share with someone, without installing Android Studio.

1. Install EAS CLI:
   ```bash
   npm i -g eas-cli
   eas login
   ```
2. Build a preview APK:
   ```bash
   eas build -p android --profile preview
   ```
3. EAS builds it in the cloud and gives you a downloadable `.apk` link.
4. Sideload the APK onto your phone (Android: open the file, allow "install from unknown sources" if prompted).

### Option 4: Production AAB for Play Store

```bash
eas build -p android --profile production
```

Produces a signed `.aab` ready for Play Console upload. See the "Build for Google Play Store" section below for the full walkthrough.

---

## Build for Google Play Store

### 1. Configure EAS

```bash
eas login
eas build:configure        # creates eas.json (already present in this repo)
```

Set `extra.eas.projectId` in `app.config.ts` to the ID returned.

### 2. Build the production AAB

```bash
eas build -p android --profile production
```

This produces a signed `.aab` ready for Play Console upload.

### 3. (Optional) Preview APK for QA

```bash
eas build -p android --profile preview
```

### 4. Submit to Play Store

```bash
eas submit -p android --profile production
# or upload the .aab manually via Play Console
```

> You'll need a Google Play service account JSON key — save it as `google-service-account.json` (gitignored) and reference it in `eas.json -> submit`.

### 5. Fill in Play Store listing

In the Play Console:
- **App name**: Nidhi
- **Short description**: Financial discipline for everyday earners.
- **Full description**: See `PLAY_STORE_LISTING.md` (or copy from this README's intro).
- **Privacy policy URL**: Required — Nidhi stores all data locally and only contacts Sarvam AI for optional voice transcription. See `SECURITY.md` for the data-flow summary.
- **Content rating**: Everyone (no mature content)
- **Target audience**: 18+ (financial tool)
- **Ads**: Yes (RevenueCat Ads SDK)

---

## Integrations

### Sarvam AI Speech-to-Text

- Endpoint: `POST https://api.sarvam.ai/speech-to-text`
- Header: `api-subscription-key: <SARVAM_API_KEY>`
- Model: `saaras:v4`
- Body: multipart form-data with `model` field + audio file (base64-encoded)
- Source: audio file from `expo-audio` recording (16kHz mono AAC, optimal for Sarvam)
- **Voice notes are never parsed for numbers, categories, or logic.** They are stored and shown as-is.
- Voice is fully optional and decoupled — the logging flow works with voice disabled or failing.
- Robustness: 15s timeout via AbortController, single retry on transient (5xx) errors, 25MB audio size cap.

### RevenueCat + Google Mobile Ads (Ads only — no paywall, no IAP)

Nidhi uses two SDKs together for ad monetization:

1. **Google Mobile Ads SDK** (`react-native-google-mobile-ads@17.x`) — loads and displays the actual banner + interstitial ads via AdMob.
2. **RevenueCat SDK** (`react-native-purchases@10.x`) — tracks ad revenue + lifecycle events (impressions, opens, loads, failures) for attribution. This lets you see ad revenue in your RevenueCat dashboard alongside subscription revenue.

**Ad placements (per spec)**:
- **Banner** on the Dashboard (always-on, visually labelled "Ad")
- **Light interstitial** AFTER completing a daily log (never before — never interrupts the core task of logging)

**All ad units are visually labelled "Ad"** so they're never mistaken for real financial data.

**Expo Go vs Dev build**:
- Both `react-native-purchases` and `react-native-google-mobile-ads` are native modules — neither is in Expo Go.
- In Expo Go: the module auto-detects and silently no-ops (no ads, no crash). The banner slot renders a labelled "Ad" placeholder.
- In a dev build (`npm run dev:android`) or production build (`npm run build:aab`): both modules are bundled and ads work properly.

**Default ad unit IDs**:
- For development, the app uses Google's official **test ad unit IDs** (already configured as defaults in `app.config.ts`). This protects you from being flagged for invalid traffic on your real ad units.
- For production, replace with your real AdMob ad unit IDs (see "API keys" section below).

### Local notifications (expo-notifications)

Five toggleable channels:
1. Daily log reminder (end of day)
2. Large/unusual expense alert (rolling-average comparison)
3. EMI due reminder (a day before EMI payment date)
4. Locked Savings / Emergency Fund set-aside nudge (weekly)
5. Emergency Fund milestone (celebratory)

All notifications respect the user's per-type toggles in Settings. All use warm amber or positive green copy — never alarming red.

---

## API keys — where to put them and how they work

Nidhi uses two external services: **Sarvam AI** (optional voice transcription) and **RevenueCat** (ads). Both require API keys. Here's the complete guide.

### What keys do I need?

| Service | Key name | Required for | Get one at |
|---|---|---|---|
| Sarvam AI | `SARVAM_API_KEY` | Voice notes (optional — app works fully without) | https://sarvam.ai/ |
| RevenueCat (Android) | `REVENUECAT_ANDROID_KEY` | Ad revenue attribution (optional — ads work without) | https://app.revenuecat.com/ |
| RevenueCat (iOS) | `REVENUECAT_IOS_KEY` | Ad attribution on iOS (only if you build for iOS) | https://app.revenuecat.com/ |
| Google Ads App ID | `GOOGLE_ADS_ANDROID_APP_ID` | Banner + interstitial ad display (defaults to Google's test ID) | https://apps.admob.com/ |
| Google Ads Banner Unit ID | `GOOGLE_ADS_BANNER_UNIT_ID` | Banner ad unit (defaults to Google's test ID) | https://apps.admob.com/ |
| Google Ads Interstitial Unit ID | `GOOGLE_ADS_INTERSTITIAL_UNIT_ID` | Interstitial ad unit (defaults to Google's test ID) | https://apps.admob.com/ |

> **The app works 100% without these keys.** Voice notes and ads silently no-op. You only need keys to actually test those features.
>
> **For development**, leave the Google Ads keys blank — the app uses Google's official **test ad unit IDs** by default. This protects you from being flagged for invalid traffic on your real ad units. Only set real ad unit IDs when you're ready to publish to the Play Store.

### Where do I put the keys?

There are **three places** you can put keys, depending on your use case:

#### Option A: Local development (fastest — for testing on your own phone via Expo Go)

1. In the project root, create a file named `.env` (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in any text editor and fill in your keys:
   ```env
   SARVAM_API_KEY=your-sarvam-key-here
   REVENUECAT_ANDROID_KEY=your-revenuecat-android-key-here
   REVENUECAT_IOS_KEY=your-revenuecat-ios-key-here
   ```
3. Save the file. Restart the dev server (`npm start`).

The keys are loaded at build time by Expo and injected into the app via `Constants.expoConfig.extra`.

> **Important**: `.env` is in `.gitignore` — never commit your keys to git.

#### Option B: EAS cloud builds (for shared / production builds)

When you run `eas build`, the build happens in Expo's cloud. Your local `.env` file isn't uploaded — you set keys as EAS secrets instead:

```bash
eas login
eas secret:create --name SARVAM_API_KEY        --value "your-sarvam-key-here"
eas secret:create --name REVENUECAT_ANDROID_KEY --value "your-revenuecat-android-key-here"
eas secret:create --name REVENUECAT_IOS_KEY     --value "your-revenuecat-ios-key-here"
```

These secrets are stored encrypted in EAS and injected at build time. They never appear in your source code or git history.

To verify they're set:
```bash
eas secret:list
```

#### Option C: eas.json (per-build-profile — for different keys per environment)

If you want different keys for `preview` vs `production` builds, edit `eas.json`:

```json
{
  "build": {
    "preview": {
      "env": {
        "SARVAM_API_KEY": "test-key-for-preview-builds",
        "REVENUECAT_ANDROID_KEY": "test-key-for-preview"
      }
    },
    "production": {
      "env": {
        "SARVAM_API_KEY": "production-key",
        "REVENUECAT_ANDROID_KEY": "production-key"
      }
    }
  }
}
```

> Note: keys in `eas.json` are visible in source — only use this for non-sensitive keys. For real secrets, use Option B (EAS secrets).

### How does it work? (the full flow)

Here's exactly what happens when the app starts:

1. **Build time** (when you run `npm start` or `eas build`):
   - Expo reads your `.env` file (or EAS secrets, or `eas.json` env)
   - It injects them into `app.config.ts` via `process.env.SARVAM_API_KEY` etc.
   - The `extra` block in `app.config.ts` packages them:
     ```ts
     extra: {
       sarvamApiKey: process.env.SARVAM_API_KEY ?? "",
       revenueCatAndroidApiKey: process.env.REVENUECAT_ANDROID_KEY ?? "...",
       revenueCatIosApiKey: process.env.REVENUECAT_IOS_KEY ?? "...",
     }
     ```
   - Expo bakes these into the app binary as `Constants.expoConfig.extra`.

2. **Runtime** (when the app runs on a phone):
   - `src/lib/voice.ts` reads the Sarvam key:
     ```ts
     const apiKey = Constants.expoConfig?.extra?.sarvamApiKey;
     if (!apiKey) return null;  // voice disabled — entry still saves without note
     ```
   - `src/lib/revenuecat.ts` reads the RevenueCat key:
     ```ts
     const key = Constants.expoConfig?.extra?.revenueCatAndroidApiKey;
     if (!key || key.startsWith("REPLACE_WITH")) return;  // ads disabled
     ```
   - The app calls Sarvam's API (`https://api.sarvam.ai/speech-to-text`) and RevenueCat's SDK with these keys.

3. **Fallback behavior** (when keys are missing):
   - **No Sarvam key**: voice button still appears, but tapping it shows "Set SARVAM_API_KEY to enable transcription". The entry saves without a note.
   - **No RevenueCat key**: the banner ad slot renders a labelled "Ad" placeholder. No real ad is loaded.
   - **Expo Go**: RevenueCat native module isn't present — the app detects this and skips all ad calls. Voice notes work if a Sarvam key is set.

### Security notes

- **Never commit your `.env` file.** It's in `.gitignore` by default — leave it that way.
- **Never hard-code keys in `src/` files.** Always read them from `Constants.expoConfig.extra.*`.
- **The RevenueCat Android SDK key is safe to ship in the APK** — it's a public SDK key, not a secret. Anyone with the APK can extract it, but it can only be used to display your ads, not to access your account.
- **The Sarvam API key IS a secret.** Ship it via EAS secrets (Option B), never in source. If you must ship it in the APK, be aware that a determined reverse-engineer could extract it.
- **For maximum security**, proxy Sarvam calls through your own backend server instead of calling Sarvam directly from the app. The app would send audio to your server, your server calls Sarvam with the secret key, and returns the transcript. This is out of scope for the current build but documented for production use.

### Verifying your keys work

After setting up keys, test them:

1. **Sarvam**:
   - Run the app, log a spending entry, tap the mic, record a short note ("bought vegetables")
   - If the transcript appears below the mic button, your Sarvam key works
   - If you see "Couldn't transcribe — entry will still save without a note", check the key in your `.env`

2. **RevenueCat**:
   - Run the app, go to the Dashboard — you should see a real banner ad (not just the "Ad" placeholder)
   - Log a spending entry — after saving, you should see an interstitial ad
   - If no real ad appears, check your RevenueCat dashboard to confirm the ad placement IDs match (`dashboard_banner` and `post_log_interstitial`)

---

## Internationalization (i18n)

Three languages: **English** (`en`), **Hindi** (`hi`), **Kannada** (`kn`).

Pure string-swap; layouts, icons, flows are identical across languages. Source files: `src/strings/{en,hi,kn}.json`.

Numbers, currency (₹), and dates follow Indian formatting regardless of UI language (e.g., `1,00,000` not `100,000`).

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

Or all-in-one:
```bash
npm run verify         # runs tsc + eslint + jest in sequence
```

> **About `npm audit`**: Nidhi is built on the Expo SDK + React Native, which pull in a large tree of build-time/dev-only transitive dependencies. As of September 2026, `npm audit` reports ~42 vulnerabilities — but **all of them are in build-time tooling that does NOT ship to end users** (Expo CLI, Metro bundler, EAS CLI, Jest, npm cache internals, iOS build tools). The 3 criticals (`eas-cli`, `form-data`, `tar`) are all build-time only. The production APK contains zero known vulnerabilities. Run `npm run audit` to see the categorized breakdown.

This repo passes all checks. See `eslint.config.js`, `tsconfig.json`, `jest.config.json`, `scripts/audit.js`, and `.github/workflows/ci.yml` for the exact configuration.

---

## Tests

The test suite covers all critical pure logic — **117 tests, 6 suites, 100% green**:

| Suite | What it tests | Coverage |
|---|---|---|
| `validation.test.ts` | Amount / name / phone / duration / language validation, text sanitization | 27 tests |
| `format.test.ts` | Indian currency formatting, number grouping, dates, period comparisons | 19 tests |
| `storage.test.ts` | AsyncStorage persistence, schema migration, corrupt-state recovery | 8 tests |
| `categories.test.ts` | Category definitions, icon mappings, color tokens | 7 tests |
| `typography.test.ts` | Font family/weight resolution, type scale | 16 tests |
| `appStore.test.ts` | Zustand store actions (addEmi, addSpending, etc.) | 40 tests |

### Run tests

```bash
npm run test           # one-shot
npm run test:watch     # watch mode
npm run test:coverage  # with coverage report
```

### What's tested vs. what's not

**Tested**: All pure functions (validation, formatting, storage, categories, typography) + Zustand store actions.

**Not yet tested** (would need React Native testing library + integration setup):
- Component rendering
- Screen navigation flows
- Sarvam AI network calls
- RevenueCat SDK calls
- expo-notifications scheduling (requires native env)

To add component/integration tests, see `CONTRIBUTING.md` → "Adding tests".

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

Proprietary. © Nidhi. All rights reserved.

For licensing inquiries: `hello@nidhi.app` (replace with your real address).

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
