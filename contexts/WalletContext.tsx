import {createContext} from 'react';
import {
  AddressFragment,
  BalanceFragment,
  Connection_Stats_Enum,
} from '../constants/Type';

export interface WalletContextValue {
  bitcore: any;
  wallet: any;
  walletName: string;
  mnemonic: string;
  createWallet: any;
  clearMnemonic: () => any;
  syncProgress: number;
  syncing: boolean;
  balances: any;
  connected: Connection_Stats_Enum;
  addresses: any;
  walletsList: string[];
  history: any;
  accounts: BalanceFragment[];
  parsedAddresses: AddressFragment[];
  createTransaction: any;
  sendTransaction: (tx: any) => Promise<any>;
}

export const WalletContext = createContext<WalletContextValue | undefined>(
  undefined,
);
