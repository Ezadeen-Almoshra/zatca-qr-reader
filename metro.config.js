const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const cacheDirectory = path.join(__dirname, '.metro-tmp');
fs.mkdirSync(cacheDirectory, { recursive: true });

process.env.TMPDIR ??= cacheDirectory;
process.env.TMP ??= cacheDirectory;
process.env.TEMP ??= cacheDirectory;

const config = getDefaultConfig(__dirname);
config.fileMapCacheDirectory = cacheDirectory;

module.exports = withNativeWind(config, { input: './src/global.css' });
