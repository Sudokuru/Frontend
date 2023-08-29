module.exports = function (api) {
  api.cache(true);

  const plugins = [
    "@babel/plugin-proposal-export-namespace-from",
    "react-native-reanimated/plugin",
  ];

  if (process.env["ENV"] === "development") {
    plugins.push("istanbul");
  }

  return {
    presets: ["babel-preset-expo"],
    plugins: plugins,
  };
};
