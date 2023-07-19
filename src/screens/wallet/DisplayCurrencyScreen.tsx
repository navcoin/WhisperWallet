import React, { useEffect, useState } from 'react';
import { Platform, ScrollView } from 'react-native';
import { Text, Container, TopNavigationComponent } from '@components';
import Animated, {
  useAnimatedRef,
  useSharedValue,
} from 'react-native-reanimated';
import { scale } from 'react-native-size-matters';
import {
  StyleService,
  useStyleSheet,
  Radio,
  Layout,
  Icon,
} from '@tsejerome/ui-kitten-components';
import { useExchangeRate } from '@hooks';
import { currencyOptionList } from '@contexts';

const AnimatedRadio = Animated.createAnimatedComponent(Radio);

const DisplayCurrencyScreen = ({ navigation }) => {
  const styles = useStyleSheet(themedStyles);
  const { selectedCurrency, updateCurrencyTicker, dispatch } =
    useExchangeRate();
  const [currencyContent, setCurrencyContent] = React.useState(<></>);
  const [currency, setCurrency] = React.useState(selectedCurrency);
  const [coord, setCoord] = useState([]);
  const [scrollIsInitiated, setScrollIsInitiated] = useState(false);
  const aref = useAnimatedRef<ScrollView>();
  let scrollPosIndex = useSharedValue(0);
  let coordinate = useSharedValue([]);

  useEffect(() => {
    setCurrencyContent(
      <>
        {currencyOptionList.map((item, index) => {
          if (item.ticker === currency) {
            scrollPosIndex.value = index;
            setScrollIsInitiated(true);
          }
          return (
            <AnimatedRadio
              key={index}
              onLayout={event => {
                const layout = event.nativeEvent.layout;
                coord[index] = layout.y;
                coordinate.value = coord;
              }}
              checked={currency === item.ticker ? true : false}
              onChange={() => {
                let { newCurrency, isSuccess } = updateCurrencyTicker(
                  item.ticker,
                );
                setCurrency(newCurrency);
                navigation.goBack();
              }}
              style={[{ marginBottom: scale(20), alignItems: 'flex-end' }]}>
              {item.icon ? (
                <Icon
                  pack="assets"
                  name={item.icon}
                  height={item.icon === 'btc' ? 20 : 15}
                  width={20}
                  style={{
                    marginRight: 7,
                    top:
                      item.icon === 'btc' || Platform.OS === 'android' ? 4 : 0,
                  }}
                />
              ) : null}

              <Text> {item.ticker.toUpperCase()}</Text>
            </AnimatedRadio>
          );
        })}
      </>,
    );
  }, [currency, updateCurrencyTicker, selectedCurrency]);

  useEffect(() => {
    if (scrollIsInitiated) {
      setTimeout(() => {
        aref.current.scrollTo({
          x: 0,
          y: coordinate.value[scrollPosIndex.value - 1],
          animated: true,
        });
      }, 500);
    }
  }, [aref, coordinate.value, scrollIsInitiated, scrollPosIndex.value]);

  return (
    <Container useSafeArea>
      <Animated.ScrollView ref={aref}>
        <TopNavigationComponent title="Currency" />

        <Layout style={styles.layout}>{currencyContent}</Layout>
      </Animated.ScrollView>
    </Container>
  );
};

const themedStyles = StyleService.create({
  layout: {
    paddingHorizontal: 24,
  },
});

export default DisplayCurrencyScreen;
