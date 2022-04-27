import Modal from '../components/Modal';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleService, useStyleSheet} from '@tsejerome/ui-kitten-components';
import {ModalContextValue, ModalContext} from './ModalContext';
import Text from '../components/Text';
import {View, Modal as RawModal} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Toast from 'react-native-toast-message';
import toastConfig from '../components/Toast';

export const ModalProvider = (props: any) => {
  const ModalRef = useRef<typeof Modal>(null);
  const [visibile, setVisibility] = useState(false);

  const styles = useStyleSheet(themedStyles);
  const {children, visible} = props;

  useEffect(() => {
    // if (content) {
    //   ModalRef.current?.expand();
    // } else {
    //   ModalRef.current?.collapse();
    // }
  }, []);

  const modalContext: ModalContextValue = useMemo(
    () => ({
      getRef: ModalRef?.current,
      setVisibility: b => {
        setVisibility(b);
      },
    }),
    [ModalRef],
  );

  return (
    <ModalContext.Provider value={modalContext}>
      <View style={{width: 100, height: 100}}></View>
      {props.childern}
      {false && props.children && (
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
            <Toast config={toastConfig} />
            <View style={styles.contentContainer}>
              {!!children ? children : <></>}
            </View>
          </BlurView>
        </RawModal>
      )}
      {/* <Modal visible={visibile}>{props.children}</Modal> */}
    </ModalContext.Provider>
  );
};

export default ModalProvider;

const themedStyles = StyleService.create({
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
