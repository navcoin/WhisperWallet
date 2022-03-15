import {useContext} from 'react';
import {BottomSheetContext} from '../contexts/BottomSheetContext';

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error('useBottomSheet must be used within a BottomSheetContext');
  }
  return context;
};
