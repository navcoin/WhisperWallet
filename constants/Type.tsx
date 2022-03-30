import {ImageRequireSource} from 'react-native';

export enum Category_Types_Enum {
  Incoming = 'incoming',
  Outgoing = 'outgoing',
}

export enum Balance_Types_Enum {
  Nav = 'nav',
  xNav = 'xnav',
  Staking = 'staking',
  PrivateToken = 'token',
  Nft = 'nft',
}

export enum Destination_Types_Enum {
  PublicWallet = 'My Public Wallet',
  PrivateWallet = 'My Private Wallet',
  StakingWallet = 'My Staking Wallet',
  Address = 'Navcoin Address',
}

export interface AddressFragment {
  type_id: Destination_Types_Enum;
  address: string;
  stakingAddress?: string;
  used: boolean;
}

export interface BalanceFragment {
  name: string;
  amount: number;
  pending_amount: number;
  type_id: Balance_Types_Enum;
  destination_id: Destination_Types_Enum;
  currency: string;
  tokenId?: string;
  nftId?: number;
}

export enum View_Types_Enum {
  Full = 'full',
  Left = 'left',
  Right = 'right',
  Middle = 'middle',
  Half = 'Half',
}

export enum Connection_Stats_Enum {
  Connecting = 'connecting',
  Connected = 'connected',
  Syncing = 'syncing',
  Disconnected = 'disconnected',
  NoServers = 'noservers',
}

export enum Connection_Stats_Text {
  Connecting = 'Connecting to wallet...',
  Connected = '',
  Syncing = 'Synchronizing wallet...',
  Disconnected = 'Wallet is disconnected.',
  NoServers = 'No servers found! Please contact our administrator through discord.',
}

export enum Animation_Types_Enum {
  SlideTop,
  SlideBottom,
  SlideInRight,
  SlideInLeft,
}

export const WalletTypes = [
  ['navcoin-js-v1', 'Whisper Wallet'],
  ['navcash', 'NavCash Electrum'],
  ['navcoin-core', 'Navcoin Core'],
  ['next', 'Next Wallet'],
  ['navpay', 'NavPay'],
];

export const NetworkTypes = [
  ['mainnet', 'Mainnet'],
  ['testnet', 'Testnet'],
];

export interface ImageFragment {
  path?: ImageRequireSource;
}

export interface CategoryFragment {
  id?: string;
  name?: string;
  color?: string;
  emoji?: string;
  description?: string;
  icon?: ImageFragment;
  type?: {
    id?: Category_Types_Enum;
  };
}

export interface TransactionFragment {
  id?: string;
  name?: string;
  amount?: number;
  note?: string;
  type_id?: Category_Types_Enum;
  category?: CategoryFragment;
  transaction_at?: number;
}
