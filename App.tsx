/**
 * NavCash - React Native App
 */

import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {patchFlatListProps} from 'react-native-web-refresh-control';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
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
import RNBootSplash from 'react-native-bootsplash';

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

import Toast from 'react-native-toast-message';
import toastConfig from './components/Toast';
import {errorTextParser, promptErrorToaster} from './utils/errors';
import Loading from './components/Loading';
import ModalProvider from './contexts/ModalProvider';
import {useModal} from './hooks/useModal';
import Text from './components/Text';
import {ModalPortal} from 'react-native-modals';
const win = {};

setGlobalVars(win, {win: SQLite});

win.indexedDB.__useShim();
const njs = require('navcoin-js');
const P2pPool = require('@aguycalled/bitcore-p2p').Pool;

const App = (props: {theme: string}) => {
  const {theme} = props;
  const [loaded, setLoaded] = useState(false);
  const {setNjs, setP2pPool} = useNjs();
  const {setWin} = useWin();
  const {openModal, closeModal} = useModal();

  const [crashErrorRecords, setCrashErrorRecords] = useAsyncStorage(
    'crashErrorRecords',
    '',
  );

  const [shownWelcome, setShownWelcome] = useState('false');

  const previousNativeErrorHandler = (errorMessage: string) => {
    setCrashErrorRecords('');
    promptErrorToaster(errorMessage, true, true, () => {
      const errorMsg = errorTextParser(errorMessage, true);
      openModal('error', errorMsg);
    });
  };

  const checkIfAppHadCrashed = async () => {
    if (!crashErrorRecords.length) {
      return;
    }
    previousNativeErrorHandler(crashErrorRecords);
  };

  const JSLeveErrorPrompt = (error: Error | string, isFatal: boolean) => {
    promptErrorToaster(error, isFatal, false, () => {
      const errorMsg = errorTextParser(error, isFatal);
      console.log('before openingModal');
      openModal('error', errorMsg);
    });
  };
  setJSExceptionHandler(JSLeveErrorPrompt, true);

  setNativeExceptionHandler(async errorString => {
    console.log('setNativeExceptionHandler');
    console.log(errorString);
    await AsyncStorage.setItem('crashErrorRecords', errorString);
  });

  useEffect(() => {
    AsyncStorage.getItem('shownWelcome').then(itemValue => {
      if (itemValue == 'true' || itemValue == 'false') {
        setShownWelcome(itemValue);
      }
    });
    setTimeout(() => {
      promptErrorToaster('asd', false, false);
    }, 1000);
  }, []);

  useEffect(() => {
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
    <WalletProvider>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        translucent={true}
        backgroundColor={'#00000000'}
      />
      <AppContainer loaded={loaded} shownWelcome={shownWelcome} />
      <Toast config={toastConfig} />
    </WalletProvider>
  );
};

const AppWrapper = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');

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
  }, []);
  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <IconRegistry icons={[AssetIconsPack, EvaIconsPack]} />
        <ApplicationProvider
          {...eva}
          theme={
            theme === 'light'
              ? {...eva.light, ...customTheme, ...lightTheme}
              : {...eva.dark, ...customTheme, ...darkTheme}
          }
          /* @ts-ignore */
          customMapping={customMapping}>
          <ModalProvider>
            <App theme={theme} />
            {/* <ErrorModal errorText="asdads" /> */}
          </ModalProvider>
          <ModalPortal />
        </ApplicationProvider>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
};

export default AppWrapper;
