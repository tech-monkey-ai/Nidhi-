# Nidhi — Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in Nidhi, please report it responsibly:

1. **Do NOT open a public GitHub issue.**
2. Email: `security@nidhi.app` (replace with your real address).
3. Include:
   - A clear description of the issue
   - Steps to reproduce
   - Affected versions
   - Potential impact

We will acknowledge within 48 hours and aim for a fix within 14 days for high-severity issues.

## Security posture

### Data
- **All user data is stored locally** on the device via `AsyncStorage`. Nidhi does **not** send financial data to any server.
- The only outbound network call is to **Sarvam AI's speech-to-text API**, and only when the user explicitly taps the mic to record an optional voice note. If transcription fails or the network is unavailable, the entry still saves without a note.
- No analytics, no telemetry, no third-party trackers.

### Secrets
- `SARVAM_API_KEY` and `REVENUECAT_ANDROID_KEY` / `REVENUECAT_IOS_KEY` are loaded via EAS environment variables and injected at build time.
- They are **not** checked into git. The `.env` file is gitignored.
- Never hard-code API keys in source. Always read from `Constants.expoConfig.extra.*`.

### Permissions
The app requests only the permissions it needs:

| Permission | Why |
|---|---|
| `RECORD_AUDIO` | Optional voice notes (user can disable in Settings) |
| `POST_NOTIFICATIONS` | Local reminders (user can toggle per-type in Settings) |
| `SCHEDULE_EXACT_ALARM` | EMI due reminders fire on time |
| `RECEIVE_BOOT_COMPLETED` | Re-arm scheduled notifications after device reboot |
| `VIBRATE` | Haptic feedback on key taps (can be disabled via system settings) |

No location, contacts, camera, storage, or phone-state permissions are requested.

### Input validation
All user input is validated via `src/lib/validation.ts`:
- Amounts: numeric only, bounded to ₹100 crore cap
- Names: Unicode letters/spaces only, max 40 chars
- Phone numbers: validated as Indian mobile or international format, max 15 digits
- Text fields: control characters stripped, length capped

### Storage migration
`src/lib/storage.ts` includes a versioned schema + migration function. Older installs are auto-upgraded to the current schema. Corrupt state is wiped and reset to defaults — never crashes the user.

### Auditing dependencies

```bash
npm run audit         # Categorized audit — separates runtime vs build-time vulns
npm audit             # Raw npm audit (full tree)
npm audit --omit=dev  # Raw npm audit (production deps only)
npm audit fix         # Apply safe fixes (non-breaking)
npm audit fix --force # Apply breaking fixes (review first — can break Expo SDK pinning)
```

**Important context about `npm audit` results**: Nidhi is built on the Expo SDK + React Native, which pull in a large tree of build-time/dev-only transitive dependencies. As of September 2026, `npm audit` reports ~42 vulnerabilities, but **all of them are in build-time tooling that does NOT ship to end users**:

- **Expo SDK build-time config tools** (`@expo/cli`, `@expo/config`, `@expo/config-plugins`, `@expo/prebuild-config`) — used only during `expo prebuild` / `eas build`, never bundled into the APK
- **Metro bundler** (`metro`, `metro-config`, `metro-transform-worker`) — dev server / bundler, not in the APK
- **EAS CLI** — developer's machine only
- **Jest** — test runner, not in the APK
- **npm cache internals** (`cacache`, `tar`) — npm's own cache layer
- **iOS build-time only** (`xcode`, `@xmldom/xmldom`) — only used when building for iOS

The 3 criticals (`eas-cli`, `form-data`, `tar`) are all in this build-time bucket. The `form-data` package is used by `@expo/cli` and `eas-cli` for their own HTTP requests — our `voice.ts` builds multipart bodies manually as strings and does NOT use the `form-data` package.

**The production APK that ships to users contains zero known vulnerabilities.**

Run `npm run audit` to see this categorization printed in a human-readable format. The script exits 0 if there are no runtime vulnerabilities, and exits 1 if any are found.

If a future critical CVE affects a true production-runtime dependency (e.g., `react-native` runtime, `zustand`, `lucide-react-native`, or one of the `expo-*` runtime modules), treat it as urgent and fix before release.

### Build artifacts
Before publishing to the Play Store:
- Run `npm audit` and resolve any high/critical issues in production dependencies
- Run `npx tsc --noEmit` to verify zero TypeScript errors
- Run `npx eslint .` to verify zero ESLint errors
- Test on a real device with `eas build -p android --profile preview`

## Dependency notes

Some dev-only transitive dependencies of the Expo/React Native toolchain (e.g., `xcode`, `@expo/bunyan`, older `uuid`) may surface in `npm audit` results. These are used only during local development / builds and are **not** shipped to end users. The production bundle that goes into the APK/AAB does not include them.

If a critical CVE affects a production runtime dependency, treat it as urgent and fix before release.
