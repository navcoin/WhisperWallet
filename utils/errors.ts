import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Clipboard} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  AsyncStoredItems,
  getAsyncStorage,
  removeAsyncStorage,
  setAsyncStorage,
} from './asyncStorageManager';
import {sendErrorCrashEmail} from './sendMail';
import {useModal} from '../hooks/useModal';

const saveGlobalErrorRecord = async (newError: string) => {
  let globalRecords = await getAsyncStorage(
    AsyncStoredItems.GLOBAL_ERROR_RECORDS,
  );
  if (!globalRecords) globalRecords = [];
  const temp = `${new Date().toISOString()} 
  ${newError}`;
  await setAsyncStorage(AsyncStoredItems.GLOBAL_ERROR_RECORDS, [
    temp,
    ...globalRecords,
  ]);
};

const saveTemporaryErrorRecord = async (newError: string) => {
  let tempRecords = await getAsyncStorage(AsyncStoredItems.TEMP_ERROR_RECORDS);
  if (!tempRecords) tempRecords = [];
  const temp = `${new Date().toISOString()} 
  ${newError}`;
  await setAsyncStorage(AsyncStoredItems.TEMP_ERROR_RECORDS, [
    temp,
    ...tempRecords,
  ]);
};

const cleanTemporaryErrorRecord = async () => {
  await removeAsyncStorage(AsyncStoredItems.TEMP_ERROR_RECORDS);
};

const promptErrorToaster = (
  e: Error | string,
  isFatal: boolean,
  isPreviousSession: boolean = false,
  cb?: () => void,
) => {
  if (isPreviousSession) {
    Toast.show({
      type: 'error',
      text1:
        'Something went wrong in the previous session. Tap for more details.',
      autoHide: false,
      onPress: () => {
        if (!!cb) {
          cb();
        }
      },
    });
    return;
  }
  Toast.show({
    type: 'error',
    text1: 'Something went wrong. Tap for more details.',
    autoHide: false,
    onPress: () => {
      if (!!cb) {
        cb();
      }
    },
  });
};

/*
 * Change an Error object to a single string
 */
const errorTextParser = (e: Error | string, isFatal: boolean) => {
  let errorMsg: string = ``;
  if (typeof e === 'string') {
    errorMsg += `${isFatal ? 'Fatal:' : ''} ${e}`;
  }
  if (typeof e === 'object') {
    errorMsg += `${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}`;
  }
  return errorMsg;
};

/*
 * Parsing an array of error string into one single string
 */
const errorGroupParser = (errors: string[]) => {
  let result = ``;
  errors.map((err, index) => {
    result += `${err}`;
    if (index < errors.length - 1) {
      result += `\n\n\n`;
    }
  });
  return result;
};

export {
  promptErrorToaster,
  errorTextParser,
  errorGroupParser,
  cleanTemporaryErrorRecord,
  saveTemporaryErrorRecord,
  saveGlobalErrorRecord,
};
