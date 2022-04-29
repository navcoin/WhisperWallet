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
import RNBootSplash, {getVisibilityStatus} from 'react-native-bootsplash';

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
import {
  errorTextParser,
  promptErrorToaster,
  saveGlobalErrorRecord,
  saveTemporaryErrorRecord,
} from './utils/errors';
import ModalProvider from './contexts/ModalProvider';
import {useModal} from './hooks/useModal';
import ErrorModalContent from './components/ErrorModalContent';
import {AsyncStoredItems} from './utils/asyncStorageManager';
const win = {};

setGlobalVars(win, {win: SQLite});

win.indexedDB.__useShim();
const njs = require('navcoin-js');
const P2pPool = require('@aguycalled/bitcore-p2p').Pool;

const App = (props: {theme: string}) => {
  const {theme} = props;
  const [walletLoaded, setWalletLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const {setNjs, setP2pPool} = useNjs();
  const {setWin} = useWin();
  const {openModal, closeModal} = useModal();

  const [promptPreviousError, setPromptPreviousError] = useAsyncStorage(
    AsyncStoredItems.PROMPT_ERROR_ON_NEXT_LAUNCH,
    '',
  );
  const [temporaryErrorRecords, setTemporaryErrorRecords] = useAsyncStorage(
    AsyncStoredItems.TEMP_ERROR_RECORDS,
    '',
  );

  const [shownWelcome, setShownWelcome] = useState(null);

  const checkIfAppHadPreviousNativeErrorHandler = async () => {
    if (!promptPreviousError) {
      return;
    }
    setPromptPreviousError(false);
    if (!temporaryErrorRecords.length) return;
    const errorMessage = temporaryErrorRecords[0];
    promptErrorToaster(errorMessage, true, true, () => {
      const errorMsg = errorTextParser(errorMessage, true);
      openModal(<ErrorModalContent errorText={errorMsg}></ErrorModalContent>);
    });
  };

  const JSLeveErrorPrompt = async (error: Error | string, isFatal: boolean) => {
    await saveGlobalErrorRecord(errorTextParser(error, isFatal));
    await saveTemporaryErrorRecord(errorTextParser(error, isFatal));
    promptErrorToaster(error, isFatal, false, () => {
      const errorMsg = errorTextParser(error, isFatal);
      openModal(<ErrorModalContent errorText={errorMsg}></ErrorModalContent>);
    });
  };
  setJSExceptionHandler(JSLeveErrorPrompt, true);

  setNativeExceptionHandler(async errorString => {
    console.log('setNativeExceptionHandler');
    console.log(errorString);
    await saveGlobalErrorRecord(errorTextParser(errorString, true));
    await saveTemporaryErrorRecord(errorTextParser(errorString, true));
    await AsyncStorage.setItem('crashErrorRecords', errorString);
  });
  
  useEffect(() => {
    AsyncStorage.getItem('shownWelcome').then(itemValue => {
      if (itemValue == 'true' || itemValue == 'false') {
        setShownWelcome(itemValue);
      }
    });
  }, []);

  useEffect(() => {
    if (walletLoaded && shownWelcome !== null) {
      setLoaded(true);
      RNBootSplash.hide({fade: true});
    }
  }, [shownWelcome, walletLoaded]);

  useEffect(() => {
    njs.wallet.Init().then(async () => {
      njs.wallet.WalletFile.SetBackend(win.indexedDB, win.IDBKeyRange);

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

      setWalletLoaded(true);

      checkIfAppHadPreviousNativeErrorHandler();
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
          </ModalProvider>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
};

export default AppWrapper;
