import { createContext } from 'react';

export const currencyOptionList = [
  { ticker: 'NONE' },
  { ticker: 'BTC', icon: 'btc' },
  { ticker: 'EUR', icon: 'eur' },
  { ticker: 'USD', icon: 'usd' },
  { ticker: 'ARS', icon: 'ars' },
  { ticker: 'AUD', icon: 'aud' },
  { ticker: 'BRL', icon: 'brl' },
  { ticker: 'CAD', icon: 'cad' },
  { ticker: 'CHF', icon: 'chf' },
  { ticker: 'CLP', icon: 'clp' },
  { ticker: 'CZK', icon: 'czk' },
  { ticker: 'DKK', icon: 'dkk' },
  { ticker: 'GBP', icon: 'gbp' },
  { ticker: 'HKD', icon: 'hkd' },
  { ticker: 'HUF', icon: 'huf' },
  { ticker: 'IDR', icon: 'idr' },
  { ticker: 'ILS', icon: 'ils' },
  { ticker: 'INR', icon: 'inr' },
  { ticker: 'JPY', icon: 'jpy' },
  { ticker: 'MXN', icon: 'mxn' },
  { ticker: 'MYR', icon: 'myr' },
  { ticker: 'NOK', icon: 'nok' },
  { ticker: 'NZD', icon: 'nzd' },
  { ticker: 'KRW', icon: 'krw' },
  { ticker: 'PHP', icon: 'php' },
  { ticker: 'PKR', icon: 'pkr' },
  { ticker: 'PLN', icon: 'pln' },
  { ticker: 'RUB', icon: 'rub' },
  { ticker: 'SEK', icon: 'sek' },
  { ticker: 'SGD', icon: 'sgd' },
  { ticker: 'THB', icon: 'thb' },
  { ticker: 'TRY', icon: 'try' },
  { ticker: 'TWD', icon: 'twd' },
  { ticker: 'ZAR', icon: 'zar' },
];

export interface ExchangeRateContextValue {
  selectedCurrency: string;
  currencyRate: number;
  updateExchangeRate: any;
  status: string;
  hideFiat: boolean;
  HIDE_CURRENCY: string;
  updateCurrencyTicker: any;
}

export const ExchangeRateContext = createContext<
  ExchangeRateContextValue | undefined
>(undefined);
