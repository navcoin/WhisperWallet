import { Alert, Clipboard } from "react-native";
import Toast from "react-native-toast-message";
import { sendErrorCrashEmail } from "./sendMail";

const promptErrorToaster = (
  e: Error | string,
  isFatal: boolean,
  isPreviousSession: boolean = false,
  cb?: () => void
) => {
  if (isPreviousSession) {
    Toast.show({
      type: 'error',
      text1:
        'Something went wrong in the previous session. Tap for more details.',
      onPress: () => {
        if (!!cb) {
          cb()
        }
      },
    });
    return;
  }
  Toast.show({
    type: 'error',
    text1: 'Something went wrong. Tap for more details.',
    onPress: () => {
      if (!!cb) {
        cb()
      }
    },
  });
};

const errorTextParser = (e: Error | string, isFatal: boolean) => {
  let errorMsg: string = `The error encountered is as below:
  `;
  if (typeof e === 'string') {
    errorMsg += `${isFatal ? 'Fatal:' : ''} ${e}`;
  }
  if (typeof e === 'object') {
    errorMsg += `${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}`;
  }
  return errorMsg;

};

export { promptErrorToaster, errorTextParser }