import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ExchangeRateContext,
  ExchangeRateContextValue,
} from './ExchangeRateContext';
import {FiatRequest} from '@service';
import {useWallet, useTraceUpdate} from '@hooks';
import {getAsyncStorage, setAsyncStorage} from '@utils/asyncStorageManager';

export const ExchangeRateProvider = (props: any) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('usd');
  const [currencyRate, setCurrencyRate] = useState<number>(0);
  const {firstSyncCompleted, refreshWallet} = useWallet();

  const exchangeRateRequest = FiatRequest(selectedCurrency);
  const [status, setStatus] = useState<string>(exchangeRateRequest.status);

  //   const refetchRate = useCallback(() => {}, [selectedCurrency]);

  const updateCurrency = useCallback(async (newCurrency: string) => {
    const currency = await getAsyncStorage('exchange_rate_currency');
    if (currency !== undefined && currency === newCurrency) {
      return;
    } else if (currency !== newCurrency) {
      await setAsyncStorage('exchange_rate_currency', newCurrency);
      setSelectedCurrency(newCurrency);
    }
  }, []);

  const updateExchangeRate = useCallback(async () => {
    
    try {
      const fetchExchangeRate = await exchangeRateRequest.refetch(
        selectedCurrency,
      );

      let hasError = fetchExchangeRate.data.toString().includes('Error');

      if (hasError) {
        setCurrencyRate(0);
        return;
      }

      setStatus(
        fetchExchangeRate.status === 'loading'
          ? 'loading'
          : fetchExchangeRate.status,
      );
      if (fetchExchangeRate.status === 'success') {
        console.log('Successfully Fetched Exchange Rate Data');
        const {data} = fetchExchangeRate;
        setCurrencyRate(data['nav-coin'][selectedCurrency]);
      }
    } catch (error) {
      console.log('Error Update Exchange Rate: ', error);
    }
  }, [selectedCurrency, exchangeRateRequest]);

  useEffect(() => {
    if (refreshWallet) {
      updateExchangeRate();
    }
  }, [refreshWallet, exchangeRateRequest?.refetch]);

  useEffect(() => {
    const setExchangeRateValue = async () => {
      let currencyTicker = await getAsyncStorage('exchange_rate_currency');

      if (currencyTicker === undefined) {
        currencyTicker = 'usd';
        await setAsyncStorage('exchange_rate_currency', 'usd');
      }
      if (firstSyncCompleted) {
        setSelectedCurrency(currencyTicker);
        let result = await exchangeRateRequest.refetch(currencyTicker);
        if (result && result.status === 'success') {
          setCurrencyRate(result?.data['nav-coin'][currencyTicker]);
        }
      }
    };

    setExchangeRateValue();
  }, [firstSyncCompleted]);

  const exchangeRateContext: ExchangeRateContextValue = useMemo(
    () => ({
      currencyRate,
      selectedCurrency,
      updateExchangeRate,
      status,
      updateCurrency,
    }),
    [
      currencyRate,
      selectedCurrency,
      updateExchangeRate,
      status,
      updateCurrency,
    ],
  );

  return (
    <ExchangeRateContext.Provider value={exchangeRateContext}>
      {props.children}
    </ExchangeRateContext.Provider>
  );
};

export default ExchangeRateProvider;
