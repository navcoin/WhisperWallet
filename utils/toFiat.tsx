import React, {useEffect, Fragment, useRef} from 'react';
import {useExchangeRate} from '@hooks';
import {CurrencyText} from '@components';

const ToFiat = (props: {totalAmount: number}) => {
  const {selectedCurrency, currencyRate} = useExchangeRate();

  let calculatedAmountRef: any = useRef();

  let currency = selectedCurrency ? selectedCurrency.toUpperCase() : '';

  useEffect(() => {
    calculatedAmountRef.current = props?.totalAmount * currencyRate;
  }, [selectedCurrency, currencyRate, props?.totalAmount, calculatedAmountRef]);

  return (
    <Fragment>
      <CurrencyText
        children={calculatedAmountRef.current}
        currency={currency}
        
        {...props}
      />
    </Fragment>
  );
};

export default React.memo(ToFiat);
