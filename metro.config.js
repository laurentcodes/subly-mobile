const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

// enable package exports for better-auth
config.resolver.unstable_enablePackageExports = true;

module.exports = withNativeWind(config, { input: './global.css' })