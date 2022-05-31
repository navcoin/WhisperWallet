/**
 * NavCash - React Native App
 */

import React, {useEffect, useState, useCallback} from 'react';
import {StatusBar, View} from 'react-native';
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
import AppContainer from './navigation/AppContainer';

patchFlatListProps();
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
import ErrorModalContent from './components/Modals/ErrorModalContent';
import {AsyncStoredItems} from './utils/asyncStorageManager';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import SecurityProvider from './contexts/SecurityProvider';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import useTraceUpdates from './hooks/useTraceUpdates';

const App = (props: {theme: string}) => {
  const {theme} = props;
  const {openModal, closeModal} = useModal();

  const [promptPreviousError, setPromptPreviousError] = useState(false);

  const [temporaryErrorRecords, setTemporaryErrorRecords] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(AsyncStoredItems.PROMPT_ERROR_ON_NEXT_LAUNCH).then(
      val => {
        if (val !== null) setPromptPreviousError(val === 'true' ? true : false);
      },
    );
    AsyncStorage.getItem(AsyncStoredItems.TEMP_ERROR_RECORDS).then(val => {
      if (val !== null) setTemporaryErrorRecords(val);
    });
  }, []);

  const [shownWelcome, setShownWelcome] = useState(null);

  const checkIfAppHadPreviousNativeErrorHandler = useCallback(async () => {
    if (!promptPreviousError) {
      return;
    }
    AsyncStorage.setItem(AsyncStoredItems.PROMPT_ERROR_ON_NEXT_LAUNCH, 'false');
    setPromptPreviousError(false);
    if (!temporaryErrorRecords.length) {
      return;
    }
    const errorMessage = temporaryErrorRecords[0];
    closeModal();
    promptErrorToaster(errorMessage, true, true, () => {
      const errorMsg = errorTextParser(errorMessage, true);
      openModal(<ErrorModalContent errorText={errorMsg} />);
    });
  }, []);

  const JSLeveErrorPrompt = useCallback(
    async (error: Error | string, isFatal: boolean) => {
      await saveGlobalErrorRecord(errorTextParser(error, isFatal));
      await saveTemporaryErrorRecord(errorTextParser(error, isFatal));
      closeModal();
      promptErrorToaster(error, isFatal, false, () => {
        const errorMsg = errorTextParser(error, isFatal);
        openModal(<ErrorModalContent errorText={errorMsg} />);
      });
    },
    [],
  );

  useEffect(() => {
    AsyncStorage.getItem('shownWelcome').then(itemValue => {
      if (itemValue == 'true' || itemValue == 'false') {
        setShownWelcome(itemValue);
      } else {
        setShownWelcome('false');
      }
    });
  }, []);

  useEffect(() => {
    setJSExceptionHandler(JSLeveErrorPrompt, true);

    setNativeExceptionHandler(async errorString => {
      await saveGlobalErrorRecord(errorTextParser(errorString, true));
      await saveTemporaryErrorRecord(errorTextParser(errorString, true));
      await AsyncStorage.setItem('crashErrorRecords', errorString);
    });

    checkIfAppHadPreviousNativeErrorHandler();
  }, []);

  useTraceUpdates('app', {
    shownWelcome,
    toastConfig,
    DarkTheme,
    theme,
    openModal,
    closeModal,
    setShownWelcome,
    checkIfAppHadPreviousNativeErrorHandler,
    JSLeveErrorPrompt,
    promptPreviousError,
    setPromptPreviousError,
    temporaryErrorRecords,
    setTemporaryErrorRecords,
  });

  return (
    <WalletProvider>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        translucent={true}
        backgroundColor={'#00000000'}
      />
      <NavigationContainer
        theme={DarkTheme}
        onStateChange={() => {
          Toast.hide();
        }}>
        <SecurityProvider>
          <View style={{flex: 1, backgroundColor: theme['color-basic-700']}}>
            <AppContainer shownWelcome={shownWelcome} />
          </View>
        </SecurityProvider>
      </NavigationContainer>

      <Toast config={toastConfig} />
    </WalletProvider>
  );
};

const AppWrapper = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');
  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    AsyncStorage.setItem('theme', nextTheme).then(() => {
      setTheme(nextTheme);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('theme').then(value => {
      if (value === 'light' || value === 'dark') {
        setTheme(value);
      }
    });
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ThemeContext.Provider value={{theme, toggleTheme}}>
          <IconRegistry icons={[AssetIconsPack, EvaIconsPack]} />
          <ApplicationProvider
            {...eva}
            theme={
              theme === 'light'
                ? {...eva.light, ...customTheme, ...lightTheme}
                : {...eva.dark, ...customTheme, ...darkTheme}
            }>
            <ModalProvider>
              <App theme={theme} />
            </ModalProvider>
          </ApplicationProvider>
        </ThemeContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default AppWrapper;
