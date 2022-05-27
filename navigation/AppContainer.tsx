import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useTheme} from '@tsejerome/ui-kitten-components';
import createStackNavigator from './createStackNavigator';
import {RootAppStackParamList, RootStackParamList} from './type';
import {BackHandler, View} from 'react-native';
import Intro from './Intro';
import CreateNewWallet from './CreateNewWallet';
import OnBoarding from '../screens/OnBoarding';
import OpenWallet from './OpenWallet';
import ImportWallet from './ImportWallet';
import AskPinScreen from '../screens/wallet/AskPinScreen';
import SecurityProvider from '../contexts/SecurityProvider';
import Toast from 'react-native-toast-message';
import useWallet from '../hooks/useWallet';
import AddressScreen from '../screens/wallet/AddressScreen';
import AddServerScreen from '../screens/wallet/AddServerScreen';
import AddStakingNodeScreen from '../screens/wallet/AddStakingNodeScreen';
import ErrorLogsScreen from '../screens/wallet/ErrorLogsScreen';
import HistoryScreen from '../screens/wallet/HistoryScreen';
import MainWalletScreen from '../screens/wallet/MainWalletScreen';
import MnemonicScreen from '../screens/wallet/MnemonicScreen';
import SendToScreen from '../screens/wallet/SendToScreen';
import ServersScreen from '../screens/wallet/ServersScreen';
import SettingsScreen from '../screens/wallet/SettingsScreen';
import StakingNodeScreen from '../screens/wallet/StakingNodeScreen';
import ViewTxScreen from '../screens/wallet/ViewTxScreen';
import BottomSheetProvider from '../contexts/BottomSheetProvider';
import CreateNftCollectionScreen from '../screens/wallet/CreateNftCollectionScreen';
import CollectionScreen from '../screens/wallet/CollectionScreen';

const Stack = createStackNavigator<RootStackParamList>();
const StackApp = createStackNavigator<RootAppStackParamList>();

const blurProps = {
  listeners: ({navigation}) => ({
    blur: () => navigation.setParams({screen: undefined}),
  }),
};

const AppContent = (props: any) => {
  const _handleBackButtonClick = React.useCallback(() => true, []);
  const _onBlur = React.useCallback(() => {
    /*BackHandler.removeEventListener(
      'hardwareBackPress',
      _handleBackButtonClick,
    );*/
  }, []);

  const _onFocus = React.useCallback(() => {
    //BackHandler.addEventListener('hardwareBackPress', _handleBackButtonClick);
  }, []);

  return (
    <BottomSheetProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={'Intro'}>
        <Stack.Screen {...blurProps} name="Intro" component={Intro} />
        <Stack.Screen
          {...blurProps}
          name="AskPinScreen"
          component={AskPinScreen}
        />
        <Stack.Screen
          {...blurProps}
          name="CreateNewWallet"
          component={CreateNewWallet}
        />
        <Stack.Screen {...blurProps} name="OpenWallet" component={OpenWallet} />
        <Stack.Screen
          {...blurProps}
          name="ImportWallet"
          component={ImportWallet}
        />
        <Stack.Screen
          name={'MainWalletScreen'}
          component={MainWalletScreen}
          listeners={{
            blur: _onBlur,
            focus: _onFocus,
          }}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          {...blurProps}
          name={'SendToScreen'}
          component={SendToScreen}
        />
        <Stack.Screen
          {...blurProps}
          name={'AddressScreen'}
          component={AddressScreen}
        />
        <Stack.Screen
          {...blurProps}
          name={'HistoryScreen'}
          component={HistoryScreen}
        />
        <Stack.Screen
          {...blurProps}
          name={'ViewTxScreen'}
          component={ViewTxScreen}
        />
        <Stack.Screen
          {...blurProps}
          name={'SettingsScreen'}
          component={SettingsScreen}
        />
        <Stack.Screen
          {...blurProps}
          name={'MnemonicScreen'}
          component={MnemonicScreen}
        />
        <Stack.Screen
          {...blurProps}
          name={'StakingNodeScreen'}
          component={StakingNodeScreen}
        />
        <Stack.Screen
          {...blurProps}
          name={'ServersScreen'}
          component={ServersScreen}
        />
        <Stack.Screen
          {...blurProps}
          name={'AddServerScreen'}
          component={AddServerScreen}
        />
        <Stack.Screen
          {...blurProps}
          name={'ErrorLogsScreen'}
          component={ErrorLogsScreen}
        />
        <Stack.Screen
          {...blurProps}
          name={'AddStakingNodeScreen'}
          component={AddStakingNodeScreen}
        />
        <Stack.Screen
          {...blurProps}
          name={'CreateNftCollectionScreen'}
          component={CreateNftCollectionScreen}
        />
        <Stack.Screen
          {...blurProps}
          name={'CollectionScreen'}
          component={CollectionScreen}
        />
      </Stack.Navigator>
    </BottomSheetProvider>
  );
};

const AppContainer = (props: any) => {
  const {walletLibLoaded} = useWallet();

  return walletLibLoaded && props.shownWelcome !== null ? (
    <StackApp.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={props.shownWelcome == 'true' ? 'App' : 'OnBoarding'}>
      <StackApp.Screen name="OnBoarding" component={OnBoarding} />
      <StackApp.Screen name="App" component={AppContent}></StackApp.Screen>
    </StackApp.Navigator>
  ) : (
    <View />
  );
};
export default AppContainer;
