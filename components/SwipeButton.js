'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) {
          k2 = k;
        }
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) {
          k2 = k;
        }
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', {enumerable: true, value: v});
      }
    : function (o, v) {
        o.default = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) {
      return mod;
    }
    var result = {};
    if (mod != null) {
      for (var k in mod) {
        if (k !== 'default' && Object.hasOwnProperty.call(mod, k)) {
          __createBinding(result, mod, k);
        }
      }
    }
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
Object.defineProperty(exports, '__esModule', {value: true});
exports.DEFAULT_HEIGHT = void 0;
const react_1 = __importStar(require('react'));
const react_native_1 = require('react-native');
const SwipeButtonCircle_1 = __importDefault(require('./SwipeButtonCircle'));
const SwipeButtonText_1 = __importDefault(require('./SwipeButtonText'));
exports.DEFAULT_HEIGHT = 70;
const DEFAULT_WIDTH = react_native_1.Dimensions.get('window').width * 0.9;
const DEFAULT_BORDER_RRADIUS = exports.DEFAULT_HEIGHT / 2;
const DEFAULT_COMPLETE_THRESHOLD_PERCENTAGE = 70;
const DEFAULT_GO_BACK_TO_START = false;
const SwipeButton = ({
  height = exports.DEFAULT_HEIGHT,
  width = DEFAULT_WIDTH,
  borderRadius = DEFAULT_BORDER_RRADIUS,
  title,
  titleContainerProps,
  titleProps,
  titleContainerStyle,
  titleStyle,
  completeThresholdPercentage = DEFAULT_COMPLETE_THRESHOLD_PERCENTAGE,
  underlayStyle,
  disabled,
  Icon,
  containerStyle,
  circleBackgroundColor,
  goBackToStart = DEFAULT_GO_BACK_TO_START,
  onComplete,
  onSwipeEnd = () => {},
  onSwipeStart = () => {},
}) => {
  const [endReached, setEndReached] = react_1.useState(false);
  const opacity = disabled ? 0.5 : 1;
  const opacityStyle = {opacity};
  const [translateX] = react_1.useState(new react_native_1.Animated.Value(0));
  const scrollDistance = width - completeThresholdPercentage / 100 - height;
  const completeThreshold =
    scrollDistance * (completeThresholdPercentage / 100);
  const animateToStart = () => {
    react_native_1.Animated.spring(translateX, {
      toValue: 0,
      tension: 10,
      friction: 5,
      useNativeDriver: false,
    }).start();
    return setEndReached(false);
  };
  const animateToEnd = () => {
    onComplete();
    react_native_1.Animated.spring(translateX, {
      toValue: scrollDistance,
      tension: 10,
      friction: 5,
      useNativeDriver: false,
    }).start();
    if (goBackToStart) {
      setEndReached(true);
      return animateToStart();
    }
    return setEndReached(true);
  };
  const onMove = (_, gestureState) => {
    if (disabled) {
      return false;
    }
    if (gestureState.dx < 0 || gestureState.dx > scrollDistance) {
      return react_native_1.Animated.event([{dx: translateX}], {
        useNativeDriver: false,
      })(
        Object.assign(Object.assign({}, gestureState), {
          dx: gestureState.dx < 0 ? 0 : scrollDistance,
        }),
      );
    }
    return react_native_1.Animated.event([{dx: translateX}], {
      useNativeDriver: false,
    })(gestureState);
  };
  const onRelease = () => {
    if (disabled) {
      return;
    }
    if (endReached) {
      return animateToStart();
    }
    const isCompleted = translateX._value >= completeThreshold;
    return isCompleted ? animateToEnd() : animateToStart();
  };
  const panResponser = () =>
    react_native_1.PanResponder.create({
      onPanResponderGrant: onSwipeStart,
      onPanResponderEnd: onSwipeEnd,
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderMove: onMove,
      onPanResponderRelease: onRelease,
    });
  return react_1.default.createElement(
    react_native_1.View,
    {
      style: [
        styles.container,
        opacityStyle,
        containerStyle,
        {height, width, borderRadius, overflow: 'hidden'},
      ],
    },
    react_1.default.createElement(SwipeButtonText_1.default, {
      title: title,
      titleStyle: titleStyle,
      titleProps: titleProps,
      height: height,
      titleContainerProps: titleContainerProps,
      titleContainerStyle: titleContainerStyle,
    }),
    !disabled &&
      react_1.default.createElement(react_native_1.Animated.View, {
        testID: 'Underlay',
        style: [
          styles.underlayContainer,
          underlayStyle,
          {
            width: translateX.interpolate({
              inputRange: [0, 100],
              outputRange: [31, 131],
            }),
            height,
          },
        ],
      }),
    react_1.default.createElement(SwipeButtonCircle_1.default, {
      circleBackgroundColor: circleBackgroundColor,
      Icon: Icon,
      opacity: opacity,
      panHandlers: panResponser().panHandlers,
      translateX: translateX,
      borderRadius: borderRadius,
      height: height,
    }),
  );
};
exports.default = SwipeButton;
const styles = react_native_1.StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  underlayContainer: {
    position: 'absolute',
    backgroundColor: '#152228',
  },
});
