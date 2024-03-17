module.exports = {
  extends: [
    "universe",
    "universe/shared/typescript-analysis",
    "plugin:playwright/recommended",
  ],
  rules: {
    "playwright/expect-expect": "off",
    "playwright/no-conditional-in-test": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.d.ts"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  ],
};
