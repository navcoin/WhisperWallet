import {
  NavigationProp,
  NavigatorScreenParams,
  RouteProp,
} from '@react-navigation/native';
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

export type RootStackParamList = {
  Intro: undefined;
  CreateNewWallet: undefined;
  OnBoarding: undefined;
  OpenWallet: undefined;
  ImportWallet: undefined;
  Wallet: NavigatorScreenParams<WalletParamList>;
};

export type MnemonicScreenProps = undefined;
export type AddressScreenProps = {
  from: string;
};
export type ViewTxScreenProps = {
  item: any;
};
export type AddServerScreenProps = {
  addServer: (newServer: ServerOption, cb: () => void) => void;
};

export type WalletParamList = {
  MainWalletScreen: undefined;
  SendToScreen: undefined;
  AddressScreen: AddressScreenProps;
  HistoryScreen: undefined;
  ViewTxScreen: ViewTxScreenProps;
  SettingsScreen: undefined;
  MnemonicScreen: MnemonicScreenProps;
  ServersScreen: undefined;
  AddServerScreen: AddServerScreenProps;
};
