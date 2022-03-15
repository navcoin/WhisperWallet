import React from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {useTheme} from '@ui-kitten/components';

import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {stat} from 'fs';

interface DotsProps<T> {
  translationValue: Animated.SharedValue<number>;
  data: Array<T>;
  widthInterpolate?: number;
  widthDot?: number;
  heightDot?: number;
  style?: StyleProp<ViewStyle>;
  status?: 'basic' | 'primary' | 'white';
}

function Dots<T>({
  data,
  translationValue,
  widthInterpolate = 8,
  widthDot = 8,
  heightDot = 8,
  style,
  status = 'white',
}: DotsProps<T>) {
  const theme = useTheme();
  const {width, height} = useWindowDimensions();

  return (
    <View style={[styles.container, style]}>
      {data.map((_, i) => {
        const dotColor = useDerivedValue(() => {
          return interpolateColor(
            translationValue.value,
            [(i - 1) * width, i * width, (i + 1) * width],
            [
              status === 'basic'
                ? theme['color-basic-1300']
                : status === 'white'
                ? theme['color-basic-1900']
                : theme['dot-basic-color'],
              status === 'basic'
                ? theme['color-primary-100']
                : status === 'white'
                ? theme['text-white-color']
                : theme['color-primary-100'],
              status === 'basic'
                ? theme['color-basic-1300']
                : status === 'white'
                ? theme['color-basic-1900']
                : theme['dot-basic-color'],
            ],
          );
        });

        const dotWidth = useDerivedValue(() => {
          return interpolate(
            translationValue.value,
            [(i - 1) * width, i * width, (i + 1) * width],
            [widthDot, widthInterpolate, widthDot],
            Extrapolate.CLAMP,
          );
        });

        const dotStyle = useAnimatedStyle(() => {
          return {
            backgroundColor: dotColor.value,
            width: dotWidth.value,
            height: heightDot,
          };
        });

        return (
          <Animated.View key={i.toString()} style={[styles.dot, dotStyle]} />
        );
      })}
    </View>
  );
}

export default Dots;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
});
