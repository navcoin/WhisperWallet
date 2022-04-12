import React, {memo} from 'react';
import {useWindowDimensions, View, Alert} from 'react-native';
import {
  useTheme,
  StyleService,
  useStyleSheet,
  Button,
} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Container from '../components/Container';
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Card from '../components/Card';
import {OnBoarding} from '../constants/Data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAsyncStorage from '../hooks/useAsyncStorage';

const OnBoardingPage = memo(() => {
  const {navigate} = useNavigation();
  const {height, width} = useWindowDimensions();
  const {top, bottom} = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useStyleSheet(themedStyles);
  const [lockAfterBackground, setLockAfterBackground] = useAsyncStorage(
    'lockAfterBackground',
    'false',
  );

  const translationX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationX.value = event.contentOffset.x;
  });
  const snapToOffsets = [0, 400];
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
      <View style={[{height: height}, {flex: 1}]}>
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          decelerationRate="fast"
          contentContainerStyle={styles.content}
          snapToInterval={width - 80}
          horizontal
          showsHorizontalScrollIndicator={true}>
          {OnBoarding.map((product, index) => (
            <Card x={translationX} product={product} key={index} />
          ))}
        </Animated.ScrollView>
      </View>

      <View style={styles.bottomView}>
        <Button
          size="large"
          children="Start using Whisper Wallet!"
          style={{flex: 1, marginLeft: 46}}
          onPress={() => {
            Alert.alert(
              'Security',
              'Do you want to lock automatically the wallet when it goes to background?',
              [
                {
                  text: 'Yes',
                  onPress: () => {
                    AsyncStorage.setItem('shownWelcome', 'true').then(() => {
                      setLockAfterBackground('true');
                      navigate('Intro');
                    });
                  },
                },
                {
                  text: 'No',
                  onPress: () => {
                    AsyncStorage.setItem('shownWelcome', 'true').then(() => {
                      navigate('Intro');
                    });
                  },
                },
              ],
            );
          }}
          status="primary"
        />
      </View>
    </Container>
  );
});

export default OnBoardingPage;

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    paddingLeft: 16,
  },
  content: {
    paddingRight: 60,
    paddingLeft: 16,
  },
  bottomView: {
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 32,
    marginRight: 24,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    marginBottom: 16,
  },
  dot: {
    marginRight: 46,
  },
  animated: {
    flexDirection: 'row',
    paddingLeft: 16,
  },
});
