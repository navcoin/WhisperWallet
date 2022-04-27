import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import createStackNavigator from './createStackNavigator';
import {RootStackParamList} from './type';
import {AppState} from 'react-native';
import Intro from './Intro';
import CreateNewWallet from './CreateNewWallet';
import LoadingModalContent from '../components/LoadingModalContent';
import OnBoarding from '../screens/OnBoarding';
import Wallet from '../screens/Wallet';
import OpenWallet from './OpenWallet';
import ImportWallet from './ImportWallet';
import useLockedScreen from '../hooks/useLockedScreen';
import useAsyncStorage from '../hooks/useAsyncStorage';
import useWallet from '../hooks/useWallet';
import {useEffect, useRef, useState} from 'react';
import LocalAuth from '../utils/LocalAuth';
import {BlurView} from 'expo';

const Stack = createStackNavigator<RootStackParamList>();

const AppContainer = (props: any) => {
  const {lockedScreen, setLockedScreen} = useLockedScreen();
  const [lockAfterBackground, setLockAfterBackground] = useAsyncStorage(
    'lockAfterBackground',
    'false',
  );

  const {refreshWallet} = useWallet();

  const appState = useRef(AppState.currentState);

  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    if (appStateVisible == 'active' && lockedScreen) {
      LocalAuth((error: any) => {
        if (!error) {
          setLockedScreen(false);
        } else {
          setLockedScreen(true);
        }
      });
    }
  }, [appStateVisible]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/background/) && nextAppState === 'active') {
        if (refreshWallet) {
          refreshWallet();
        }
        if (lockAfterBackground === 'true') {
          setLockedScreen(true);
        }
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [refreshWallet, lockAfterBackground, setLockedScreen]);

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
    <LoadingModalContent />
  );
};
export default AppContainer;
