/**
 * NavCash - React Native App
 */

import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, View } from 'react-native';
import { patchFlatListProps } from 'react-native-web-refresh-control';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ThemeContext from '../ThemeContext';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AssetIconsPack } from '@assets';
import {
  ApplicationProvider,
  IconRegistry,
} from '@tsejerome/ui-kitten-components';
import { darkTheme, lightTheme, customTheme } from '@constants';
import AppContainer from './navigation/AppContainer';
import { QueryClient, QueryClientProvider } from 'react-query';

patchFlatListProps();
import {
  ExchangeRateProvider,
  WalletProvider,
  SecurityProvider,
  ModalProvider,
} from '@contexts';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import Toast from 'react-native-toast-message';
import {
  errorTextParser,
  promptErrorToaster,
  saveGlobalErrorRecord,
  saveTemporaryErrorRecord,
  AsyncStoredItems,
} from '@utils';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useModal, useTraceUpdates } from '@hooks';
import { toastConfig, ErrorModalContent } from '@components';

const App = (props: { theme: string }) => {
  const { theme } = props;
  const { openModal, closeModal } = useModal();

  const [promptPreviousError, setPromptPreviousError] = useState(false);

  const [temporaryErrorRecords, setTemporaryErrorRecords] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(AsyncStoredItems.PROMPT_ERROR_ON_NEXT_LAUNCH).then(
      val => {
        if (val !== null) {
          setPromptPreviousError(val === 'true' ? true : false);
        }
      },
    );
    AsyncStorage.getItem(AsyncStoredItems.TEMP_ERROR_RECORDS).then(val => {
      if (val !== null) {
        setTemporaryErrorRecords(val);
      }
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

  const JSLevelErrorPrompt = useCallback(
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
    setJSExceptionHandler(JSLevelErrorPrompt, true);

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
    JSLevelErrorPrompt,
    promptPreviousError,
    setPromptPreviousError,
    temporaryErrorRecords,
    setTemporaryErrorRecords,
  });

  return (
    <WalletProvider>
      <ExchangeRateProvider>
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
            <View
              style={{ flex: 1, backgroundColor: theme['color-basic-700'] }}>
              <AppContainer shownWelcome={shownWelcome} />
            </View>
          </SecurityProvider>
        </NavigationContainer>

        <Toast config={toastConfig} />
      </ExchangeRateProvider>
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

  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <IconRegistry icons={[AssetIconsPack, EvaIconsPack]} />
          <QueryClientProvider client={queryClient}>
            <ApplicationProvider
              {...eva}
              theme={
                theme === 'light'
                  ? { ...eva.light, ...customTheme, ...lightTheme }
                  : { ...eva.dark, ...customTheme, ...darkTheme }
              }>
              <ModalProvider>
                <App theme={theme} />
              </ModalProvider>
            </ApplicationProvider>
          </QueryClientProvider>
        </ThemeContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default AppWrapper;
