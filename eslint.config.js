// NIDHI — ESLint flat config

const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  ...expoConfig,
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "dist/**",
      "android/**",
      "ios/**",
      "metro.config.js",
      "scripts/**",
    ],
  },
  {
    // Jest setup files need access to `jest`, `beforeAll`, `afterAll`, etc.
    files: ["jest.setup.js", "jest.config.js", "**/__tests__/**/*.ts", "**/__tests__/**/*.tsx"],
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        afterAll: "readonly",
        afterEach: "readonly",
      },
    },
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".ttf", ".png"],
        },
      },
      "import/ignore": [".ttf$", ".png$", ".jpg$", ".svg$"],
    },
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "warn",
      "@typescript-eslint/no-require-imports": "off",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "import/no-unresolved": "off",
      "import/namespace": "off",
      "import/no-named-as-default": "off",
    },
  },
]);
