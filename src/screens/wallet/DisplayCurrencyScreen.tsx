import React, {useState} from 'react';
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
              <Icon
                pack="assets"
                name={item.icon}
                height={15}
                width={20}
                style={{
                  marginRight: 7,
                }}
              />
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
