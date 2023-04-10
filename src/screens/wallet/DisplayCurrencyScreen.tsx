import React, {useState} from 'react';
import {Platform} from 'react-native';
import {Text, Container, TopNavigationComponent} from '@components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {scale} from 'react-native-size-matters';
import {
  StyleService,
  useStyleSheet,
  useTheme,
  Radio,
  Layout,
  Icon,
} from '@tsejerome/ui-kitten-components';
import {useExchangeRate} from '@hooks';
import {currencyOptionList} from '@contexts';

const DisplayCurrencyScreen = () => {
  const styles = useStyleSheet(themedStyles);
  const theme = useTheme();
  const {selectedCurrency, updateCurrency} = useExchangeRate();

  const [currencyListContent, setCurrencyListContent] = useState(<></>);

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
              }}
              style={{marginBottom: scale(20), alignItems: 'flex-end'}}>
              {/* <View style={{flexDirection: 'row', width: 500, borderWidth: 1, borderColor: 'red'}}> */}
              <Icon
                pack="assets"
                name={item.icon}
                height={item.icon === 'btc' ? 20 : 15}
                width={20}
                style={{
                  marginRight: 7,
                  top: item.icon === 'btc' || Platform.OS === 'android' ? 4 : 0,
                }}
              />
              <Text> {item.ticker}</Text>
              {/* </View> */}
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
