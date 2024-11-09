module.exports = function (api) {
  api.cache(true);

  let plugins = [];

  if (process.env["ENV"] === "development") {
    plugins.push("istanbul");
  }

  return {
    presets: ["babel-preset-expo"],
    plugins: plugins,
  };
};
