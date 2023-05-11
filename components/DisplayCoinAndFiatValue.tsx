import {View} from 'react-native';
import React, {useEffect} from 'react';
import CurrencyText from './CurrencyText';
import Text from './Text';
import {scale} from 'react-native-size-matters';
import {ToFiat} from '@utils';

const DisplayCoinAndFiatValue = props => {
  const {coinAmount, type_id, currency, hideFiat, fiatCurrency} = props;
  const [content, setContent] = React.useState(<></>);

  React.useEffect(() => {
    setContent(
      <>
        <Text
          adjustsFontSizeToFit
          marginHorizontal={3}
          marginBottom={2}
          category="h6">
          /
        </Text>
        <ToFiat
          totalAmount={coinAmount}
          category="caption1"
          adjustsFontSizeToFit
          hideFiat={hideFiat}
        />
      </>,
    );
  }, [coinAmount, fiatCurrency, hideFiat]);

  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center', marginTop: scale(4)}}>
      <CurrencyText
        adjustsFontSizeToFit
        category="caption1"
        children={coinAmount.toFixed(8)}
        type={type_id}
        formatType={type_id}
        currency={currency}
      />
      {hideFiat ? <></> : <>{content}</>}
    </View>
  );
};

export default DisplayCoinAndFiatValue;
