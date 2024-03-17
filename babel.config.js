module.exports = function (api) {
  api.cache(true);

  const plugins = [];

  if (process.env["ENV"] === "development") {
    plugins.push("istanbul");
  }

  return {
    presets: ["babel-preset-expo"],
    plugins,
  };
};
