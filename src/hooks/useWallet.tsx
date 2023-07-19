import { useContext } from 'react';
import { WalletContext } from '@contexts';

const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletContext');
  }
  return context;
};

export default useWallet;
