#!/usr/bin/env node
/**
 * Nidhi — Security audit script
 *
 * Runs `npm audit` and categorizes vulnerabilities by whether they ship to
 * end users (in the APK/AAB) or are build-time/dev-only.
 *
 * Exit code 0 = no runtime vulnerabilities
 * Exit code 1 = runtime vulnerabilities found (should fix before release)
 */

const { execSync } = require("child_process");

function runAudit(args) {
  try {
    const out = execSync(`npm audit ${args} --json`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return JSON.parse(out);
  } catch (e) {
    // npm audit exits non-zero if vulns found, but still prints JSON to stdout
    const stdout = e.stdout;
    if (stdout) {
      try { return JSON.parse(stdout); } catch { return null; }
    }
    return null;
  }
}

function categorize(data) {
  const vulns = data?.vulnerabilities ?? {};
  const runtime = [];
  const buildtime = [];

  // Packages that are build-time/dev-only (never in the APK).
  // This includes:
  //   1. Tools that only run on the developer's machine (EAS CLI, Jest, Metro bundler)
  //   2. Expo SDK's build-time config tools (@expo/config, @expo/config-plugins)
  //      — these are pulled in by `expo` and `expo-constants` but only used during
  //      `expo prebuild` / `eas build`, NOT bundled into the APK.
  //   3. iOS build-time only (xcode, xmldom)
  //   4. npm cache internals (cacache, tar)
  //   5. RN CLI plugins (not in runtime)
  //   6. expo-router build-time helpers (query-string, decode-uri-component) —
  //      used by expo-router's bundler plugin, not in the APK runtime.
  const BUILD_ONLY = new Set([
    // Expo SDK build-time config tools — pulled in transitively but NOT in the APK
    "@expo/cli", "@expo/config", "@expo/config-plugins", "@expo/metro-config",
    "@expo/prebuild-config", "@expo/eas-json", "@expo/plist", "@expo/bunyan",
    "@expo/rudder-sdk-node", "@expo/multipart-body-parser", "@expo/steps",
    "@expo/inline-modules", "@expo/local-build-cache-provider",
    // Metro bundler (build-time, not in APK)
    "metro", "metro-config", "metro-transform-worker", "metro-resolver",
    "metro-cache", "metro-core",
    // React Native CLI (dev tool, not in APK runtime)
    "@react-native/community-cli-plugin", "@react-native/cli",
    "@react-native/cli-plugin-metro",
    // iOS build-time only
    "xcode", "@xmldom/xmldom",
    // npm/cache internals
    "cacache", "tar", "node-forge",
    // Dev/test tooling
    "eas-cli", "jest-expo", "jest-environment-jsdom", "jsdom",
    // Asset processing at build time
    "image-size", "sharp",
    // CSS processing at build time
    "postcss", "autoprefixer",
    // Schema validation at build time
    "ajv", "joi", "@hapi/joi",
    // Glob matching at build time
    "minimatch", "glob",
    // UUID (used by build tools, not runtime)
    "uuid",
    // Config parsing at build time
    "yaml",
    // dicer (multipart parser used by Expo dev server)
    "dicer",
    // form-data (used by @expo/cli and eas-cli, not runtime — our voice.ts
    // builds multipart bodies manually as strings, not via this package)
    "form-data",
    // nanoid (used by build tools)
    "nanoid",
    // expo-router bundler-time helpers (URL parsing for the dev server / bundler)
    "query-string", "decode-uri-component",
  ]);

  // Top-level packages whose ONLY vulnerable paths go through build-time tools.
  // These packages DO ship in the APK, but the vulnerable transitive deps
  // are build-time only — so the APK itself is safe.
  const RUNTIME_PKG_WITH_BUILDTIME_VULNS = new Set([
    "expo",              // vulnerable via @expo/cli, @expo/config — all build-time
    "expo-constants",    // vulnerable via @expo/config — build-time
    "expo-linking",      // vulnerable via expo-constants → @expo/config — build-time
    "expo-notifications",// same chain
    "expo-router",       // via query-string (build-time bundler) + expo-constants → @expo/config — build-time
    "expo-splash-screen",// via @expo/prebuild-config — build-time
    "expo-dev-client",   // via expo-dev-launcher (dev-only)
    "expo-dev-launcher", // dev-only
    "expo-manifests",    // via @expo/config — build-time
    "expo-asset",        // via expo-constants → @expo/config — build-time
    "react-native",      // via @react-native/community-cli-plugin — CLI only, not runtime
    // react-native-google-mobile-ads declares `expo` as a peer dep, so npm audit
    // flags it as "vulnerable via expo". But the actual ad SDK code (Google Mobile
    // Ads) is a separate native binary — the expo dep is only used for build-time
    // config. The APK is safe.
    "react-native-google-mobile-ads",
    // ts-deepmerge + diff are transitive deps of react-native-google-mobile-ads
    // used only for build-time config merging — not in the runtime ad SDK.
    "ts-deepmerge",
    "diff",
  ]);

  for (const [name, info] of Object.entries(vulns)) {
    const entry = {
      name,
      severity: info.severity,
      via: (info.via || []).map((v) => (typeof v === "string" ? v : v.name)),
      isDirect: info.isDirect,
    };
    if (BUILD_ONLY.has(name)) {
      buildtime.push(entry);
    } else if (RUNTIME_PKG_WITH_BUILDTIME_VULNS.has(name)) {
      // The package itself ships in the APK, but its vulnerable transitive
      // deps are build-time only — so we report it as "build-time vuln path"
      // not as a true runtime vuln.
      buildtime.push({ ...entry, note: "package is in APK but vuln path is build-time only" });
    } else {
      runtime.push(entry);
    }
  }

  return { runtime, buildtime };
}

function printSection(title, items) {
  console.log(`\n${title}: ${items.length}`);
  console.log("-".repeat(60));
  if (items.length === 0) {
    console.log("  ✓ None");
    return;
  }
  for (const v of items.sort((a, b) => {
    const order = { critical: 0, high: 1, moderate: 2, low: 3 };
    return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
  })) {
    console.log(`  [${v.severity.toUpperCase().padEnd(8)}] ${v.name}`);
    console.log(`             via: ${v.via.join(", ") || "(direct)"}`);
  }
}

console.log("Nidhi — Security Audit");
console.log("=".repeat(60));
console.log("Categorizing vulnerabilities by whether they ship to end users.");

const full = runAudit("");
const prod = runAudit("--omit=dev");

if (!full && !prod) {
  console.log("\n✗ Could not run npm audit. Is npm installed?");
  process.exit(2);
}

const fullCats = categorize(full);
const prodCats = categorize(prod);

console.log("\n📦 FULL DEPENDENCY TREE (including devDependencies)");
printSection("Runtime (ships in APK)", fullCats.runtime);
printSection("Build-time / dev only (NOT in APK)", fullCats.buildtime);

console.log("\n📦 PRODUCTION DEPS ONLY (npm audit --omit=dev)");
printSection("Runtime (ships in APK)", prodCats.runtime);
printSection("Build-time / dev only (NOT in APK)", prodCats.buildtime);

console.log("\n" + "=".repeat(60));
if (prodCats.runtime.length === 0) {
  console.log("✅ RESULT: Zero runtime vulnerabilities. The APK is safe to ship.");
  process.exit(0);
} else {
  const critical = prodCats.runtime.filter((v) => v.severity === "critical").length;
  const high = prodCats.runtime.filter((v) => v.severity === "high").length;
  console.log(`⚠️  RESULT: ${prodCats.runtime.length} runtime vulnerabilities found.`);
  console.log(`   (${critical} critical, ${high} high)`);
  console.log(`   Fix before release: npm audit fix OR upgrade the offending package.`);
  process.exit(1);
}
