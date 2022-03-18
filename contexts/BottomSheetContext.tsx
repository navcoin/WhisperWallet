import {createContext} from 'react';

export interface BottomSheetContextValue {
  expand: (content: any) => void;
  getRef: () => void;
  collapse: () => void;
}

export const BottomSheetContext = createContext<
  BottomSheetContextValue | undefined
>(undefined);
