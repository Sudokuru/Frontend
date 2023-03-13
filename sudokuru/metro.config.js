const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
    'bmp',
    'gif',
    'jpg',
    'jpeg',
    'png',
    'psd',
    'svg',
    'webp',
    // Video formats
    'm4v',
    'mov',
    'mp4',
    'mpeg',
    'mpg',
    'webm',
    // Audio formats
    'aac',
    'aiff',
    'caf',
    'm4a',
    'mp3',
    'wav',
    // Document formats
    'html',
    'pdf',
    'yaml',
    'yml',
    // Font formats
    'otf',
    'ttf',
    // Archives (virtual files)
    'zip',
);

config.resolver.sourceExts.push(
    'js',
    'jsx',
    'json',
    'ts',
    'tsx'
);

module.exports = config;