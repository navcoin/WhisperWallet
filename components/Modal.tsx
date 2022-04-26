import React from 'react';
import {StyleSheet, View, Modal as RawModal} from 'react-native';
import {BlurView} from '@react-native-community/blur';

export enum ModalType {
  'LoadingModal' = 'LoadingModal',
  'InfoModal' = 'InfoModal',
}

interface ModalProps {
  children: JSX.Element;
  visible: boolean;
}

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
        reducedTransparencyFallbackColor="white">
        <View style={styles.contentContainer}>
          {!!children ? children : <></>}
        </View>
      </BlurView>
    </RawModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'background-basic-color-6',
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
