import {createContext} from 'react';

export interface ModalContextValue {
  getRef: ((props: {children: Element | string}) => Element) | null;
  openModal: (type: string, newChildren: Element | string) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextValue | undefined>(
  undefined,
);
