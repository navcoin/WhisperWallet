import React, {FC, useCallback, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {G, Path} from 'react-native-svg';
import {useTheme} from '@tsejerome/ui-kitten-components';
import useTraceUpdates from '../hooks/useTraceUpdates';

type CircularProgressProps = {
  strokeWidth: number;
  width: number;
  progressVisible: boolean;
  progress: number;
  segments: number[];
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const AnimatedSegments: FC<CircularProgressProps> = ({
  strokeWidth,
  width = 400,
  progressVisible = true,
  progress = 0,
  segments = [0, 0, 0],
}) => {
  const theme = useTheme();

  const progressAlpha = useSharedValue(0);
  const progressBgAlpha = useSharedValue(0);
  const xnavBalanceAlpha = useSharedValue(0);
  const navBalanceAlpha = useSharedValue(0);
  const stakingBalanceAlpha = useSharedValue(0);

  const progressPercentage = useSharedValue(0);
  const progressStartAngle = useSharedValue(0);

  const navBalanceStartAngle = useSharedValue(0);
  const xnavBalanceStartAngle = useSharedValue(0);
  const stakingBalanceStartAngle = useSharedValue(0);

  const navBalanceEndAngle = useSharedValue(0);
  const xnavBalanceEndAngle = useSharedValue(0);
  const stakingBalanceEndAngle = useSharedValue(0);

  useEffect(() => {
    if (progressVisible) {
      progressAlpha.value = withTiming(1, {duration: FADE_DELAY / 4}, () => {});
      progressPercentage.value = withTiming(progress, {
        duration: FADE_DELAY,
      });
      navBalanceAlpha.value = withTiming(0, {duration: FADE_DELAY / 4});
      xnavBalanceAlpha.value = withTiming(0, {duration: FADE_DELAY / 4});
      stakingBalanceAlpha.value = withTiming(0, {duration: FADE_DELAY / 4});
    } else {
      progressPercentage.value = withTiming(0, {
        duration: FADE_DELAY,
      });
      progressAlpha.value = withTiming(0, {duration: FADE_DELAY / 4}, () => {});
      navBalanceAlpha.value = withTiming(1, {duration: FADE_DELAY / 4});
      xnavBalanceAlpha.value = withTiming(1, {duration: FADE_DELAY / 4});
      stakingBalanceAlpha.value = withTiming(1, {duration: FADE_DELAY / 4});
    }
  }, [progressVisible]);

  useEffect(() => {
    if (segments.filter(el => el > 0).length == 0) {
      progressBgAlpha.value = withTiming(1, {duration: FADE_DELAY / 4});
      stakingBalanceAlpha.value = withTiming(0, {duration: FADE_DELAY / 4});
      navBalanceAlpha.value = withTiming(0, {duration: FADE_DELAY / 4});
      xnavBalanceAlpha.value = withTiming(0, {duration: FADE_DELAY / 4});
    } else if (!progressVisible) {
      progressBgAlpha.value = withTiming(0, {duration: FADE_DELAY / 4});
      let totalValue = segments[0] + segments[1] + segments[2];
      let start = 0;
      if (segments[0] > 0) {
        let gap = segments[1] > 0 || segments[2] > 0 ? 6 : 0;
        navBalanceAlpha.value = withTiming(1, {duration: FADE_DELAY / 4});
        navBalanceStartAngle.value = withTiming(start, {
          duration: FADE_DELAY * 2,
        });
        let end = Math.min(
          359,
          Math.floor((segments[0] * 360) / totalValue) - gap,
        );
        navBalanceEndAngle.value = withTiming(end, {
          duration: FADE_DELAY * 2,
        });
        start = start + end + gap;
      } else {
        navBalanceAlpha.value = withTiming(0, {duration: FADE_DELAY / 4});
      }
      if (segments[1] > 0) {
        let gap = segments[0] > 0 || segments[2] > 0 ? 6 : 0;
        xnavBalanceAlpha.value = withTiming(1, {duration: FADE_DELAY / 4});
        xnavBalanceStartAngle.value = withTiming(start, {
          duration: FADE_DELAY * 2,
        });
        let end = Math.min(
          359,
          Math.floor(-gap + (segments[1] * 360) / totalValue),
        );
        xnavBalanceEndAngle.value = withTiming(end, {
          duration: FADE_DELAY * 2,
        });
        start = start + end + gap;
      } else {
        xnavBalanceAlpha.value = withTiming(0, {duration: FADE_DELAY / 4});
      }
      if (segments[2] > 0) {
        let gap = segments[1] > 0 || segments[0] > 0 ? 4 : 0;
        stakingBalanceAlpha.value = withTiming(1, {duration: FADE_DELAY / 4});
        stakingBalanceStartAngle.value = withTiming(start, {
          duration: FADE_DELAY * 2,
        });
        let end = Math.min(
          359,
          Math.floor(-gap + (segments[2] * 360) / totalValue),
        );
        stakingBalanceEndAngle.value = withTiming(end, {
          duration: FADE_DELAY * 2,
        });
      } else {
        stakingBalanceAlpha.value = withTiming(0, {duration: FADE_DELAY / 2});
      }
    }
  }, [segments, progressVisible]);

  useEffect(() => {
    if (progressVisible) {
      if (progress < 0) {
        progressStartAngle.value = withRepeat(
          withTiming(360, {
            duration: FADE_DELAY * 4,
            easing: Easing.linear,
          }),
          -1,
          false,
        );
        progressPercentage.value = withTiming(0.05, {
          duration: FADE_DELAY / 2,
        });
      } else {
        progressStartAngle.value = withTiming(0, {
          duration: FADE_DELAY / 2,
          easing: Easing.linear,
        });
        progressPercentage.value = withTiming(progress, {
          duration: FADE_DELAY / 2,
        });
      }
    } else {
      progressPercentage.value = withTiming(0, {
        duration: FADE_DELAY,
        easing: Easing.linear,
      });
      progressStartAngle.value = withTiming(0, {
        duration: 0,
        easing: Easing.linear,
      });
    }
  }, [progress, progressVisible]);

  const size = width - 32;
  const cx = Math.floor(size / 2);
  const cy = cx;
  const r = cx - strokeWidth;

  const FADE_DELAY = 1000;

  const calcArc = useCallback((startAng, endA) => {
    'worklet';

    let endAngle = endA;
    var start = {
      x: cx - r * Math.cos(startAng * (Math.PI / 180)),
      y: -r * Math.sin(startAng * (Math.PI / 180)) + cy,
    };
    var end = {
      x: cx - r * Math.cos(endAngle * (Math.PI / 180)),
      y: -r * Math.sin(endAngle * (Math.PI / 180)) + cy,
    };
    var largeArcFlag = startAng - endA >= 180 ? '1' : '0';

    var d =
      end.x == start.x && end.y == start.y
        ? `M ${cx} ${cy} m ${-r} 0 a ${r} ${r} 0 1 0 ${
            r * 2
          } 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`
        : `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;

    return d;
  }, []);

  const arcProgress = useDerivedValue(() => {
    let startAng = progressStartAngle.value;
    let endA = progressVisible
      ? startAng + 360 - 360 * progressPercentage.value
      : 360;

    let endAngle = endA > 360 ? endA % 360 : endA;
    if (startAng == endAngle) {
      return '';
    }
    var start = {
      x: cx - r * Math.cos(startAng * (Math.PI / 180)),
      y: -r * Math.sin(startAng * (Math.PI / 180)) + cy,
    };
    var end = {
      x: cx - r * Math.cos(endAngle * (Math.PI / 180)),
      y: -r * Math.sin(endAngle * (Math.PI / 180)) + cy,
    };
    var largeArcFlag = endA - startAng >= 180 ? '0' : '1';

    var d =
      end.x == start.x && end.y == start.y
        ? `M ${cx} ${cy} m ${-r} 0 a ${r} ${r} 0 1 0 ${
            r * 2
          } 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`
        : `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;

    return d;
  }, [progressVisible]);

  const arcNavBalance = useDerivedValue(() => {
    let startAng = 360 - navBalanceStartAngle.value;
    let endA = startAng - navBalanceEndAngle.value;
    return calcArc(startAng, endA);
  }, [navBalanceStartAngle.value, navBalanceEndAngle.value]);

  const arcXnavBalance = useDerivedValue(() => {
    let startAng = 360 - xnavBalanceStartAngle.value;
    let endA = startAng - xnavBalanceEndAngle.value;
    return calcArc(startAng, endA);
  }, [xnavBalanceStartAngle.value, xnavBalanceEndAngle.value]);

  const arcStakingBalance = useDerivedValue(() => {
    let startAng = 360 - stakingBalanceStartAngle.value;
    let endA = startAng - stakingBalanceEndAngle.value;
    return calcArc(startAng, endA);
  }, [stakingBalanceStartAngle.value, stakingBalanceEndAngle.value]);

  const progressAnimatedProps = useAnimatedProps(() => {
    return {d: arcProgress.value};
  }, [arcProgress.value]);

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {opacity: progressAlpha.value};
  }, [progressAlpha.value]);

  const progressBgAnimatedStyle = useAnimatedStyle(() => {
    return {opacity: progressBgAlpha.value};
  }, [progressBgAlpha.value]);

  const balanceNavAnimatedProps = useAnimatedProps(() => {
    return {d: arcNavBalance.value};
  }, [arcNavBalance.value]);

  const balanceXnavAnimatedProps = useAnimatedProps(() => {
    return {d: arcXnavBalance.value};
  }, [arcXnavBalance.value]);

  const balanceStakingAnimatedProps = useAnimatedProps(() => {
    return {d: arcStakingBalance.value};
  }, [arcStakingBalance.value]);

  const balanceNavAnimatedStyle = useAnimatedStyle(() => {
    return {opacity: navBalanceAlpha.value};
  }, [navBalanceAlpha.value]);

  const balanceXnavAnimatedStyle = useAnimatedStyle(() => {
    return {opacity: xnavBalanceAlpha.value};
  }, [xnavBalanceAlpha.value]);

  const balanceStakingAnimatedStyle = useAnimatedStyle(() => {
    return {opacity: stakingBalanceAlpha.value};
  }, [stakingBalanceAlpha.value]);

  console.log('rerender');

  useTraceUpdates('AnimatedSegments', {progressVisible, progress, segments, })

  return (
    <View style={[{...styles.container}, {height: size, width: size}]}>
      <Svg
        style={{
          ...StyleSheet.absoluteFill,
          transform: [{scaleX: -1}],
        }}>
        <G rotation={270} originX={size / 2} originY={size / 2}>
          <AnimatedPath
            style={progressBgAnimatedStyle}
            d={`M ${cx} ${cy} m ${-r} 0 a ${r} ${r} 0 1 0 ${
              r * 2
            } 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`}
            stroke={theme['color-patrick-blue-400']}
            strokeWidth={strokeWidth}
          />
          <AnimatedPath
            style={progressAnimatedStyle}
            animatedProps={progressAnimatedProps}
            stroke={theme['color-nav-pink']}
            strokeWidth={strokeWidth}
            strokeLinecap={'round'}
          />
          <AnimatedPath
            style={balanceNavAnimatedStyle}
            animatedProps={balanceNavAnimatedProps}
            stroke={theme['color-nav-pink']}
            strokeWidth={strokeWidth}
            strokeLinecap={'round'}
          />
          <AnimatedPath
            style={balanceXnavAnimatedStyle}
            animatedProps={balanceXnavAnimatedProps}
            stroke={theme['color-xnav']}
            strokeWidth={strokeWidth}
            strokeLinecap={'round'}
          />
          <AnimatedPath
            style={balanceStakingAnimatedStyle}
            animatedProps={balanceStakingAnimatedProps}
            stroke={theme['color-staking']}
            strokeWidth={strokeWidth}
            strokeLinecap={'round'}
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
});
