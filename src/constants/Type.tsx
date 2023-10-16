import { ImageRequireSource } from 'react-native';

export enum Category_Types_Enum {
  Incoming = 'incoming',
  Outgoing = 'outgoing',
}

export enum Balance_Types_Enum {
  Nav = 'nav',
  xNav = 'xnav',
  Staking = 'cold_staking',
  PrivateToken = 'token',
  Nft = 'nft',
  Fiat = 'fiat',
}

export enum Destination_Types_Enum {
  PublicWallet = 'My public account',
  PrivateWallet = 'My private account',
  StakingWallet = 'My staking account',
  Address = 'Navcoin address',
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
  spendable_amount: number;
  type_id: Balance_Types_Enum;
  destination_id: Destination_Types_Enum;
  currency: string;
  address?: string;
  items?: any;
  tokenId?: string;
  nftId?: number;
  mine?: boolean;
  supply?: number;
}

export interface NftItem {
  id: string;
  attributes: {
    content_type: string;
    thumbnail_url: string;
  };
  description: string;
  external_url: string;
  image: string;
  name: string;
  version: number;
}

export enum View_Types_Enum {
  Full = 'full',
  Left = 'left',
  Right = 'right',
  Middle = 'middle',
  Half = 'Half',
}

export enum Connection_Stats_Enum {
  Connecting = 'Connecting',
  Connected = 'Connected',
  Syncing = 'Syncing',
  Synced = 'Synced',
  Disconnected = 'Disconnected',
  NoServers = 'No servers',
  Bootstrapping = 'Bootstrapping',
}

export enum Connection_Stats_Text {
  Connecting = 'Connecting to the network...',
  Connected = '',
  Syncing = 'Synchronizing wallet...',
  Synced = '',
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

export type NetworkOption = 'testnet' | 'mainnet';
export interface ServerOption {
  host?: string;
  port?: number;
  proto?: 'tcp' | 'ssl' | 'ws' | 'wss';
  type?: 'testnet' | 'mainnet';
}

export interface NodeOption {
  name?: string;
  address?: string;
}

export interface CollectionOption {
  name?: string;
  description?: string;
  amount?: number;
}

export interface NftItemOption {
  name?: string;
  resource?: string;
}
