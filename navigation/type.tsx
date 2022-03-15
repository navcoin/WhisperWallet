import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Intro: undefined;
  CreateNewWallet: undefined;
  OnBoarding: undefined;
  OpenWallet: undefined;
  ImportWallet: undefined;
  Wallet: NavigatorScreenParams<WalletParamList>;
};

export type WalletParamList = {
  Main: undefined;
  SendTo: undefined;
  Address: undefined;
  History: undefined;
  ViewTx: undefined;
};
