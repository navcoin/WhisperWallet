import React, {memo} from 'react';

import Text, {MyTextProps} from './Text';

import {Category_Types_Enum, Balance_Types_Enum} from '../constants/Type';
import numeral from 'numeral';

export interface CurrencyTextProps extends MyTextProps {
  type?: Category_Types_Enum;
  formatType?: Balance_Types_Enum;
  currency: string;
}

const CurrencyText = memo(
  ({
    children,
    type,
    formatType = Balance_Types_Enum.Default,
    currency = 'NAV',
    ...props
  }: CurrencyTextProps) => {
    // console.log(children, "children")
    const formatLimit = (amount: string, currency = 'NAV') => {
      let textResult = '';
      try {
        if (isNaN(parseFloat(amount))) {
          textResult += numeral(parseFloat(amount.replace(',', ''))).format(
            '0,0.00a',
          );
        } else {
          textResult += numeral(parseFloat(amount)).format('0,0.00a');
        }
      } catch (e) {
        console.log(e);
      }
      return textResult + ` ${currency}`;
    };

    const formatSaving = (
      amount: string,
      typeCategories = Category_Types_Enum.Input,
      currency = '$',
    ) => {
      let textResult = typeCategories === Category_Types_Enum.Input ? '' : '-';
      textResult += `${currency}`;
      try {
        if (isNaN(parseFloat(amount))) {
          textResult += numeral(parseFloat(amount.replace(',', ''))).format(
            '0,0.00',
          );
        } else {
          textResult += numeral(parseFloat(amount)).format('0,0.00');
        }
      } catch (e) {
        console.log(e);
      }
      return textResult;
    };

    const formatInky = (
      amount: string,
      typeCategories = Category_Types_Enum.Input,
      currency = '$',
    ) => {
      let textResult = typeCategories === Category_Types_Enum.Input ? '+' : '-';
      textResult += `${currency}`;
      try {
        if (isNaN(parseFloat(amount))) {
          textResult += numeral(parseFloat(amount.replace(',', ''))).format(
            '0,0.00',
          );
        } else {
          textResult += numeral(parseFloat(amount)).format('0,0.00');
        }
      } catch (e) {
        console.log(e);
      }
      return textResult;
    };

    const formatDefault = (amount: string, currency = 'NAV') => {
      let textResult = '';

      /*console.log(currency)*/
      if (currency.substring(0, 4) == 'item') {
        textResult = parseInt(amount);
      } else {
        if (parseFloat(amount) > 0 && parseFloat(amount) < 0.01) {
          textResult += '<0.01';
        } else {
          try {
            if (isNaN(parseFloat(amount))) {
              textResult += numeral(parseFloat(amount.replace(',', ''))).format(
                '0,0.00',
              );
            } else {
              textResult += numeral(parseFloat(amount)).format('0,0.00');
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
      return textResult + ` ${currency}`;
    };

    const formatFiatCurrency = (amount, currency = 'USD') => {
      let textResult = '';
      try {
        if (isNaN(parseFloat(amount))) {
          textResult += numeral(parseFloat(amount.replace(',', ''))).format(
            '0,0.00a',
          );
        } else {
          textResult += numeral(parseFloat(amount)).format('0,0.00a');
        }
      } catch (e) {
        console.log(e);
      }

      return ` ${currency}` + textResult;
    };

    const formatSecure = (currency = 'NAV') => {
      return '****' + currency;
    };

    return (
      <Text {...props}>
        {formatType === Balance_Types_Enum.Nav
          ? formatDefault(children, currency)
          : formatType === Balance_Types_Enum.xNav
          ? formatDefault(children, 'xNAV')
          : formatType === Balance_Types_Enum.Staking
          ? formatDefault(children, 'NAV')
          : formatType === Balance_Types_Enum.PrivateToken
          ? formatDefault(children, currency)
          : formatType === Balance_Types_Enum.Nft
          ? formatDefault(children, 'item')
          : formatType === Balance_Types_Enum.Fiat
          ? formatFiatCurrency(children, currency)
          : formatDefault(children, currency)}
      </Text>
    );
  },
);

export default CurrencyText;
