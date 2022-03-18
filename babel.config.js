module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    {
      exclude: [
        'transform-exponentiation-operator', // this line here
      ],
    },
  ],
  plugins: ['@babel/syntax-bigint', 'react-native-reanimated/plugin'],
};
