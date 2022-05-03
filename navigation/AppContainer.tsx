import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import createStackNavigator from './createStackNavigator';
import {RootStackParamList} from './type';
import {AppState, View} from 'react-native';
import Intro from './Intro';
import CreateNewWallet from './CreateNewWallet';
import LoadingModalContent from '../components/LoadingModalContent';
import OnBoarding from '../screens/OnBoarding';
import Wallet from '../screens/Wallet';
import OpenWallet from './OpenWallet';
import ImportWallet from './ImportWallet';
import AskPinScreen from '../screens/wallet/AskPinScreen';
import SecurityProvider from '../contexts/SecurityProvider';
import useLockedScreen from '../hooks/useLockedScreen';
import useAsyncStorage from '../hooks/useAsyncStorage';
import useWallet from '../hooks/useWallet';
import {useEffect, useRef, useState} from 'react';
import LocalAuth from '../utils/LocalAuth';
import {BlurView} from 'expo';
import {useModal} from '../hooks/useModal';

const Stack = createStackNavigator<RootStackParamList>();

const AppContainer = (props: any) => {
  return props.loaded && props.shownWelcome !== null ? (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={
          props.shownWelcome == 'true' ? 'Intro' : 'OnBoarding'
        }>
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="AskPinScreen" component={AskPinScreen} />
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
    <View />
  );
};
export default AppContainer;
