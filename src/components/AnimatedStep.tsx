import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@tsejerome/ui-kitten-components';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { animatedStepStyles as styles } from './styles';

interface AnimatedStepProps {
  step: number;
  steps: number;
  style?: StyleProp<ViewStyle>;
}

const Step = ({ start, active }: { start?: boolean; active?: boolean }) => {
  const [width, setWidth] = React.useState<number>(1);
  const theme = useTheme();

  const onLayout = React.useCallback(({ nativeEvent }) => {
    setWidth(prev => {
      if (prev !== nativeEvent.layout.width) {
        return nativeEvent.layout.width;
      }
      return prev;
    });
  }, []);

  const progress = useDerivedValue(() => {
    return active ? withTiming(1) : withTiming(0);
  }, [active]);

  const style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.99, 1],
      [
        theme['color-basic-1300'],
        theme['color-basic-1300'],
        theme['color-xnav'],
      ],
    );

    return {
      backgroundColor: backgroundColor,
    };
  });

  const lineStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [theme['color-basic-1300'], theme['color-xnav']],
    );

    const widthX = interpolate(progress.value, [0, 1], [0, width]);

    return {
      flex: 1,
      width: widthX,
      backgroundColor: backgroundColor,
    };
  });

  return (
    <View
      style={[
        styles.step,
        {
          flex: start ? 0 : 1,
        },
      ]}>
      <View
        onLayout={onLayout}
        style={[styles.line, { backgroundColor: theme['color-basic-1300'] }]}>
        <Animated.View style={lineStyle} />
      </View>
      <Animated.View style={[styles.dot, style]} />
    </View>
  );
};

const AnimatedStep = ({ step, steps = 4, style }: AnimatedStepProps) => {
  const stepsArray = [...Array(steps)];

  return (
    <View style={[styles.container, style]}>
      {stepsArray.map((el, index) => {
        return index == 0 ? (
          <Step start={true} active key={index} />
        ) : (
          <Step active={step >= index} key={index} />
        );
      })}
    </View>
  );
};

export default AnimatedStep;
