import React from 'react';
import {StyleSheet, View, Modal as RawModal} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Toast from 'react-native-toast-message';
import toastConfig from './Toast';

const Modal = (props: any) => {
  const {children, visible} = props;
  return (
    <RawModal
      transparent={true}
      statusBarTranslucent={true}
      animationType={'none'}
      visible={visible}>
      <BlurView
        style={styles.absolute}
        blurType="dark"
        blurAmount={10}
        reducedTransparencyFallbackColor="#1f2933">
        <Toast config={toastConfig} />
        <View style={styles.contentContainer}>
          {!!children ? children : <></>}
        </View>
      </BlurView>
    </RawModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingTop: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolute: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Modal;
