import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleService, useStyleSheet} from '@tsejerome/ui-kitten-components';
import {ModalContextValue, ModalContext} from './ModalContext';
import Modal from '../components/Modal';

interface ModalProviderProp {
  initChildren: Element | string;
  visible: boolean;
}

export const ModalProvider = (props: any) => {
  const ModalRef = useRef<typeof Modal>(null);
  const [visible, setVisibility] = useState(false);
  const [children, setChildren] = useState<Element>();

  const {initChildren} = props;

  const modalContext: ModalContextValue = useMemo(
    () => ({
      getRef: ModalRef?.current,
      openModal: (newChildren: Element) => {
        console.log('openingModal');
        setVisibility(true);
        setChildren(newChildren);
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
      {props.children}
      {visible ? <Modal>{children}</Modal> : initChildren}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
