#!/usr/bin/env node
/**
 * Nidhi — postinstall patch
 *
 * Patches two known Expo SDK 57 issues that prevent the app from building:
 *
 * 1. `node_modules/expo/types/react-native-web.d.ts` uses `declare module 'react-native'`
 *    to augment `TextStyle` and `ViewStyle` with web-only properties (backdropFilter, etc).
 *    When TypeScript resolves `TextStyle` through `react-native/types_generated/index.d.ts`
 *    (which uses `export type { TextStyle }`), the interface augmentation breaks the
 *    inheritance from `FlexStyle` — so `keyof TextStyle` no longer includes `marginTop`,
 *    `color`, `fontSize`, etc., and every inline `style={{...}}` fails typecheck.
 *
 *    Fix: replace the file with a no-op (mobile-only build, no web types needed).
 *
 * 2. `@expo/metro-config@57` calls `require('react-native/rn-get-polyfills')()` to get
 *    the list of polyfills, but React Native 0.87 doesn't ship that file anymore
 *    (it was removed in RN 0.79+). This breaks `expo start` / `expo export` with
 *    `Cannot find module '.../react-native/rn-get-polyfills'`.
 *
 *    Fix: create a stub `rn-get-polyfills.js` in the react-native package directory
 *    that returns an empty array (the modern polyfills are loaded via a different
 *    mechanism in RN 0.87).
 *
 * Re-runnable: detects if already patched and skips.
 */

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const NODE_MODULES = path.join(PROJECT_ROOT, "node_modules");

// ----- Patch 1: expo/types/react-native-web.d.ts -----
const RN_WEB_TYPES = path.join(NODE_MODULES, "expo", "types", "react-native-web.d.ts");
const PATCH_MARKER = "// NIDHI-PATCHED: web augmentation disabled for mobile-only build";

if (fs.existsSync(RN_WEB_TYPES)) {
  const current = fs.readFileSync(RN_WEB_TYPES, "utf8");
  if (!current.startsWith(PATCH_MARKER)) {
    const backupPath = RN_WEB_TYPES + ".nidhi-original";
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(RN_WEB_TYPES, backupPath);
    }
    const patched = [
      PATCH_MARKER,
      "// Original file backed up at: " + path.basename(backupPath),
      "// This augmentation is intentionally disabled because it breaks TextStyle/ViewStyle",
      "// inheritance when used with `export type { TextStyle }` re-exports in RN 0.87+.",
      "// Nidhi is a mobile-only app, so the web-only CSS properties aren't needed.",
      "// To restore: copy node_modules/expo/types/react-native-web.d.ts.nidhi-original back over this file.",
      "",
      "export {};",
      "",
    ].join("\n");
    fs.writeFileSync(RN_WEB_TYPES, patched);
    console.log("[nidhi-patch] Patched expo/types/react-native-web.d.ts");
  } else {
    console.log("[nidhi-patch] expo/types/react-native-web.d.ts already patched — skipping.");
  }
} else {
  console.log("[nidhi-patch] expo/types/react-native-web.d.ts not found — skipping (install in progress?)");
}

// ----- Patch 2: react-native/rn-get-polyfills.js stub -----
const RN_POLYFILLS = path.join(NODE_MODULES, "react-native", "rn-get-polyfills.js");
const POLYFILLS_MARKER = "// NIDHI-PATCHED: stub for @expo/metro-config compatibility with RN 0.87+";

if (fs.existsSync(path.join(NODE_MODULES, "react-native", "package.json"))) {
  if (!fs.existsSync(RN_POLYFILLS)) {
    const stub = [
      POLYFILLS_MARKER,
      "// React Native 0.87 removed this file, but @expo/metro-config@57 still calls it.",
      "// Return an empty array — modern RN loads polyfills via InitializeCore.js instead.",
      "// Safe to remove this stub once @expo/metro-config is updated to not require it.",
      "",
      "module.exports = function getPolyfills() {",
      "  return [];",
      "};",
      "",
    ].join("\n");
    fs.writeFileSync(RN_POLYFILLS, stub);
    console.log("[nidhi-patch] Created react-native/rn-get-polyfills.js stub");
  } else {
    console.log("[nidhi-patch] react-native/rn-get-polyfills.js already exists — skipping.");
  }
} else {
  console.log("[nidhi-patch] react-native not installed yet — skipping polyfills patch.");
}

// ----- Patch 3: expo/src/Expo.fx.tsx — guard ErrorUtils.setGlobalHandler -----
// In SDK 57, Expo.fx.tsx line 26 calls `ErrorUtils.setGlobalHandler(...)` when
// `isRunningInExpoGo()` returns true. But `ErrorUtils` can be undefined in
// certain environments (older Expo Go versions, web, some dev builds),
// causing the runtime crash:
//   "cannot read property 'setGlobalHandler' of undefined"
// This crash happens at module-eval time, BEFORE any of our app code runs —
// so our try/catch in notifications.ts can't catch it.
// Fix: wrap the ErrorUtils access in a typeof check.
const EXPO_FX = path.join(NODE_MODULES, "expo", "src", "Expo.fx.tsx");
const EXPO_FX_MARKER = "// NIDHI-PATCHED: ErrorUtils guard added";

if (fs.existsSync(EXPO_FX)) {
  const current = fs.readFileSync(EXPO_FX, "utf8");
  if (!current.includes(EXPO_FX_MARKER)) {
    const backupPath = EXPO_FX + ".nidhi-original";
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(EXPO_FX, backupPath);
    }
    // Replace the unsafe ErrorUtils access with a guarded version
    const patched = current.replace(
      /const globalHandler = ErrorUtils\.getGlobalHandler\(\);\s*\n\s*ErrorUtils\.setGlobalHandler\(createErrorHandler\(globalHandler\)\);/,
      `${EXPO_FX_MARKER}\n  // Guard: ErrorUtils can be undefined in some environments (web, older Expo Go)\n  if (typeof ErrorUtils !== 'undefined' && ErrorUtils.getGlobalHandler && ErrorUtils.setGlobalHandler) {\n    const globalHandler = ErrorUtils.getGlobalHandler();\n    ErrorUtils.setGlobalHandler(createErrorHandler(globalHandler));\n  }`,
    );
    if (patched !== current) {
      fs.writeFileSync(EXPO_FX, patched);
      console.log("[nidhi-patch] Patched expo/src/Expo.fx.tsx (ErrorUtils guard)");
    } else {
      console.log("[nidhi-patch] expo/src/Expo.fx.tsx pattern not found — skipping (may already be patched)");
    }
  } else {
    console.log("[nidhi-patch] expo/src/Expo.fx.tsx already patched — skipping.");
  }
} else {
  console.log("[nidhi-patch] expo/src/Expo.fx.tsx not found — skipping");
}

// Also patch the compiled version (build/Expo.fx.js) — this is what actually runs
const EXPO_FX_BUILD = path.join(NODE_MODULES, "expo", "build", "Expo.fx.js");
if (fs.existsSync(EXPO_FX_BUILD) && !fs.readFileSync(EXPO_FX_BUILD, "utf8").includes(EXPO_FX_MARKER)) {
  const current = fs.readFileSync(EXPO_FX_BUILD, "utf8");
  const backupPath = EXPO_FX_BUILD + ".nidhi-original";
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(EXPO_FX_BUILD, backupPath);
  }
  // The compiled JS may have slightly different formatting — match common patterns
  const patched = current
    .replace(
      /const globalHandler = ErrorUtils\.getGlobalHandler\(\);\s*\n\s*ErrorUtils\.setGlobalHandler\((\w+)\((\w+)\)\);/,
      `// ${EXPO_FX_MARKER}\n  if (typeof ErrorUtils !== 'undefined' && ErrorUtils.getGlobalHandler && ErrorUtils.setGlobalHandler) {\n    const globalHandler = ErrorUtils.getGlobalHandler();\n    ErrorUtils.setGlobalHandler($1($2));\n  }`,
    )
    .replace(
      // Also handle the case where it's on a single line
      /ErrorUtils\.setGlobalHandler\((\w+)\((\w+)\)\);/,
      `if (typeof ErrorUtils !== 'undefined' && ErrorUtils.setGlobalHandler) { ErrorUtils.setGlobalHandler($1($2)); }`,
    );
  if (patched !== current) {
    fs.writeFileSync(EXPO_FX_BUILD, patched);
    console.log("[nidhi-patch] Patched expo/build/Expo.fx.js (ErrorUtils guard)");
  } else {
    console.log("[nidhi-patch] expo/build/Expo.fx.js pattern not found — skipping");
  }
} else if (fs.existsSync(EXPO_FX_BUILD)) {
  console.log("[nidhi-patch] expo/build/Expo.fx.js already patched or not found — skipping");
}

console.log("[nidhi-patch] Done.");
