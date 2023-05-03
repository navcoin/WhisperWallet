import React, {useEffect, Fragment, useRef, useState} from 'react';
import {useExchangeRate} from '@hooks';
import {CurrencyText} from '@components';

interface ToFiatInterface {
  totalAmount: number;
  hideFiat: boolean;
}

const ToFiat = (props: ToFiatInterface) => {
  let {hideFiat, totalAmount} = props;
  const {selectedCurrency, currencyRate} = useExchangeRate();
  const [fiatContent, setFiatContent] = useState(<></>);

  let calculatedAmountRef: any = useRef();

  useEffect(() => {
    if (hideFiat) {
      setFiatContent(<></>);
    } else {
      calculatedAmountRef.current = totalAmount * currencyRate;
      setFiatContent(
        <CurrencyText
          children={calculatedAmountRef.current}
          currency={selectedCurrency}
          style={{textTransform: 'uppercase'}}
          {...props}
        />,
      );
    }
  }, [currencyRate, totalAmount, selectedCurrency, hideFiat, props]);

  return <Fragment>{fiatContent}</Fragment>;
};

export default ToFiat;
