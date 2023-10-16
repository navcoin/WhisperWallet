import AsyncStorage from '@react-native-async-storage/async-storage';

export enum AsyncStoredItems {
  GLOBAL_ERROR_RECORDS = 'global_error_records', //string[]
  TEMP_ERROR_RECORDS = 'temporary_error_records', //string[]
  PROMPT_ERROR_ON_NEXT_LAUNCH = 'prompt_error_toasty_on_next_launch', //boolean
  CURRENCY_RECORDS = 'exchange_rate_currency', // string
}

/*
 * The following fns are built such that we can still use Async Storage outside of Components
 * Note that in this way, we won't know about any updates on the async storage value,
 * If we want to do that we better use useAsyncStorage
 */

export const getAsyncStorage = async (key: AsyncStoredItems) => {
  const v = await AsyncStorage.getItem(key);
  if (v) {
    return JSON.parse(v);
  }
  return undefined;
};

export const setAsyncStorage = async (key: AsyncStoredItems, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
  return true;
};

export const removeAsyncStorage = async (key: AsyncStoredItems) => {
  await AsyncStorage.removeItem(key);
  return true;
};
