import { useContext } from 'react';
import { QrContext } from '@contexts';

export const useQr = () => {
  const context = useContext(QrContext);
  if (context === undefined) {
    throw new Error('useQr must be used within a QrContext');
  }
  return context;
};
