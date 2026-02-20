const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.blockList = [
  /src-tauri\/.*/, // Ignore everything in the src-tauri directory, this allows tauri dev command to work
];

module.exports = defaultConfig;
