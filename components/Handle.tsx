import React, {useMemo} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {BottomSheetHandleProps, useBottomSheet} from '@gorhom/bottom-sheet';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {toRad} from 'react-native-redash';
import {
  StyleService,
  useStyleSheet,
  useTheme,
} from '@tsejerome/ui-kitten-components';
import NavigationAction from './NavigationAction';
import ProgressBar from 'react-native-progress/Bar';

// @ts-ignore
export const transformOrigin = ({x, y}, ...transformations) => {
  'worklet';
  return [
    {translateX: x},
    {translateY: y},
    ...transformations,
    {translateX: x * -1},
    {translateY: y * -1},
  ];
};

interface HandleProps extends BottomSheetHandleProps {
  style?: StyleProp<ViewStyle>;
  onPress(): void;
  syncProgress?: number;
}

const Handle: React.FC<HandleProps> = ({
  style,
  animatedIndex,
  onPress,
  syncProgress,
}) => {
  //#region animations
  const indicatorTransformOriginY = useDerivedValue(() =>
    interpolate(animatedIndex.value, [0, 1, 2], [-1, 0, 1], Extrapolate.CLAMP),
  );
  const theme = useTheme();
  const styles = useStyleSheet(themedStyles);
  const {snapToIndex} = useBottomSheet();

  //#region styles
  const containerStyle = useMemo(() => [styles.header, style], [style]);
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderTopRadius = interpolate(
      animatedIndex.value,
      [1, 0],
      [12, 12],
      Extrapolate.CLAMP,
    );
    return {
      borderTopLeftRadius: borderTopRadius,
      borderTopRightRadius: borderTopRadius,
    };
  });
  const leftIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.leftIndicator,
    }),
    [],
  );
  const leftIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const leftIndicatorRotate = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [toRad(-48), toRad(47), toRad(0)],
      Extrapolate.CLAMP,
    );
    return {
      transform: transformOrigin(
        {x: 0, y: indicatorTransformOriginY.value},
        {
          rotate: `${leftIndicatorRotate}rad`,
        },
        {
          translateX: -5.5,
        },
      ),
    };
  });
  const rightIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.rightIndicator,
    }),
    [],
  );
  const rightIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const rightIndicatorRotate = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [toRad(47), toRad(-48), toRad(0)],
      Extrapolate.CLAMP,
    );
    return {
      transform: transformOrigin(
        {x: 0, y: indicatorTransformOriginY.value},
        {
          rotate: `${rightIndicatorRotate}rad`,
        },
        {
          translateX: 5.5,
        },
      ),
    };
  });
  // render
  return (
    <Animated.View
      style={[
        containerStyle,
        containerAnimatedStyle,
        {backgroundColor: theme['background-basic-color-2']},
      ]}
      renderToHardwareTextureAndroid={true}>
      <TouchableOpacity
        style={styles.indicatorStyle}
        activeOpacity={0.7}
        onPress={onPress}>
        <Animated.View
          style={[leftIndicatorStyle, leftIndicatorAnimatedStyle]}
        />
        <Animated.View
          style={[rightIndicatorStyle, rightIndicatorAnimatedStyle]}
        />
      </TouchableOpacity>
      <ProgressBar progress={syncProgress / 100} width={null} />
      <View style={styles.rightHeader}>
        <NavigationAction icon="menu" />
      </View>
    </Animated.View>
  );
};

export default Handle;

const themedStyles = StyleService.create({
  header: {
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    left: 4,
    top: 16,
    height: 3,
    backgroundColor: 'text-white-color',
    width: 11.5,
    zIndex: 10,
  },
  leftIndicator: {
    borderRadius: 12,
  },
  rightIndicator: {
    borderRadius: 12,
  },
  rightHeader: {
    flexDirection: 'row',
    marginRight: 4,
    alignSelf: 'flex-end',
  },
  indicatorStyle: {
    alignSelf: 'flex-start',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    left: 32,
    top: 12,
    position: 'absolute',
  },
});
