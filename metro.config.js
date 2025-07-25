const { getDefaultConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const defaultConfig = getDefaultConfig(__dirname);

// If you need to customize config, do it here:
const config = {
  // Add custom config if needed
};

module.exports = wrapWithReanimatedMetroConfig({
  ...defaultConfig,
  ...config,
});
