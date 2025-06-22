const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for react-native-pager-view
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-pager-view': require.resolve('react-native-pager-view'),
};

module.exports = config; 