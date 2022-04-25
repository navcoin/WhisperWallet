/**
 * NavCash - React Native App
 */

import React, {useEffect, useState} from 'react';
import {Alert, StatusBar} from 'react-native';
import {patchFlatListProps} from 'react-native-web-refresh-control';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RNRestart from 'react-native-restart';
import ThemeContext from './ThemeContext';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import AssetIconsPack from './assets/AssetIconsPack';
import {
  ApplicationProvider,
  IconRegistry,
} from '@tsejerome/ui-kitten-components';
import {default as darkTheme} from './constants/theme/dark.json';
import {default as lightTheme} from './constants/theme/light.json';
import {default as customTheme} from './constants/theme/appTheme.json';
import {default as customMapping} from './constants/theme/mapping.json';
import AppContainer from './navigation/AppContainer';
// import SplashScreen from 'react-native-splash-screen';
import RNBootSplash from 'react-native-bootsplash';

import {ToastProvider} from 'react-native-toast-notifications';

patchFlatListProps();

import SQLite from 'react-native-sqlite-2';

import setGlobalVars from 'indexeddbshim/dist/indexeddbshim-noninvasive';
import useNjs from './hooks/useNjs';
import useWin from './hooks/useWin';
import useAsyncStorage from './hooks/useAsyncStorage';
import WalletProvider from './contexts/WalletProvider';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import {sendErrorCrashEmail, sendMessageEmail} from './utils/sendMail';
import Clipboard from '@react-native-community/clipboard';
const win = {};

setGlobalVars(win, {win: SQLite});

win.indexedDB.__useShim();
const njs = require('navcoin-js');
const P2pPool = require('@aguycalled/bitcore-p2p').Pool;

const currentJSErrorHandler = (e: Error | string, isFatal: boolean) => {
  let errorMsg: string = '';
  if (typeof e === 'string') {
    errorMsg = `Error: ${isFatal ? 'Fatal:' : ''} ${e}
    Please close the app and start again!`;
  }
  if (typeof e === 'object') {
    errorMsg = `Error: ${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}
    Please close the app and start again!`;
  }

  Alert.alert('Unexpected error occurred', errorMsg, [
    {
      text: 'Send report via Email',
      onPress: () => {
        sendErrorCrashEmail(e, isFatal);
        RNRestart.Restart();
      },
    },
    {
      text: 'Copy Error',
      onPress: () => {
        Clipboard.setString(errorMsg);
        RNRestart.Restart();
      },
    },
    {
      text: 'Close',
      onPress: () => {
        if (!__DEV__) {
          RNRestart.Restart();
        }
      },
    },
  ]);
};

setJSExceptionHandler(currentJSErrorHandler, true);

setNativeExceptionHandler(async errorString => {
  console.log('setNativeExceptionHandler');
  console.log(errorString);
  await AsyncStorage.setItem('crashErrorRecords', errorString);
});

const App = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');
  const [loaded, setLoaded] = useState(false);
  const {setNjs, setP2pPool} = useNjs();
  const {setWin} = useWin();

  const [crashErrorRecords, setCrashErrorRecords] = useAsyncStorage(
    'crashErrorRecords',
    '',
  );

  const [shownWelcome, setShownWelcome] = useState('false');

  const previousNativeErrorHandler = (errorMessage: string) => {
    Alert.alert(
      'There was an unexpected error occurred in the previous app launch',
      'Do you want to send a report to Whisper Team?',
      [
        {
          text: 'Send Report via Email',
          onPress: () => {
            sendErrorCrashEmail(errorMessage, true);
            setCrashErrorRecords('');
          },
        },
        {
          text: 'Copy Error',
          onPress: () => {
            Clipboard.setString(errorMessage);
            setCrashErrorRecords('');
          },
        },
        {
          text: 'Close',
          onPress: () => {
            setCrashErrorRecords('');
          },
        },
      ],
    );
  };

  const checkIfAppHadCrashed = async () => {
    if (!crashErrorRecords.length) {
      return;
    }
    previousNativeErrorHandler(crashErrorRecords);
  };

  useEffect(() => {
    AsyncStorage.getItem('shownWelcome').then(itemValue => {
      if (itemValue == 'true' || itemValue == 'false') {
        setShownWelcome(itemValue);
      }
    });
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    AsyncStorage.setItem('theme', nextTheme).then(() => {
      setTheme(nextTheme);
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('theme').then(value => {
      if (value === 'light' || value === 'dark') {
        setTheme(value);
      }
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

      setTimeout(() => {
        RNBootSplash.hide({fade: true});
      }, 1000);

      checkIfAppHadCrashed();
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
