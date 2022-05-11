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
import {BackHandler, View} from 'react-native';
import {useCallback} from 'react';
import StakingNodeScreen from './wallet/StakingNodeScreen';
import AddStakingNodeScreen from './wallet/AddStakingNodeScreen';
import BottomSheetProvider from '../contexts/BottomSheetProvider';
import ErrorLogsScreen from './wallet/ErrorLogsScreen';
import {useTheme} from '@tsejerome/ui-kitten-components';
import CreateNftCollectionScreen from './wallet/CreateNftCollectionScreen';
import CollectionScreen from './wallet/CollectionScreen';

const Stack = createStackNavigator<WalletParamList>();

const Wallet = ({navigation}) => {
  const _handleBackButtonClick = useCallback(() => true, []);
  const theme = useTheme();
  const _onBlur = useCallback(() => {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      _handleBackButtonClick,
    );
  }, []);

  const _onFocus = useCallback(() => {
    BackHandler.addEventListener('hardwareBackPress', _handleBackButtonClick);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: theme['color-basic-700']}}>
      <BottomSheetProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'MainWalletScreen'}>

          <Stack.Screen
            name={'MainWalletScreen'}
            component={MainWalletScreen}
            listeners={{
              blur: _onBlur,
              focus: _onFocus,
            }}
          />
          <Stack.Screen name={'SendToScreen'} component={SendToScreen}/>
          <Stack.Screen name={'AddressScreen'} component={AddressScreen}/>
          <Stack.Screen name={'HistoryScreen'} component={HistoryScreen}/>
          <Stack.Screen name={'ViewTxScreen'} component={ViewTxScreen}/>
          <Stack.Screen name={'SettingsScreen'} component={SettingsScreen}/>
          <Stack.Screen name={'MnemonicScreen'} component={MnemonicScreen}/>
          <Stack.Screen
            name={'StakingNodeScreen'}
            component={StakingNodeScreen}
          />
          <Stack.Screen name={'ServersScreen'} component={ServersScreen}/>
          <Stack.Screen name={'AddServerScreen'} component={AddServerScreen}/>
          <Stack.Screen name={'ErrorLogsScreen'} component={ErrorLogsScreen}/>
          <Stack.Screen name={'CreateNftCollectionScreen'} component={CreateNftCollectionScreen}/>
          <Stack.Screen name={'CollectionScreen'} component={CollectionScreen}/>
          <Stack.Screen
            name={'AddStakingNodeScreen'}
            component={AddStakingNodeScreen}
          />

        </Stack.Navigator>
      </BottomSheetProvider>
    </View>
  );
};
export default Wallet;
