# Contributing to Nidhi

Thanks for your interest in contributing! Nidhi is a financial discipline tool for everyday earners — keep that audience in mind for every contribution.

## Code of conduct

Be kind. Be patient. Assume good intent. This app is for people who may have limited reading literacy and limited experience with apps — every PR should make the experience simpler, warmer, and more dignified for them.

## How to contribute

1. **Open an issue first.** Before building a feature, file an issue describing what you want to add/change and why. We'll discuss the design before you spend time coding.
2. **Fork & branch.** Fork the repo, create a feature branch (`git checkout -b feat/my-feature`).
3. **Write code.** Follow the existing patterns (TypeScript, Reanimated for animation, Zustand for state, lucide for icons).
4. **Run quality checks.**
   ```bash
   npx tsc --noEmit       # Must pass with 0 errors
   npx eslint .           # Must pass with 0 errors (warnings OK)
   ```
5. **Test on a device.** Use Expo Go or `npx expo run:android` to verify your changes work on a real phone.
6. **Open a PR.** Reference the issue. Include screenshots / recordings for any UI change.

## Design principles (read this before opening a UI PR)

- **Premium and dignified** — never stripped-down. Banking app polish, everyday-tool warmth.
- **Icons over text.** Vector icons (lucide-react-native) at ≥48dp touch targets. **Zero emojis in the UI.**
- **Large, high-legibility type** (16dp+ body, 28dp+ headlines). Bold for key numbers.
- **Supportive, non-judgmental tone** — never "wasted", "bad", or "failed". Always visibility and progress.
- **Never alarming red** — even warnings use warm amber (`#D97706`).
- **Forgiving** — every error has a clear path forward. Never dead-end the user.

## Coding standards

- **TypeScript strict mode** — no `any`, no `// @ts-ignore` unless absolutely necessary.
- **Pure string-swap i18n** — every user-facing string must be in `src/strings/{en,hi,kn}.json`. Never hard-code UI text.
- **State via Zustand** — add new state to `src/store/appStore.ts` and persist via `persist()`.
- **Validation via `src/lib/validation.ts`** — never trust user input.
- **No emojis** in any UI string.
- **No console.log** in production code (use `console.warn`, `console.error`, or `console.info`).

## Adding a new screen

1. Create the file in `src/app/` (or `src/app/(app)/` for tab screens).
2. Use `<ScreenShell>` as the wrapper.
3. Use `<Header>` for the title row.
4. Use the `<Text>` component (not raw `<RNText>`) for typography.
5. Use `<Pressable>` (not raw `<TouchableOpacity>`) for pressable elements.
6. If the screen has a primary CTA, use `<Button>` with the appropriate variant.
7. Add i18n keys for every string in all three languages.
8. Test in all three languages (English, Hindi, Kannada).

## Adding a new notification type

1. Add a new toggle to `NotificationSettings` in `src/lib/types.ts`.
2. Add a default value to `DEFAULT_NOTIFICATIONS`.
3. Add a new scheduler function in `src/lib/notifications.ts`.
4. Wire it up in `syncScheduledNotifications`.
5. Add a Settings toggle in `src/app/(app)/settings.tsx`.
6. Add localized copy in all three `src/strings/*.json` files.

## Reporting bugs

Open a GitHub issue with:
- Nidhi version (Settings → About → Version)
- Android/iOS version
- Steps to reproduce
- Expected vs actual behavior
- Screenshot if applicable

## Reporting security vulnerabilities

See [`SECURITY.md`](./SECURITY.md). Do NOT open a public issue for security vulnerabilities.
