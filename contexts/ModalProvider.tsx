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
import {View} from 'react-native';
import Modal from '../components/Modal';
import {BlurView} from '@react-native-community/blur';
import Toast from 'react-native-toast-message';
import toastConfig from '../components/Toast';
import ErrorModal from '../components/ErrorModal';

interface ModalProviderProp {
  initChildren: Element | string;
  visible: boolean;
}

export const ModalProvider = (props: any) => {
  const ModalRef = useRef<typeof Modal>(null);
  const [visible, setVisibility] = useState(false);
  const [children, setChildren] = useState<Element>();

  const styles = useStyleSheet(themedStyles);
  const {initChildren} = props;

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
      openModal: (newChildren: Element | string | null = null) => {
        console.log('openingModal');
        setVisibility(true);
        setChildren(<ErrorModal errorText={newChildren as string} />);
      },
      closeModal: () => {
        setVisibility(false);
        setChildren(undefined);
      },
    }),
    [ModalRef],
  );

  return (
    <ModalContext.Provider value={modalContext}>
      {visible ? <Modal>{children}</Modal> : initChildren}
      {/* <Modal visible={visibile}>{props.children}</Modal> */}
    </ModalContext.Provider>
  );
};

export default ModalProvider;

const themedStyles = StyleService.create({
  contentContainer: {
    backgroundColor: 'red',
    flex: 1,
    paddingTop: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolute: {
    flex: 1,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
