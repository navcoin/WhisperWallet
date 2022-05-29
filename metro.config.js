// rn-cli.config.js

const MetroConfig = require('@ui-kitten/metro-config');

const evaConfig = {
  evaPackage: '@eva-design/eva',
  // Optional, but may be useful when using mapping customization feature.
  customMappingPath: './constants/theme/mapping.json',
};

module.exports = MetroConfig.create(evaConfig, {
  transformer: {
    minifierPath: 'metro-minify-terser',
  },
  resolver: {
    extraNodeModules: {
      ...require('node-libs-react-native'),
    },
  },
  assetExts: ['js', 'wasm', 'html'],
});
