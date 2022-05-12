import {createContext} from 'react';

export interface ModalContextValue {
  getRef: ((props: {children: Element | string}) => Element) | null;
  openModal: (newChildren: Element | string) => void;
  closeModal: () => void;
  isVisible: boolean;
}

export const ModalContext = createContext<ModalContextValue | undefined>(
  undefined,
);
