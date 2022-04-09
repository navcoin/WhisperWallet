import * as React from 'react';
import createStackNavigator from '../navigation/createStackNavigator';
import {WalletParamList} from '../navigation/type';
import AddressScreen from './wallet/AddressScreen';
import SendToScreen from './wallet/SendToScreen';
import MainWalletScreen from './wallet/MainWalletScreen';
import HistoryScreen from './wallet/HistoryScreen';
import ViewTxScreen from './wallet/ViewTxScreen';
import SettingsScreen from './wallet/SettingsScreen';
import MnemonicScreen from './wallet/MnemonicScreen';
import AddServerScreen from './wallet/AddServerScreen';
import ServersScreen from './wallet/ServersScreen';
import StakingNodeScreen from './wallet/StakingNodeScreen';
import AddStakingNodeScreen from './wallet/AddStakingNodeScreen';

const Stack = createStackNavigator<WalletParamList>();

const Wallet = ({navigation}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'MainWalletScreen'}>
      <Stack.Screen
        name={'MainWalletScreen'}
        component={MainWalletScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen name={'SendToScreen'} component={SendToScreen} />
      <Stack.Screen name={'AddressScreen'} component={AddressScreen} />
      <Stack.Screen name={'HistoryScreen'} component={HistoryScreen} />
      <Stack.Screen name={'ViewTxScreen'} component={ViewTxScreen} />
      <Stack.Screen name={'SettingsScreen'} component={SettingsScreen} />
      <Stack.Screen name={'MnemonicScreen'} component={MnemonicScreen} />
      <Stack.Screen name={'StakingNodeScreen'} component={StakingNodeScreen} />
      <Stack.Screen name={'ServersScreen'} component={ServersScreen} />
      <Stack.Screen name={'AddServerScreen'} component={AddServerScreen} />
      <Stack.Screen
        name={'AddStakingNodeScreen'}
        component={AddStakingNodeScreen}
      />
    </Stack.Navigator>
  );
};
export default Wallet;
