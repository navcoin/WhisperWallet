import {useContext} from 'react';
import {ExchangeRateContext} from '@contexts';

const useExchangeRate = () => {
  const context = useContext(ExchangeRateContext);
  if (context === undefined) {
    throw new Error(
      'useExchangeRate must be used within a ExchangeRateContext',
    );
  }
  return context;
};

export default useExchangeRate;
