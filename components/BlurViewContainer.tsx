import React, {useEffect, useState} from 'react';
import Animated, {
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
  FadeIn,
} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';

export interface BlurViewContainerProps {
  entering?:
    | typeof BaseAnimationBuilder
    | BaseAnimationBuilder
    | EntryExitAnimationFunction;
}

export const BlurViewContainer: React.FC<BlurViewContainerProps> = ({
  entering = FadeIn,
  children,
}) => {
  const [blurActive, setBlurActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBlurActive(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!blurActive) return null;

  return (
    <Animated.View
      entering={entering}
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
      }}>
      {children}
    </Animated.View>
  );
};
