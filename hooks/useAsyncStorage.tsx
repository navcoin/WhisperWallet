import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import memoize from 'memoizee';
import {useBetween} from 'use-between';

/*
 * The following hook us built such that we can keep track of AsyncStorage updates within Components
 * Note that we won't be able to use useAsyncStorage in the functions outside of components,
 * If we want to do that we better use the asyncStorageManager.ts
 */

function useAsyncStorageHook(key: string, initialValue: any) {
  const [storedValue, setStoredValue] = useState(initialValue);
  useEffect(() => {
    AsyncStorage.getItem(key)
      .then(value => {
        if (value === null) {
          return initialValue;
        }
        return JSON.parse(value);
      })
      .then(setStoredValue);
  }, [key, storedValue, initialValue]);
  const setValue = (value: any) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    AsyncStorage.setItem(key, JSON.stringify(valueToStore));
  };
  return [storedValue, setValue];
}

/*
const useAsyncStorageMemoized = memoize((key: string, initialValue: any) => {
  // Thanks to the memoization tool, we got all the closure parameters we need.
  return () =>
    // Parameterized shared hook here.
    useAsyncStorageHook(key, initialValue);
});

export default (key: string, initialValue: string) => {
  return useBetween(useAsyncStorageMemoized(key, initialValue));
};
*/

export default (key: string, initialValue: any) => {
  return useAsyncStorageHook(key, initialValue);
};
