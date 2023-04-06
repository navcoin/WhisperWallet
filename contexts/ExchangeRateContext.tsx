import {createContext} from 'react';


const currencyOption = [
  'BTC',
  'EUR',
  'USD',
  'ARS',
  'AUD',
  'BRL',
  'CAD',
  'CHF',
  'CLP',
  'CZK',
  'DKK',
  'GBP',
  'HKD',
  'HUF',
  'IDR',
  'ILS',
  'INR',
  'JPY',
  'KRW',
  'MXN',
  'MYR',
  'NOK',
  'NZD',
  'PHP',
  'PKR',
  'PLN',
  'RUB',
  'SEK',
  'SGD',
  'THB',
  'TRY',
  'TWD',
  'ZAR',
];

export interface ExchangeRateContextValue {
  selectedCurrency: string;
  currencyRate: number;
  updateExchangeRate: any;
  status: string;
  updateCurrency: any;
}

export const ExchangeRateContext = createContext<
  ExchangeRateContextValue | undefined
>(undefined);
