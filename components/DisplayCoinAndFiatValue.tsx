import {View} from 'react-native';
import React from 'react';
import CurrencyText from './CurrencyText';
import Text from './Text';
import {scale} from 'react-native-size-matters';
import {ToFiat} from '@utils';

const DisplayCoinAndFiatValue = props => {
  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center', marginTop: scale(4)}}>
      <CurrencyText
        adjustsFontSizeToFit
        category="caption1"
        children={props.coinAmount.toFixed(8)}
        type={props.type_id}
        formatType={props.type_id}
        currency={props.currency}
      />
      <Text adjustsFontSizeToFit marginHorizontal={3} category="h6">
        /
      </Text>
      <ToFiat
        totalAmount={props.coinAmount}
        category="caption1"
        adjustsFontSizeToFit
      />
    </View>
  );
};

export default DisplayCoinAndFiatValue;
