# Nidhi — Google Play Store Listing

This document contains all the assets you need to publish Nidhi on Google Play Store. Copy-paste-ready.

---

## App name (max 30 chars)
```
Nidhi
```

## Short description (max 80 chars)
```
Financial discipline for everyday earners. See your money, build savings gently.
```

## Full description (max 4000 chars)
```
Nidhi is a financial discipline and spending-awareness app built for everyday earners — kirana shopkeepers, domestic help, security guards, construction workers, and anyone who earns decent income but struggles with impulsive spending, gambling, or EMI/loan debt traps.

SEE YOUR MONEY CLEARLY
Nidhi shows where your hard-earned money goes — every day, every rupee. Tap a category, type the amount, save. That's it. No accounting jargon, no complicated dashboards.

BUILD SAVINGS GENTLY
Set a small monthly savings goal. Set aside what you can, when you can. Watch it add up over time. Nidhi never shames you for missing a goal — it just shows you where you stand.

EMERGENCY FUND
A separate, dignified bucket reserved for real emergencies. Start with ₹500–1000. Build it gradually. Accessing it requires a soft confirmation so you don't dip in casually.

VOICE NOTES (OPTIONAL)
Tap the mic and speak a short reason for any spending entry. Nidhi transcribes it via Sarvam AI and shows it back to you as-is. Voice is fully optional — the app works 100% without it.

SPENDING INSIGHTS
Weekly and monthly summaries with plain-language observations only — "You spent more on Transport this week than last week." No advice, no judgement, just clarity.

REMINDERS THAT RESPECT YOU
Five local notification types, each toggleable: daily log reminder, large-expense check-in (never alarming red, just warm amber), EMI due reminder, set-aside nudge, and a celebratory milestone when your emergency fund reaches its target.

THREE LANGUAGES
Nidhi speaks English, हिन्दी (Hindi), and ಕನ್ನಡ (Kannada). Pick at first launch, change anytime.

PREMIUM, DIGNIFIED DESIGN
Nidhi is built for people who deserve polish, not stripped-down tools. Banking-app polish meets everyday-tool warmth. Large, high-legibility type. Vector icons (no emojis). Warm, trustworthy palette — never alarming red. Always supportive, never shaming.

PRIVACY
All your data lives on your device. Nidhi does not send your financial data to any server. The only outbound call is to Sarvam AI when you tap the mic (optional). No analytics, no trackers, no telemetry.

WHAT NIDHI IS NOT
- Not a banking app — Nidhi doesn't connect to your bank or move real money.
- Not a financial advisor — Nidhi describes your spending; it never gives investment advice.
- Not a budget tracker with categories and envelopes — Nidhi is intentionally simple: log, see, choose.

WHO NIDHI IS FOR
Everyday earners in India — shopkeepers, drivers, security guards, domestic workers, construction workers, gig workers, delivery agents, small business owners, anyone who wants clarity and gentle discipline with their money.

Free to use. Supported by unobtrusive ads (banner on dashboard, light interstitial after a daily log — never interrupts the act of logging). No subscription, no in-app purchases.

---

Nidhi — Your money, kept close.
```

---

## Category
```
Finance
```

## Content rating
```
Everyone
```

## Target audience
```
18+ (financial tool, not targeted at minors)
```

## Contains ads
```
Yes (RevenueCat Ads)
```

## In-app purchases
```
No
```

---

## Privacy Policy URL

Host this file (e.g., on GitHub Pages or your own domain) and provide the URL here. The file is in `PRIVACY_POLICY.md`.

Example URL pattern:
```
https://your-org.github.io/nidhi/privacy-policy
```

---

## App icon (512×512 PNG)

Located at `assets/icon.png`. For Play Store, you may need to provide a separate 512×512 PNG. Run:
```bash
node scripts/generate-assets.js
```
to regenerate at the correct size from `assets/nidhi-logo-source.svg`.

---

## Feature graphic (1024×500 PNG)

Not auto-generated. Create one with the Nidhi logo centered on the primary green (`#0F9D58`) gradient. Use the source SVG (`assets/nidhi-logo-source.svg`) as a base.

Suggested tools: Figma, Canva, or Inkscape (free).

---

## Phone screenshots

Take screenshots on a 1080×1920 device. Recommended set:

1. **Language picker** — first impression, shows three Indian scripts
2. **Dashboard** — hero "money kept" + progress bars
3. **Log spending** — category grid + numpad
4. **Savings** — locked + emergency tabs
5. **Insights** — category breakdown + observations
6. **Settings** — notifications + voice toggle

Export as PNG, 1080×1920 minimum.

---

## App type
```
Mobile app (Android only — iOS version planned)
```

## Pricing
```
Free
```

## Distribution
```
Open testing → Production (recommended)
```

---

## Step-by-step: First publish

1. **Build the production AAB**:
   ```bash
   eas build -p android --profile production
   ```
   EAS will give you a download URL for the `.aab` file.

2. **Create the app in Play Console**:
   - Go to https://play.google.com/console
   - "Create app" → fill in app name (`Nidhi`), default language, app type (App), paid/free (Free).

3. **Set up your app** (left sidebar):
   - **App access**: App is free, no API access needed.
   - **Ads**: Yes, the app contains ads (RevenueCat).
   - **Content rating**: Complete the IARC questionnaire — answer "No" to most items (financial tool, no mature content). Expect rating "Everyone".
   - **Target audience**: 18+ (financial tool, not for children).
   - **News app**: No.
   - **Data safety**: Fill in per `PRIVACY_POLICY.md`. Key items:
     - Data collected: App activity (no), App info & performance (no), Device or other IDs (Yes — RevenueCat anonymous ad ID)
     - Data is encrypted in transit: Yes
     - Users can request data deletion: Yes (Settings → Reset all data)
   - **Government apps**: No.
   - **Financial features**: Yes — "Loan and credit information or services" (Nidhi shows EMI reminders and insurance awareness messaging; it is NOT a lending app).
   - **Privacy Policy**: Paste your hosted URL.

4. **Upload the AAB**:
   - "Production" → "Create release"
   - Upload the `.aab` file from step 1
   - Add release notes (e.g., "Initial release")
   - Review the release → "Start rollout to Production"

5. **Wait for review** (typically 1–3 days for first publish).

---

## Update releases

For subsequent versions:
1. Bump `version` + `versionCode` in `app.config.ts`
2. Re-run `eas build -p android --profile production` (EAS auto-increments if you set `autoIncrement: true`)
3. "Production" → "Create new release" in Play Console → upload the new `.aab`
4. Add release notes → Start rollout
