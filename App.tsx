/**
 * NavCash - React Native App
 */

import React, {useEffect, useRef, useState} from 'react';
import {AppState, StatusBar} from 'react-native';
import {patchFlatListProps} from 'react-native-web-refresh-control';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ThemeContext from './ThemeContext';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import AssetIconsPack from './assets/AssetIconsPack';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {default as darkTheme} from './constants/theme/dark.json';
import {default as lightTheme} from './constants/theme/light.json';
import {default as customTheme} from './constants/theme/appTheme.json';
import {default as customMapping} from './constants/theme/mapping.json';
import AppContainer from './navigation/AppContainer';
import SplashScreen from 'react-native-splash-screen';
import {ToastProvider} from 'react-native-toast-notifications';

patchFlatListProps();

import SQLite from 'react-native-sqlite-2';

import setGlobalVars from 'indexeddbshim/dist/indexeddbshim-noninvasive';
import useNjs from './hooks/useNjs';
import useWin from './hooks/useWin';
import useLockedScreen from './hooks/useLockedScreen';
import useAsyncStorage from './hooks/useAsyncStorage';
import LocalAuth from './utils/LocalAuth';
import useWallet from './hooks/useWallet';
import WalletProvider from './contexts/WalletProvider';
const win = {};

setGlobalVars(win, {win: SQLite});

win.indexedDB.__useShim();
const njs = require('navcoin-js');
const P2pPool = require('@aguycalled/bitcore-p2p').Pool;

const App = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');
  const [loaded, setLoaded] = useState(false);
  const {setNjs, setP2pPool} = useNjs();
  const {setWin} = useWin();
  const {lockedScreen, setLockedScreen} = useLockedScreen();
  const [shownWelcome, setShownWelcome] = useState('false');
  const [lockAfterBackground, setLockAfterBackground] = useAsyncStorage(
    'lockAfterBackground',
    'false',
  );

  useEffect(() => {
    AsyncStorage.getItem('shownWelcome').then(itemValue => {
      if (itemValue == 'true' || itemValue == 'false') {
        setShownWelcome(itemValue);
      }
    });
  }, []);

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
      if (lockAfterBackground === 'true') {
        if (appState.current.match(/background/) && nextAppState === 'active') {
          setLockedScreen(true);
        }
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [lockAfterBackground]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    AsyncStorage.setItem('theme', nextTheme).then(() => {
      setTheme(nextTheme);
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('theme').then(value => {
      if (value === 'light' || value === 'dark') setTheme(value);
    });
    njs.wallet.Init().then(async () => {
      setNjs(njs);
      setWin(win);
      setP2pPool(
        new P2pPool({
          dnsSeed: false, // prevent seeding with DNS discovered known peers upon connecting
          listenAddr: true, // prevent new peers being added from addr messages
          addrs: [
            // initial peers to connect to
            {
              ip: {
                v4: 'electrum.nav.community',
              },
            },
            {
              ip: {
                v4: 'electrum2.nav.community',
              },
            },
            {
              ip: {
                v4: 'electrum3.nav.community',
              },
            },
            {
              ip: {
                v4: 'electrum4.nav.community',
              },
            },
          ],
        }),
      );

      njs.wallet.WalletFile.SetBackend(win.indexedDB, win.IDBKeyRange);
      setLoaded(true);

      SplashScreen.hide();
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <IconRegistry icons={[AssetIconsPack, EvaIconsPack]} />
        <ToastProvider offset={50} style={{borderRadius: 20, opacity: 0.8}}>
          <WalletProvider>
            <ApplicationProvider
              {...eva}
              theme={
                theme === 'light'
                  ? {...eva.light, ...customTheme, ...lightTheme}
                  : {...eva.dark, ...customTheme, ...darkTheme}
              }
              /* @ts-ignore */
              customMapping={customMapping}>
              <SafeAreaProvider>
                <StatusBar
                  barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
                  translucent={true}
                  backgroundColor={'#00000000'}
                />
                <AppContainer loaded={loaded} shownWelcome={shownWelcome} />
              </SafeAreaProvider>
            </ApplicationProvider>
          </WalletProvider>
        </ToastProvider>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
};

export default App;
