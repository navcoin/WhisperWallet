import {createContext} from 'react';

export interface ModalContextValue {
  getRef: ((props: any) => Element) | null;
  setVisibility: (props: boolean) => void;
}

export const ModalContext = createContext<ModalContextValue | undefined>(
  undefined,
);
