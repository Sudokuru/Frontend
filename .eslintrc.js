// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier", "eslint-plugin-json"],
  rules: {
    "prettier/prettier": "error",
  },
};
