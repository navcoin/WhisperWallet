import React, { memo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useStyleSheet } from '@tsejerome/ui-kitten-components';
import { useNavigation } from '@react-navigation/native';
import { Card, Container, Button } from '@components';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { OnBoarding } from '@constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale } from 'react-native-size-matters';
import { onboardingStyles } from './styles';

const OnBoardingPage = memo(() => {
  const { navigate } = useNavigation();
  const { height, width } = useWindowDimensions();
  const styles = useStyleSheet(onboardingStyles);

  const translationX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationX.value = event.contentOffset.x;
  });

  /*const style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translationX.value,
      OnBoarding.map((_, i) => (width - 50) * i),
      OnBoarding.map(product => product.color),
    ) as string;
    return {backgroundColor, flex: 1};
  });*/
  return (
    <Container style={styles.container}>
      <View style={[{ height: height }, styles.onboardingList]}>
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          decelerationRate="fast"
          contentContainerStyle={styles.content}
          // snapToInterval={scale(width - 80)}
          snapToOffsets={[...Array(OnBoarding.length)].map(
            (x, i) => i * (width - scale(80)),
          )}
          horizontal
          showsHorizontalScrollIndicator={true}>
          {OnBoarding.map((product, index) => (
            <Card x={translationX} product={product} key={index} />
          ))}
        </Animated.ScrollView>
      </View>

      <View style={styles.bottomView}>
        <Button
          size={'large'}
          children="Start using Whisper"
          style={styles.button}
          onPress={() => {
            AsyncStorage.setItem('shownWelcome', 'true').then(() => {
              navigate('App');
            });
          }}
          status="primary-whisper"
        />
      </View>
    </Container>
  );
});

export default OnBoardingPage;
