'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
Object.defineProperty(exports, '__esModule', {value: true});
const react_1 = __importDefault(require('react'));
const react_native_1 = require('react-native');
const SwipeButton_1 = require('./SwipeButton');
const SwipeButtonText = ({
  title,
  titleStyle,
  titleContainerProps,
  titleContainerStyle,
  titleProps,
  height = SwipeButton_1.DEFAULT_HEIGHT,
}) => {
  return react_1.default.createElement(
    react_native_1.View,
    Object.assign(
      {
        testID: 'TitleContainer',
        style: [styles.titleContainer, {height}, titleContainerStyle],
      },
      titleContainerProps,
    ),
    react_1.default.createElement(
      react_native_1.Text,
      Object.assign(
        {
          numberOfLines: 2,
          allowFontScaling: false,
          style: [styles.title, titleStyle],
          testID: 'Title',
        },
        titleProps,
      ),
      title,
    ),
  );
};
exports.default = SwipeButtonText;
const styles = react_native_1.StyleSheet.create({
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#e9ff6b',
    fontSize: 16,
    maxWidth: '50%',
    textAlign: 'center',
  },
});
