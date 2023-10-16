import React from 'react';
import { View, Modal as RawModal } from 'react-native';
import Toast from 'react-native-toast-message';
import toastConfig from '../Toast';
import { useModal } from '@hooks';
import { modalStyles as styles } from './styles';

const Modal = (props: any) => {
  const { children, visible } = props;
  const { isVisible } = useModal();
  return isVisible ? (
    <RawModal
      transparent={true}
      statusBarTranslucent={true}
      animationType={'fade'}
      visible={visible}>
      <>
        <View style={[styles.absolute, styles.backgroundColor]} />
        <Toast config={toastConfig} />
        <View style={styles.contentContainer}>{children || <></>}</View>
      </>
    </RawModal>
  ) : (
    <></>
  );
};

export default Modal;
