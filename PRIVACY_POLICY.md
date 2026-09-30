# Nidhi — Privacy Policy

**Last updated: September 23, 2026**

Nidhi ("we", "us", "our") operates the Nidhi mobile app ("the app"). This Privacy Policy explains how the app handles your information.

## TL;DR

- **All your financial data is stored locally on your device.** Nidhi does not send your spending entries, savings amounts, EMI details, or any other financial data to any server.
- **One outbound network call** is made — to Sarvam AI's speech-to-text API — and only when you explicitly tap the microphone to record an optional voice note. If you don't use voice notes, no network call ever happens.
- **No analytics, no telemetry, no third-party trackers.**
- **Ads** are served via RevenueCat. RevenueCat may collect anonymous device identifiers for ad delivery and fraud prevention, but **never receives your financial data**.

## 1. Data we collect

### 1.1 Data you enter (stored locally only)
- Your name (used to greet you in the app)
- Approximate monthly income
- Monthly savings goal
- Emergency fund target
- EMI / loan details (amount, duration, description)
- Daily spending entries (category, amount, optional voice note)
- Savings set-aside records
- Emergency fund access history
- Trusted contact's name and phone number (only if you opt in)

All of this is stored on your device using `AsyncStorage`. It never leaves your device.

### 1.2 Voice notes (optional, opt-in)
If you tap the microphone icon during logging or EMI setup, the app records a short audio clip and sends it (via HTTPS) to Sarvam AI's speech-to-text API to be transcribed. The transcription is then displayed back to you and stored locally on your device.

- **What's sent**: the audio recording only
- **What's received**: the transcription text
- **What Sarvam AI does with the audio**: governed by [Sarvam AI's privacy policy](https://sarvam.ai/privacy-policy)
- **What's stored**: only the transcription text, locally on your device. The audio file is deleted after transcription.

Voice notes are entirely optional. You can disable them in Settings → Voice Notes → Off. The app works 100% without voice.

### 1.3 Ads (anonymous)
Nidhi displays ads via RevenueCat. RevenueCat may collect:
- Anonymous device identifiers (for ad delivery)
- Coarse geographic region (country-level, for ad targeting)
- App engagement metrics (e.g., "session length")

RevenueCat **never** receives your name, spending entries, savings amounts, EMI details, or any other financial data. Ads are kept visually distinct from app content with a clear "Ad" label.

See [RevenueCat's privacy policy](https://www.revenuecat.com/privacy) for details.

## 2. Data we do NOT collect

- We do NOT collect your name
- We do NOT collect your spending data
- We do NOT collect your income or savings data
- We do NOT collect your EMI / loan data
- We do NOT collect your trusted contact's data
- We do NOT collect your location (GPS)
- We do NOT read your contacts, SMS, photos, or files
- We do NOT use analytics SDKs (no Firebase Analytics, no Amplitude, no Mixpanel, no Sentry)
- We do NOT sell or share your data with third parties

## 3. Permissions

| Permission | Why we need it | Can you disable? |
|---|---|---|
| Microphone (`RECORD_AUDIO`) | To record optional voice notes | Yes — toggle off in Settings, or revoke in system settings |
| Notifications (`POST_NOTIFICATIONS`) | To send local reminders (daily log, EMI due, savings nudge, milestone) | Yes — per-type toggle in Settings, or revoke in system settings |
| Exact alarm (`SCHEDULE_EXACT_ALARM`) | So EMI due reminders fire on time | Revocable in system settings |
| Receive boot completed (`RECEIVE_BOOT_COMPLETED`) | So scheduled notifications re-arm after a reboot | Revocable in system settings |
| Vibrate | For haptic feedback on taps | Revocable in system settings |

We do NOT request: location, camera, contacts, storage, phone state, SMS, call log, calendar, or any other sensitive permission.

## 4. Data retention

- **Local data**: Retained on your device until you uninstall the app or tap "Reset all data" in Settings → Reset.
- **Voice audio**: Deleted immediately after Sarvam AI returns the transcription (or after 15 seconds if the API fails).
- **Voice transcription text**: Stored locally on your device until you delete the associated spending entry or reset all data.

### 4.1. Data encryption at rest

Nidhi stores all local data via React Native's `AsyncStorage`, which writes **plaintext JSON** to the device's app-private storage directory. This is standard for React Native apps and is acceptable for a local-only, no-bank-integration app.

- **Android**: data is stored in `/data/data/com.nidhi.app/files/` — protected by the Android app sandbox. Only the Nidhi app can read these files. A user with a **rooted device** or a forensic tool could extract the plaintext.
- **iOS**: data is stored in the app's `Documents/` directory within the app container — protected by the iOS app sandbox. Files are not encrypted by default unless the user has device-wide encryption enabled (standard on all modern iOS devices).

**Trade-off**: Nidhi does not add an additional layer of encryption on top of the OS sandbox, because (1) any encryption key would also have to be stored in the app's sandbox (defeating the purpose against a rooted device), and (2) the app does not connect to bank accounts or move real money — the worst case for a sandboxed attacker is reading the user's spending history.

**If you need stronger protection**: set up a device passcode (recommended anyway), avoid rooting/jailbreaking your device, and use the "Reset all data" option in Settings before selling or transferring the device.

## 5. Children's privacy

Nidhi is not intended for users under 18. We do not knowingly collect data from children. If you believe a child has provided personal data, contact us and we will delete it.

## 6. Your rights

Because all your data is stored locally on your device:
- **Access**: Open the app — your data is right there.
- **Correction**: Edit any entry in the app.
- **Deletion**: Settings → Reset all data, OR uninstall the app.

For voice transcription data sent to Sarvam AI, you may also exercise rights under their privacy policy (e.g., GDPR/DPDP) directly with Sarvam AI.

## 7. International data transfer

If you use voice notes, your audio is sent to Sarvam AI's servers (located in India). No other data leaves your device.

## 8. Security

- All network calls use HTTPS / TLS.
- No financial data is transmitted in plaintext (or at all).
- API keys are injected at build time via EAS environment variables — never hard-coded in the binary.
- We do not store any password or biometric data — there is no login.

## 9. Changes to this policy

We will update this Privacy Policy if our practices change. We will notify users of material changes via an in-app banner.

## 10. Contact

For privacy questions or requests: `privacy@nidhi.app` (replace with your real address).

## 11. Open source acknowledgements

Nidhi uses the following open-source libraries:
- **React Native** + **Expo** — mobile framework
- **Zustand** — state management
- **lucide-react-native** — icons
- **Onest, Inter, Noto Sans Devanagari, Noto Sans Kannada** — fonts (SIL OFL)

See `package.json` for the full dependency list.

---

*This Privacy Policy is part of the Nidhi open-source project. Forks and derivatives should update this policy to reflect their own data practices.*
