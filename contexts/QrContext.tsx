import {createContext} from 'react';

export interface QrContextValue {
  show: () => void;
  hide: () => void;
  to: string;
}

export const QrContext = createContext<QrContextValue | undefined>(undefined);
