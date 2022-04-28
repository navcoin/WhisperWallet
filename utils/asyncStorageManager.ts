import AsyncStorage from "@react-native-async-storage/async-storage";

export enum AsyncStoredItems {
  GLOBAL_ERROR_RECORDS = 'global_error_records',
  TEMP_ERROR_RECORDS = 'temporary_error_records',
}

export const getAsyncStorage = async (key: AsyncStoredItems) => {
  const v = await AsyncStorage.getItem(key);
  if (v) return JSON.parse(v)
  return undefined;
}

export const setAsyncStorage = async (key: AsyncStoredItems, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
  return true;
}

export const removeAsyncStorage = async (key: AsyncStoredItems) => {
  await AsyncStorage.removeItem(key);
  return true;
} 