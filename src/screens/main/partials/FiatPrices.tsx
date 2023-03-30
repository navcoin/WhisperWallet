import {View} from 'react-native';
import React from 'react';
import {
  StyleService,
  useStyleSheet,
  useTheme,
  Icon,
} from '@tsejerome/ui-kitten-components';
import {scale, verticalScale} from 'react-native-size-matters';

import {Text} from '@components';

const FiatAvatar = () => {
  const theme = useTheme();
  const styles = useStyleSheet(themedStyles);

  return (
    <View>
      <View
        style={[
          {
            backgroundColor: theme['text-white-color'],
            borderColor: theme['background-basic-color-8'],
            ...styles.avatarWrapper,
          },
        ]}>
        <Icon
          style={{
            width: 14,
            height: 14,
          }}
          pack="assets"
          name="navlogo"
        />
      </View>
    </View>
  );
};

// export enum Currency_Type_Enum {
//   USD = '$',
//   GPB = '£',
//   JPY = '¥',
//   BTC = '₿',
//   EUR = '€',
// }

export enum Currency_Type_Enum {
  USD = 'usd',
  GBP = 'gbp',
  JPY = 'jpy',
  BTC = 'btc',
  EUR = 'eur',
}

export const FiatSymbol = (currency: string) => {
  let symbol = '$';
  if (currency === Currency_Type_Enum.GBP) {
    symbol = '£';
  } else if (currency === Currency_Type_Enum.EUR) {
    symbol = '€';
  } else if (currency === Currency_Type_Enum.JPY) {
    symbol = '¥';
  } else if (currency === Currency_Type_Enum.BTC) {
    symbol = '₿';
  }
  return symbol;
};
interface Fiat {
  value: number;
  currency: string;
}

const Fiat = ({value, currency}: Fiat) => {
  const styles = useStyleSheet(themedStyles);
  return (
    <View style={styles.container}>
      <View style={styles.textIcon}>
        <FiatAvatar />
        <View style={styles.textWrapper}>
          <Text uppercase category="caption2">
            {' '}
            {`${'NAV'}/${currency}`}
          </Text>
        </View>
      </View>
      <View style={styles.priceWrapper}>
        <Text textAlign="right" category="">
          <Text category="h6">{FiatSymbol(currency)}</Text> {value}
        </Text>
      </View>
    </View>
  );
};

const themedStyles = StyleService.create({
  container: {flexDirection: 'row', paddingBottom: verticalScale(35)},
  textWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(5),
  },
  priceWrapper: {justifyContent: 'center', paddingRight: scale(16)},
  textIcon: {flexDirection: 'row', flex: 1},
  avatarWrapper: {
    borderWidth: scale(0.3),
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    borderRadius: scale(30),
  },
});

export default Fiat;
