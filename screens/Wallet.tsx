import * as React from 'react';
import createStackNavigator from '../navigation/createStackNavigator';
import {WalletParamList} from '../navigation/type';
import Address from './wallet/Address';
import SendTo from './wallet/SendTo';
import Main from '../screens/wallet/Main';
import History from './wallet/History';
import ViewTx from './wallet/ViewTx';

const Stack = createStackNavigator<WalletParamList>();

const Wallet = ({navigation}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'Main'}>
      <Stack.Screen
        name="Main"
        component={Main}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen name="SendTo" component={SendTo} />
      <Stack.Screen name="Address" component={Address} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="ViewTx" component={ViewTx} />
    </Stack.Navigator>
  );
};
export default Wallet;
