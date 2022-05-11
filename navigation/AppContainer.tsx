import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useTheme} from '@tsejerome/ui-kitten-components';
import createStackNavigator from './createStackNavigator';
import {RootStackParamList} from './type';
import {View} from 'react-native';
import Intro from './Intro';
import CreateNewWallet from './CreateNewWallet';
import OnBoarding from '../screens/OnBoarding';
import Wallet from '../screens/Wallet';
import OpenWallet from './OpenWallet';
import ImportWallet from './ImportWallet';
import AskPinScreen from '../screens/wallet/AskPinScreen';
import SecurityProvider from '../contexts/SecurityProvider';
import Toast from 'react-native-toast-message';
import useWallet from '../hooks/useWallet';
import {BottomSheetProvider} from '../contexts/BottomSheetProvider';

const Stack = createStackNavigator<RootStackParamList>();

const AppContainer = (props: any) => {
  const theme = useTheme();
  const {walletLibLoaded} = useWallet();
  return walletLibLoaded && props.shownWelcome !== null ? (
    <View style={{flex: 1, backgroundColor: theme['color-basic-700']}}>
      <NavigationContainer
        onStateChange={() => {
          Toast.hide();
        }}>
        <SecurityProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName={
              props.shownWelcome == 'true' ? 'Intro' : 'OnBoarding'
            }>
            <Stack.Screen name="Intro" component={Intro}/>
            <Stack.Screen name="AskPinScreen" component={AskPinScreen}/>
            <Stack.Screen name="OnBoarding" component={OnBoarding}/>
            <Stack.Screen name="CreateNewWallet" component={CreateNewWallet}/>
            <Stack.Screen name="OpenWallet" component={OpenWallet}/>
            <Stack.Screen name="ImportWallet" component={ImportWallet}/>
            <Stack.Screen
              name="Wallet"
              component={Wallet}
              options={{gestureEnabled: false}}
            />
          </Stack.Navigator>
        </SecurityProvider>
      </NavigationContainer>
    </View>
  ) : (
    <View/>
  );
};
export default AppContainer;
