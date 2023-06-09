import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useReducer,
} from 'react';
import {
  ExchangeRateContext,
  ExchangeRateContextValue,
} from './ExchangeRateContext';
import {FiatRequest} from '@service';
import {useWallet, useTraceUpdate} from '@hooks';
import {getAsyncStorage, setAsyncStorage} from '@utils/asyncStorageManager';
import useAsyncStorageHook from '@hooks/useAsyncStorage';

export const initialData = {
  currencyRate: 0,
  selectedCurrency: '',
  hideFiat: false,
};

export const exchangeReducer = (
  state: {
    [x: string]: any;
    currencyRate: any;
    selectedCurrency: any;
  },
  action: {type: any; payload: any},
) => {
  switch (action.type) {
    case 'UPDATE_RATE':
      state.currencyRate = action.payload;
      return state;
    case 'SET_CURRENCY':
      state.selectedCurrency = action.payload;
      return state;
    case 'HIDE_FIAT':
      if (action.payload === 'true') {
        state.hideFiat = true;
      } else {
        state.hideFiat = false;
      }
      return state;
    default:
      return state;
  }
};

export const ExchangeRateProvider = (props: any) => {
  const HIDE_CURRENCY = 'NONE';

  const [state, dispatch] = useReducer(exchangeReducer, initialData);
  const [storedValue, setValue] = useAsyncStorageHook('exchange_rate_currency');

  const {firstSyncCompleted, refreshWallet} = useWallet();

  const exchangeRateRequest = FiatRequest(state.selectedCurrency);
  const [status, setStatus] = useState<string>(exchangeRateRequest.status);

  const seCurrencyTicker = useMemo(() => {
    return async () => {
      let currency = '';
      let currencyStore = await getAsyncStorage('exchange_rate_currency');

      if (!currencyStore || currencyStore === undefined) {
        currencyStore = await setAsyncStorage('exchange_rate_currency', 'USD');

        if (currencyStore) {
          currency = await getAsyncStorage('exchange_rate_currency');

          if (currencyStore === HIDE_CURRENCY) {
            dispatch({type: 'HIDE_FIAT', payload: 'true'});
          } else {
            dispatch({type: 'HIDE_FIAT', payload: 'false'});
          }
          dispatch({type: 'SET_CURRENCY', payload: currency});

          return currency;
        }
      }
      dispatch({type: 'SET_CURRENCY', payload: currencyStore});
      return currencyStore;
    };
  }, []);

  const updateCurrencyTicker = useCallback(newCurrency => {
    const currency = storedValue;

    if (currency !== undefined && currency === newCurrency) {
      return {newCurrency, isSuccess: true};
    } else if (currency !== newCurrency) {
      if (newCurrency === HIDE_CURRENCY) {
        dispatch({type: 'HIDE_FIAT', payload: 'true'});
      } else {
        dispatch({type: 'HIDE_FIAT', payload: 'false'});
      }
      dispatch({type: 'SET_CURRENCY', payload: newCurrency});
      setValue(newCurrency);

      return {newCurrency, isSuccess: true};
    }
  }, []);

  const updateExchangeRate = useCallback(async () => {
    let result: any = '';
    try {
      if (state.hideFiat) {
        return;
      }

      const fetchExchangeRate = await exchangeRateRequest.refetch(
        state.selectedCurrency,
      );

      let hasError =
        fetchExchangeRate?.data?.toString().includes('Error') ||
        fetchExchangeRate?.data === undefined;

      if (hasError) {
        return;
      }
      if (fetchExchangeRate.status === 'success') {
        console.log('Successfully Fetched Exchange Rate Data');
        result = fetchExchangeRate?.data;

        dispatch({
          type: 'UPDATE_RATE',
          payload: result['nav-coin'][state.selectedCurrency.toLowerCase()],
        });

        return {result, isSuccess: true};
      }
    } catch (error) {
      console.log('Error Update Exchange Rate: ', error);
      return {error, result: 'failed', isSuccess: false};
    }
  }, [state.selectedCurrency, exchangeRateRequest, state.hideFiat]);

  useEffect(() => {
    const update = async () => {
      if (
        (refreshWallet || state.currencyRate || state.selectedCurrency) &&
        !state.hideFiat
      ) {
        const exch = await updateExchangeRate();
        if (exch?.isSuccess) {
          dispatch({
            type: 'UPDATE_RATE',
            payload:
              exch?.result['nav-coin'][state.selectedCurrency.toLowerCase()],
          });
        }
      }
    };

    update();
  }, [refreshWallet, state.currencyRate, state.selectedCurrency]);

  useEffect(() => {
    const setExchangeRateValue = async () => {
      seCurrencyTicker();
      if (firstSyncCompleted) {
        let result = await exchangeRateRequest.refetch(state.selectedCurrency);
        if (result && result.status === 'success') {
          dispatch({
            type: 'UPDATE_RATE',
            payload:
              result?.data['nav-coin'][state.selectedCurrency.toLowerCase()],
          });
        }
      }
    };

    setExchangeRateValue();
  }, []);

  const exchangeRateContext: ExchangeRateContextValue = useMemo(
    () => ({
      currencyRate: state.currencyRate,
      dispatch,
      selectedCurrency: state.selectedCurrency ? state.selectedCurrency : '',
      updateExchangeRate,
      status,
      hideFiat: state.hideFiat,
      HIDE_CURRENCY,
      updateCurrencyTicker,
    }),
    [
      state.currencyRate,
      state.selectedCurrency,
      updateExchangeRate,
      status,
      state.hideFiat,
      updateCurrencyTicker,
    ],
  );

  return (
    <ExchangeRateContext.Provider value={exchangeRateContext}>
      {props.children}
    </ExchangeRateContext.Provider>
  );
};

export default ExchangeRateProvider;
