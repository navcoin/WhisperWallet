import React from 'react';
import {StyleSheet, View, Modal as RawModal} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Toast from 'react-native-toast-message';
import toastConfig from '../Toast';

const Modal = (props: any) => {
  const {children, visible} = props;
  return (
    <RawModal
      transparent={true}
      statusBarTranslucent={true}
      animationType={'fade'}
      visible={visible}>
      <BlurView
        style={styles.absolute}
        blurType="dark"
        blurAmount={50}
        reducedTransparencyFallbackColor="#1F2933"></BlurView>
      <Toast config={toastConfig} />
      <View style={styles.contentContainer}>{children || <></>}</View>
    </RawModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    padding: 20,
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  absolute: {
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
});

export default Modal;
