import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import createStackNavigator from './createStackNavigator';
import {RootStackParamList} from './type';
import Text from '../components/Text';
import Intro from './Intro';
import CreateNewWallet from './CreateNewWallet';
import {View} from 'react-native';
import Loading from '../components/Loading';
import OnBoarding from '../screens/OnBoarding';
import Wallet from '../screens/Wallet';
import OpenWallet from './OpenWallet';
import ImportWallet from './ImportWallet';

const Stack = createStackNavigator<RootStackParamList>();

const AppContainer = (props: any) => {
  return props.loaded ? (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={
          props.shownWelcome === 'true' ? 'Intro' : 'OnBoarding'
        }>
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="CreateNewWallet" component={CreateNewWallet} />
        <Stack.Screen name="OpenWallet" component={OpenWallet} />
        <Stack.Screen name="ImportWallet" component={ImportWallet} />
        <Stack.Screen
          name="Wallet"
          component={Wallet}
          options={{gestureEnabled: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <Loading />
  );
};
export default AppContainer;
