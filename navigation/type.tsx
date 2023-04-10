import {NavigationProp, RouteProp} from '@react-navigation/native';
import {ServerOption} from '../constants/Type';

type AllParamList = WalletParamList & RootStackParamList;

type ScreenNavigationProp<T extends keyof AllParamList> = NavigationProp<
  AllParamList,
  T
>;

type ScreenRouteProp<T extends keyof AllParamList> = RouteProp<AllParamList, T>;

export type ScreenProps<T extends keyof AllParamList> = {
  route: ScreenRouteProp<T>;
  navigation: ScreenNavigationProp<T>;
};

export type AskPinScreenProps = {
  setManualPin: any;
  askManualPin: any;
  pinLength: number;
};
export type RootAppStackParamList = {
  App: undefined;
  OnBoarding: undefined;
};
export type RootStackParamList = {
  Intro: undefined;
  CreateNewWallet: undefined;
  OpenWallet: undefined;
  ImportWallet: undefined;
  AskPinScreen: AskPinScreenProps;
  MainWalletScreen: undefined;
  SendToScreen: undefined;
  AddressScreen: AddressScreenProps;
  HistoryScreen: undefined;
  ViewTxScreen: ViewTxScreenProps;
  SettingsScreen: undefined;
  MnemonicScreen: MnemonicScreenProps;
  ServersScreen: undefined;
  StakingNodeScreen: undefined;
  AddServerScreen: AddServerScreenProps;
  AddStakingNodeScreen: undefined;
  ErrorLogsScreen: undefined;
  CreateNftCollectionScreen: undefined;
  CollectionScreen: undefined;
  MintNftScreen: undefined;
  ScanQRScreen: undefined;
  DisplayCurrencyScreen: undefined;
};

export type MnemonicScreenProps = {mnemonic: string};
export type AddressScreenProps = {
  from: string;
};
export type ViewTxScreenProps = {
  item: any;
};
export type AddServerScreenProps = {
  addServer: (newServer: ServerOption, cb: () => void) => void;
};

export type WalletParamList = {};
