# Assets

Place your app icon and splash PNGs here before building.

## Required files

| File | Size | Purpose |
|---|---|---|
| `icon.png` | 1024×1024 | App icon (iOS + fallback Android) |
| `adaptive-icon.png` | 1024×1024 | Android adaptive icon foreground (with safe margin) |
| `adaptive-icon-bg.png` | 1024×1024 | Android adaptive icon background (solid color) |
| `splash.png` | 1242×2436 | Splash screen image |
| `notif-icon.png` | 96×96 (white on transparent) | Notification small icon (Android) |
| `favicon.png` | 48×48 | Web favicon (only if you also deploy to web) |

## Quick generate

Use Figma / Exponent's [icon generator](https://github.com/expo/examples/tree/master/with-icons)
or run:

```bash
npx @expo/configure --name-icon
```

The source Nidhi logo is a simple "₹ inside a shield" mark — premium green (#0F9D58) on
warm off-white (#FAF9F6). A reference SVG is at `./nidhi-logo-source.svg`.

## Placeholder during dev

Until you add real PNGs, Expo will warn during build but still compile for development.
Replace before publishing to Play Store.
