// rn-cli.config.js
module.exports = {
  transformer: {
    minifierPath: 'metro-minify-terser',
  },
  resolver: {
    extraNodeModules: {
      ...require('node-libs-react-native'),
    },
  },
};
