import type { Config } from "jest";

const config: Config = {
  preset: "jest-expo",
  reporters: [
    "default",
    "github-actions",
    [
      "jest-junit",
      {
        suiteNameTemplate: "{filename}",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
      },
    ],
  ],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  collectCoverage: false,
  coverageDirectory: "jest-coverage",
};

export default config;
