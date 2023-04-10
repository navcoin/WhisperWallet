import React, {useEffect, Fragment, useRef, useState} from 'react';
import {useExchangeRate} from '@hooks';
import {CurrencyText} from '@components';

const ToFiat = (props: {totalAmount: number}) => {
  const {selectedCurrency, currencyRate} = useExchangeRate();
  const [fiatContent, setFiatContent] = useState(<></>);

  let calculatedAmountRef: any = useRef();

  useEffect(() => {
    calculatedAmountRef.current = props?.totalAmount * currencyRate;
    setFiatContent(
      <CurrencyText
        children={calculatedAmountRef.current}
        currency={selectedCurrency}
        style={{textTransform: 'uppercase'}}
        {...props}
      />,
    );
  }, [currencyRate, props?.totalAmount, selectedCurrency, props]);

  return <Fragment>{fiatContent}</Fragment>;
};

export default ToFiat;
