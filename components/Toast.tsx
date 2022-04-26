import {useTheme} from '@tsejerome/ui-kitten-components';
import React from 'react';
import {BaseToast, BaseToastProps} from 'react-native-toast-message';

enum ToastType {
  'success' = 'success',
  'error' = 'error',
  'info' = 'info',
}

interface ToastWrapperProps extends BaseToastProps {
  type: ToastType;
}

const ToastWrapper = ({type, ...props}: ToastWrapperProps) => {
  const theme = useTheme();
  const bgColor = theme['color-basic-800'];
  const textColor = theme['color-basic-100'];

  const borderLeftColor =
    type === ToastType.success
      ? '#69C779'
      : type === ToastType.error
      ? '#FE6301'
      : '#87CEFA';

  return (
    <BaseToast
      {...props}
      style={{
        marginTop: 20,
        backgroundColor: bgColor,
        borderLeftColor: borderLeftColor,
        borderLeftWidth: 8,
      }}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
      text1Style={{
        color: textColor,
      }}
      text2Style={{
        color: textColor,
      }}
    />
  );
};

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: BaseToastProps) => (
    <ToastWrapper type={ToastType.success} {...props} />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
    */
  error: (props: BaseToastProps) => (
    <ToastWrapper type={ToastType.error} {...props} />
  ),
  info: (props: BaseToastProps) => (
    <ToastWrapper type={ToastType.info} {...props} />
  ),
};

export default toastConfig;
