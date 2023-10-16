module.exports = api => {
  const babelEnv = api.env();
  const plugins = ['@babel/syntax-bigint'];
  //change to 'production' to check if this is working in 'development' mode
  if (babelEnv !== 'development') {
    plugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }]);
  }
  plugins.push('react-native-reanimated/plugin');
  return {
    presets: [
      'module:metro-react-native-babel-preset',
      {
        exclude: [
          'transform-exponentiation-operator', // this line here
        ],
      },
    ],
    plugins: plugins,
  };
};
