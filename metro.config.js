// Metro config with TS path alias support (@/* -> src/*)

const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Resolve "@/*" path aliases (TS path mappings)
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  "@": path.resolve(__dirname, "src"),
};

// Make sure SVG assets are handled as source files (not bundled as binary)
config.resolver.assetExts = config.resolver.assetExts.filter(
  function (ext) { return ext !== "svg"; },
);
config.resolver.sourceExts.push("svg");

module.exports = config;
