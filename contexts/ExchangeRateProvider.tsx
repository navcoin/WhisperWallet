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
  const HIDE_CURRENCY = 'none';

  const seCurrencyTicker = useMemo(() => {
    return async () => {
      let currency = '';
      let currencyStore = await getAsyncStorage('exchange_rate_currency');

      if (!currencyStore || currencyStore === undefined) {
        currencyStore = await setAsyncStorage('exchange_rate_currency', 'usd');

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
  const [state, dispatch] = useReducer(exchangeReducer, initialData);
  const {firstSyncCompleted, refreshWallet} = useWallet();

  const exchangeRateRequest = FiatRequest(state.selectedCurrency);
  const [status, setStatus] = useState<string>(exchangeRateRequest.status);

  const updateCurrency = useCallback(
    async (newCurrency: string) => {
      newCurrency = newCurrency.toLowerCase();
      const currency = await getAsyncStorage('exchange_rate_currency');

      if (currency !== undefined && currency === newCurrency) {
        return;
      } else if (currency !== newCurrency) {
        if (newCurrency === HIDE_CURRENCY) {
          dispatch({type: 'HIDE_FIAT', payload: 'true'});
        } else {
          dispatch({type: 'HIDE_FIAT', payload: 'false'});
        }
        dispatch({type: 'SET_CURRENCY', payload: newCurrency});

        updateExchangeRate();
        refreshWallet();
        let saveCurr = await setAsyncStorage(
          'exchange_rate_currency',
          newCurrency,
        );

        return saveCurr;
      }
    },
    [state.selectedCurrency, state.currencyRate],
  );

  const updateExchangeRate = useCallback(async () => {
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
        const {data} = fetchExchangeRate;
        dispatch({
          type: 'UPDATE_RATE',
          payload: data['nav-coin'][state.selectedCurrency],
        });

        return true;
      }
    } catch (error) {
      console.log('Error Update Exchange Rate: ', error);
      return false;
    }
  }, [state.selectedCurrency, exchangeRateRequest, state.hideFiat]);

  useEffect(() => {
    if (
      (refreshWallet || state.currencyRate || state.selectedCurrency) &&
      !state.hideFiat
    ) {
      updateExchangeRate();
    }
  }, [refreshWallet, state.currencyRate, state.selectedCurrency]);

  useEffect(() => {
    const setExchangeRateValue = async () => {
      seCurrencyTicker();

      // if (state.hideFiat) {
      //   return;
      // }

      if (firstSyncCompleted) {
        let result = await exchangeRateRequest.refetch(state.selectedCurrency);
        if (result && result.status === 'success') {
          dispatch({
            type: 'UPDATE_RATE',
            payload: result?.data['nav-coin'][state.selectedCurrency],
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
      updateCurrency,
      hideFiat: state.hideFiat,
      HIDE_CURRENCY,
    }),
    [
      state.currencyRate,
      state.selectedCurrency,
      updateExchangeRate,
      status,
      updateCurrency,
      state.hideFiat,
    ],
  );

  return (
    <ExchangeRateContext.Provider value={exchangeRateContext}>
      {props.children}
    </ExchangeRateContext.Provider>
  );
};

export default ExchangeRateProvider;
