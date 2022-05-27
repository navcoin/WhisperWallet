import {createContext} from 'react';
import {
  AddressFragment,
  BalanceFragment,
  Connection_Stats_Enum,
} from '../constants/Type';

export interface WalletContextValue {
  walletName: string;
  mnemonic: string;
  createWallet: any;
  refreshWallet: () => any;
  clearMnemonic: () => any;
  syncProgress: number;
  balances: any;
  connected: Connection_Stats_Enum;
  addresses: any;
  walletsList: string[];
  history: any;
  accounts: BalanceFragment[];
  parsedAddresses: AddressFragment[];
  createTransaction: any;
  createNftCollection: any;
  sendTransaction: (tx: any) => Promise<any>;
  tokens: BalanceFragment[];
  nfts: BalanceFragment[];
  updateAccounts: () => void;
  bootstrapProgress: number;
  firstSyncCompleted: boolean;
  removeWallet: (name: string) => Promise<void>;
  walletLibLoaded: boolean;
  closeWallet: () => void;
  ExecWrapperPromise: any;
  ExecWrapperSyncPromise: any;
  network: string;
  IsValidMnemonic: (mnemonic: string, type: string) => Promise<any>;
}

export const WalletContext = createContext<WalletContextValue | undefined>(
  undefined,
);
