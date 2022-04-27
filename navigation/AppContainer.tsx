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
import useLockedScreen from '../hooks/useLockedScreen';
import useAsyncStorage from '../hooks/useAsyncStorage';
import useWallet from '../hooks/useWallet';
import {useEffect, useRef, useState} from 'react';
import LocalAuth from '../utils/LocalAuth';
import {BlurView} from 'expo';
import {useModal} from '../hooks/useModal';

const Stack = createStackNavigator<RootStackParamList>();

const AppContainer = (props: any) => {
  const {lockedScreen, setLockedScreen} = useLockedScreen();
  const {openModal, closeModal} = useModal();
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

  useEffect(() => {
    if (!props.loaded) {
      openModal(<LoadingModalContent loading={true} />);
      return;
    }
    closeModal();
  }, [props.loaded]);

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
    <View />
  );
};
export default AppContainer;
