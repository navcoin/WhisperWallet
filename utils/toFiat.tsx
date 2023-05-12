import React, {useEffect, Fragment, useRef, useState} from 'react';
import {useExchangeRate} from '@hooks';
import {CurrencyText} from '@components';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useWallet} from '@hooks';

interface ToFiatInterface {
  totalAmount: number;
  hideFiat: boolean;
  navigation: any;
}

const ToFiat = (props: ToFiatInterface) => {
  let {hideFiat, totalAmount} = props;
  const {refreshWallet} = useWallet();
  const {selectedCurrency, currencyRate = 0.0} = useExchangeRate();
  const [fiatContent, setFiatContent] = useState(<></>);
  const navigation = useNavigation();

  let calculatedAmountRef: any = useRef();
  let rate = useRef(currencyRate);

  useEffect(() => {
    if (hideFiat) {
      setFiatContent(<></>);
    } else {
      calculatedAmountRef.current = totalAmount * currencyRate;

      setFiatContent(
        <CurrencyText
          children={calculatedAmountRef.current}
          currency={selectedCurrency.toUpperCase()}
          {...props}
        />,
      );
    }
  }, [currencyRate, totalAmount, selectedCurrency, hideFiat]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshWallet();
      if (hideFiat) {
        setFiatContent(<></>);
      } else {
        calculatedAmountRef.current = totalAmount * currencyRate;

        setFiatContent(
          <CurrencyText
            children={calculatedAmountRef.current}
            currency={selectedCurrency.toUpperCase()}
            {...props}
          />,
        );
      }
    });

    return unsubscribe;
  }, [currencyRate, totalAmount, selectedCurrency, hideFiat, navigation]);

  return <Fragment>{fiatContent}</Fragment>;
};

export default ToFiat;
