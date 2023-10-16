import { useContext } from 'react';
import { ModalContext } from '@contexts';

const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalContext');
  }
  return context;
};

export default useModal;
