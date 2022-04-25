import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  SecurityAuthenticationTypes,
  SecurityContext,
  SecurityContextValue,
} from './SecurityContext';
import * as Keychain from 'react-native-keychain';
import * as DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crypto from 'crypto';
import useKeychain from '../utils/Keychain';
import EncryptedStorage from 'react-native-encrypted-storage';
import LocalAuth from '../utils/LocalAuth';
import {Text} from '@tsejerome/ui-kitten-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Container from '../components/Container';
import {scale} from 'react-native-size-matters';
import useLockedScreen from '../hooks/useLockedScreen';
import useAsyncStorage from '../hooks/useAsyncStorage';
import useWallet from '../hooks/useWallet';
import {AppState} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export const SecurityProvider = (props: any) => {
  const {lockedScreen, setLockedScreen} = useLockedScreen();
  const [lockAfterBackground, setLockAfterBackground] = useAsyncStorage(
    'lockAfterBackground',
    'false',
  );
  const {navigate} = useNavigation();

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
      DeviceInfo.isPinOrFingerprintSet().then(setIsPinOrFingerprintSet);
      Keychain.getSupportedBiometryType({}).then(setSupportedBiometry);
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

  const {read} = useKeychain();

  const [isPinOrFingerprintSet, setIsPinOrFingerprintSet] = useState<
    boolean | undefined
  >(undefined);

  const [supportedBiometry, setSupportedBiometry] =
    useState<Keychain.BIOMETRY_TYPE | null>(null);

  useEffect((): void => {
    DeviceInfo.isPinOrFingerprintSet().then(setIsPinOrFingerprintSet);
    Keychain.getSupportedBiometryType({}).then(setSupportedBiometry);
  }, []);

  const [setManualPin, setSetManualPin] = useState<any>(() => {});
  const [askManualPin, setAskManualPin] = useState<any>(() => {});

  const [supportedType, setSupportedType] =
    useState<SecurityAuthenticationTypes>(SecurityAuthenticationTypes.NONE);

  const [error, setError] = useState<string | undefined>(undefined);

  useEffect((): void => {
    AsyncStorage.getItem('AuthenticationType').then(async val => {
      if (!val) {
        if (supportedBiometry !== null) {
          AsyncStorage.setItem(
            'AuthenticationType',
            SecurityAuthenticationTypes.KEYCHAIN,
          );
          setSupportedType(SecurityAuthenticationTypes.KEYCHAIN);
          setError(undefined);
        } else if (isPinOrFingerprintSet === true) {
          AsyncStorage.setItem(
            'AuthenticationType',
            SecurityAuthenticationTypes.LOCALAUTH,
          );
          setSupportedType(SecurityAuthenticationTypes.LOCALAUTH);
          setError(undefined);
        } else {
          AsyncStorage.setItem(
            'AuthenticationType',
            SecurityAuthenticationTypes.MANUAL,
          );
          setSupportedType(SecurityAuthenticationTypes.MANUAL);
          setError(undefined);
        }
      } else {
        if (
          supportedBiometry === null &&
          val == SecurityAuthenticationTypes.KEYCHAIN
        ) {
          // Keychain not available anymore
          setError(
            'Your previous authentication method is not available anymore. Please enroll your biometrics on your device again or reinstall the app.',
          );
        } else if (
          isPinOrFingerprintSet !== true &&
          val == SecurityAuthenticationTypes.LOCALAUTH
        ) {
          // LocalAuth not available anymore
          setError(
            'Your previous authentication method is not available anymore. Please add a PIN code lock to your device or reinstall the app.',
          );
        } else {
          setSupportedType(val as SecurityAuthenticationTypes);
          setError(undefined);
        }
      }
    });
  }, [isPinOrFingerprintSet, supportedBiometry]);

  const Encrypt = (plain: string, key: string): string => {
    const iv = Buffer.from(DeviceInfo.getUniqueId(), 'utf8').slice(0, 16);
    const aes = crypto.createCipheriv(
      'aes-256-cbc',
      crypto.createHmac('sha256', key).digest(),
      iv,
    );
    let ciphertext = aes.update(plain);
    ciphertext = Buffer.concat([iv, ciphertext, aes.final()]);
    return ciphertext.toString('base64');
  };

  const Decrypt = (cypher: string, key: string): string => {
    const ciphertextBytes = Buffer.from(cypher, 'base64');
    const iv = ciphertextBytes.slice(0, 16);
    const data = ciphertextBytes.slice(16);
    const aes = crypto.createDecipheriv(
      'aes-256-cbc',
      crypto.createHmac('sha256', key).digest(),
      iv,
    );
    let plaintextBytes = Buffer.from(aes.update(data));
    plaintextBytes = Buffer.concat([plaintextBytes, aes.final()]);
    return plaintextBytes.toString();
  };

  const writeEncrypedStorage = useCallback(async (suffix: string): void => {
    try {
      await EncryptedStorage.setItem(
        suffix,
        crypto.randomBytes(64).toString('hex'),
      );
    } catch (e) {
      console.log(e);
    }
  }, []);

  const readEncrytedStorage = async (suffix: string): Promise<string> => {
    try {
      let creds = await EncryptedStorage.getItem(suffix);

      if (creds) {
        await new Promise((res, rej) => {
          LocalAuth((error: any) => {
            if (!error) {
              res(true);
            } else {
              rej('failed local auth');
            }
          });
        });

        return creds;
      } else {
        await writeEncrypedStorage(suffix);
        return await readEncrytedStorage(suffix);
      }
    } catch (e) {
      console.log(e);
      throw new Error('Authentication Failed');
    }
  };

  const readPin = useCallback(async (): Promise<string> => {
    if (supportedType == SecurityAuthenticationTypes.KEYCHAIN) {
      return await read('whisperMasterKey');
    } else if (supportedType == SecurityAuthenticationTypes.LOCALAUTH) {
      return await readEncrytedStorage('whisperMasterKey');
    } else if (supportedType == SecurityAuthenticationTypes.MANUAL) {
      if (!(await AsyncStorage.getItem('walletKey'))) {
        return await new Promise(res => {
          setSetManualPin(() => pin => {
            res(pin);
          });
          navigate('AskPinScreen');
        });
      } else {
        return await new Promise(res => {
          setAskManualPin(() => pin => {
            res(pin);
          });
          navigate('AskPinScreen');
        });
      }
    } else {
      return '';
    }
  }, [supportedType, setSetManualPin, setAskManualPin]);

  const readPassword = useCallback(async (): Promise<string> => {
    return new Promise((res, rej) => {
      AsyncStorage.getItem('walletKey')
        .then(async val => {
          if (!val) {
            // There is no key written, we need to generate one
            let newKey = crypto.randomBytes(64).toString('hex');
            let pin = await readPin();
            let encryptedKey = Encrypt(newKey, pin);
            AsyncStorage.setItem('walletKey', encryptedKey);
            res(newKey);
          } else {
            res(Decrypt(val, await readPin()));
          }
        })
        .catch(rej);
    });
  }, [supportedType]);

  // Context accessible through useSecurity hook

  const securityContext: SecurityContextValue = useMemo(
    () => ({
      supportedType,
      readPassword,
      setManualPin,
      setSetManualPin,
      askManualPin,
      setAskManualPin,
    }),
    [
      readPassword,
      supportedType,
      setManualPin,
      askManualPin,
      setSetManualPin,
      setAskManualPin,
    ],
  );

  return (
    <SecurityContext.Provider value={securityContext}>
      {error ? (
        <Container
          useSafeArea
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
          }}>
          <Icon
            name={'warning'}
            size={scale(32)}
            color={'#fff'}
            style={{opacity: 1, marginBottom: scale(32)}}
          />
          <Text style={{textAlign: 'center', paddingHorizontal: scale(32)}}>
            {error}
          </Text>
        </Container>
      ) : (
        <></>
      )}
      {props.children}
    </SecurityContext.Provider>
  );
};

export default SecurityProvider;
