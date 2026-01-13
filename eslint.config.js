// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  {
    files: ["sudokuru/**"],
    extends: [expoConfig, eslintPluginPrettierRecommended],
  },
  {
    files: ["e2e/**", "eslint.config.js"],
    extends: [expoConfig, eslintPluginPrettierRecommended],
    rules: {
      "react-hooks/rules-of-hooks": "off",
      "@typescript-eslint/no-require-imports": "off", // todo turn this back on
    },
  },
  {
    ignores: [
      "**/node_modules/",
      ".idea/",
      ".dccache",
      "coverage/",
      "jest-coverage/",
      ".nyc_output/",
      "junit.xml",
      "**/.expo/",
      "**/dist/",
      ".env",
      "npm-debug.*",
      "*.jks",
      "*.p8",
      "*.p12",
      "*.key",
      "*.mobileprovision",
      "*.orig.*",
      "**/web-build/",
      ".github/",
      "License.md",
      "package.json",
      "package-lock.json",
      "**/test-results/",
      "**/playwright-report/",
      "**/playwright-coverage/",
      ".DS_Store",
      ".vercel",
      "**/target/",
    ],
  },
]);
