import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from '@ui-kitten/components';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedStepProps {
  step: number;
  steps: number;
  style?: StyleProp<ViewStyle>;
}

const AnimatedStep = ({step, steps = 4, style}: AnimatedStepProps) => {
  const theme = useTheme();

  const stepsArray = [...Array(steps)];

  const Step = React.useCallback(
    ({start, active}: {start?: boolean; active?: boolean}) => {
      const [width, setWidth] = React.useState<number>(1);

      const onLayout = React.useCallback(({nativeEvent}) => {
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
            style={[styles.line, {backgroundColor: theme['color-basic-1300']}]}>
            <Animated.View style={lineStyle} />
          </View>
          <Animated.View style={[styles.dot, style]} />
        </View>
      );
    },
    [],
  );

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 64,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  line: {
    height: 2,
    flex: 1,
  },
});
