import React, { useMemo, useRef, useState } from 'react';
import { ModalContextValue, ModalContext } from './ModalContext';
import Modal from '../components/Modals/BaseModal';
import Toast from 'react-native-toast-message';

export const ModalProvider = (props: any) => {
  const ModalRef = useRef<typeof Modal>(null);
  const [visible, setVisibility] = useState(false);
  const [children, setChildren] = useState<Element>();

  const modalContext: ModalContextValue = useMemo(
    () => ({
      getRef: ModalRef?.current,
      openModal: (newChildren: Element) => {
        setVisibility(true);
        setChildren(newChildren);
      },
      closeModal: () => {
        Toast.hide();
        setVisibility(false);
        setChildren(undefined);
      },
      isVisible: visible,
    }),
    [ModalRef, visible],
  );

  return (
    <ModalContext.Provider value={modalContext}>
      {props.children}
      <Modal>{children}</Modal>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
