export default {
  name: "Sudokuru",
  slug: "sudokuru",
  scheme: "sudokuru",
  owner: "sudokuru",
  version: "0.0.0",
  platform: ["ios", "android", "web"],
  icon: ".assets/goldLogoNoText.png",
  orientation: "portrait",
  splash: {
    backgroundColor: "#000000",
  },
  updates: {
    url: "https://u.expo.dev/23c4c607-ead6-4786-9a9c-03f57a97dac7",
    fallbackToCacheTimeout: 0,
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  assetBundlePatterns: ["**/*"],
  web: {
    bundler: "metro",
  },
  ios: {
    bundleIdentifier: "sudokuru.vercel.app",
    supportsTablet: true,
  },
  android: {
    package: "sudokuru.vercel.app",
  },
  extra: {
    eas: {
      projectId: "23c4c607-ead6-4786-9a9c-03f57a97dac7",
    },
  },
};
