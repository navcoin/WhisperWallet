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
  const {selectedCurrency, updateCurrency} = useExchangeRate();

  return (
    <Container useSafeArea>
      <KeyboardAwareScrollView>
        <TopNavigationComponent title="Currency" />

        <Layout style={styles.layout}>
          {currencyOptionList.map((item, index) => (
            <Radio
              key={index}
              checked={
                item.isSelected ||
                selectedCurrency.toUpperCase() === item.ticker
                  ? true
                  : false
              }
              onChange={() => {
                updateCurrency(item.ticker);
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

              <Text> {item.ticker}</Text>
            </Radio>
          ))}
        </Layout>
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
