import React from 'react';
import {Platform} from 'react-native';
import {Text, Container, TopNavigationComponent} from '@components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {scale} from 'react-native-size-matters';
import {
  StyleService,
  useStyleSheet,
  Radio,
  Layout,
  Icon,
} from '@tsejerome/ui-kitten-components';
import {useExchangeRate} from '@hooks';
import {currencyOptionList} from '@contexts';

const DisplayCurrencyScreen = ({navigation}) => {
  const styles = useStyleSheet(themedStyles);
  const {selectedCurrency, updateCurrencyTicker, dispatch} = useExchangeRate();
  const [currencyContent, setCurrencyContent] = React.useState(<></>);
  const [currency, setCurrency] = React.useState(selectedCurrency);

  React.useEffect(() => {
    setCurrencyContent(
      <>
        {currencyOptionList.map((item, index) => {
          return (
            <Radio
              key={index}
              checked={currency === item.ticker ? true : false}
              onChange={() => {
                console.log(currency);
                let {newCurrency, isSuccess} = updateCurrencyTicker(
                  item.ticker,
                );
                setCurrency(newCurrency);
                navigation.goBack();
              }}
              style={{marginBottom: scale(20), alignItems: 'flex-end'}}>
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
            </Radio>
          );
        })}
      </>,
    );
  }, [currency, updateCurrencyTicker, selectedCurrency]);

  return (
    <Container useSafeArea>
      <KeyboardAwareScrollView>
        <TopNavigationComponent title="Currency" />

        <Layout style={styles.layout}>{currencyContent}</Layout>
      </KeyboardAwareScrollView>
    </Container>
  );
};

const themedStyles = StyleService.create({
  layout: {
    paddingHorizontal: 24,
  },
});

export default DisplayCurrencyScreen;
