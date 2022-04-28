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
import {AppState, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

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

  /*
   * isPinOrFingerprintSet will be true if the device's screen is locked
   * with a fingerprint or unlock pin code.
   * supportedBiometry will refer to the biometry supported by the device.
   */
  const UpdateFeatures = async () => {
    if (Platform.OS == 'ios') {
      await new Promise((res, rej) => {
        AsyncStorage.getItem('RequestedFaceId')
          .then(async val => {
            if (!val) {
              const faceIdPermission = await check(PERMISSIONS.IOS.FACE_ID);
              if (faceIdPermission !== RESULTS.GRANTED) {
                await request(PERMISSIONS.IOS.FACE_ID);
                await AsyncStorage.setItem('RequestedFaceId', 'true');
              }
            }
            res(true);
          })
          .catch(rej);
      });
    }

    DeviceInfo.isPinOrFingerprintSet().then(setIsPinOrFingerprintSet);
    Keychain.getSupportedBiometryType({}).then(setSupportedBiometry);
  };

  useEffect(() => {
    /*
     * When the app status changes (because it was in the background, and comes back
     * to the foreground), we need to update whether the biometry or phone's lock code
     * settings have changed.
     */
    const subscription = AppState.addEventListener('change', nextAppState => {
      UpdateFeatures();
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

    /*
     * Need to remove the susbcription when the component is unmounted
     * */

    return () => {
      subscription.remove();
    };
  }, [refreshWallet, lockAfterBackground, setLockedScreen]);

  const {read} = useKeychain();

  const [isPinOrFingerprintSet, setIsPinOrFingerprintSet] = useState<
    boolean | undefined
  >(undefined);

  const [supportedBiometry, setSupportedBiometry] = useState<
    Keychain.BIOMETRY_TYPE | null | number
  >(0);

  useEffect((): void => {
    /*
     * We need to update the set of avialable features when the component
     * is mounted for an initial state.
     */
    UpdateFeatures();
  }, []);

  const [supportedType, setSupportedType] =
    useState<SecurityAuthenticationTypes>(SecurityAuthenticationTypes.NONE);
  const [currentAuthenticationType, setCurrentAuthenticationType] =
    useState<SecurityAuthenticationTypes>(SecurityAuthenticationTypes.NONE);

  const [error, setError] = useState<string | undefined>(undefined);

  /*
   * Whenever the authentication type or the supported biometry changes we need to:
   * - If there was previously no supported type set, we set it based on
   *   the device capabilities:
   *   - If biometry is supported, we can use the Keychain
   *   - If biometry is not supported, but a pin code is set, we can use the LocalAuth
   *   - Otherwise the pin is introduced manually by the user.
   * - If we already set an auth type before, we must detect if the new capabilities
   *   differ from the type used, making it obsolete and showing an error to the
   *   user.
   */

  useEffect((): void => {
    if (supportedBiometry === 0) return;
    AsyncStorage.getItem('AuthenticationType').then(async val => {
      if (!val) {
        if (supportedBiometry !== null) {
          AsyncStorage.setItem(
            'AuthenticationType',
            SecurityAuthenticationTypes.KEYCHAIN,
          );
          setCurrentAuthenticationType(SecurityAuthenticationTypes.KEYCHAIN);
          setSupportedType(SecurityAuthenticationTypes.KEYCHAIN);
          setError(undefined);
        } else if (isPinOrFingerprintSet === true) {
          AsyncStorage.setItem(
            'AuthenticationType',
            SecurityAuthenticationTypes.LOCALAUTH,
          );
          setCurrentAuthenticationType(SecurityAuthenticationTypes.LOCALAUTH);
          setSupportedType(SecurityAuthenticationTypes.LOCALAUTH);
          setError(undefined);
        } else {
          AsyncStorage.setItem(
            'AuthenticationType',
            SecurityAuthenticationTypes.MANUAL_4,
          );
          setCurrentAuthenticationType(SecurityAuthenticationTypes.MANUAL_4);
          setSupportedType(SecurityAuthenticationTypes.MANUAL_4);
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
          setCurrentAuthenticationType(val as SecurityAuthenticationTypes);
          setSupportedType(val as SecurityAuthenticationTypes);
          setError(undefined);
        }
      }
    });
  }, [isPinOrFingerprintSet, supportedBiometry]);

  /*
   * Encrypts a plaintext with a key, returning a ciphertext
   */

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

  /*
   * Decrypts a ciphertext using a key, returning a plaintext
   */

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

  /*
   * Generates a random key and stores it in the encrypted storage.
   */

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

  /*
   * Reads the key stored in the encrypted storage
   */

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

  /*
   * This function will return the pin (key) which will be used for encrypting
   * or decrypting the wallet password.
   *
   * Depending on the authentication type, it will use the Keychain, LocalAuth
   * or manual pin. In all the three methods, if a key does not exist, it will
   * generate it and store it, or ask it from the user if the manual pin mode
   * is to be used.
   */

  const readPin = useCallback(
    async (authType_?: SecurityAuthenticationTypes): Promise<string> => {
      let authType = authType_
        ? authType_
        : ((await AsyncStorage.getItem(
            'AuthenticationType',
          )) as unknown as SecurityAuthenticationTypes);
      if (authType == SecurityAuthenticationTypes.KEYCHAIN) {
        return await read('whisperMasterKey');
      } else if (authType == SecurityAuthenticationTypes.LOCALAUTH) {
        return await readEncrytedStorage('whisperMasterKey');
      } else if (
        authType == SecurityAuthenticationTypes.MANUAL ||
        authType == SecurityAuthenticationTypes.MANUAL_4
      ) {
        if (authType_ || !(await AsyncStorage.getItem('walletKey'))) {
          return await new Promise(res => {
            navigate('AskPinScreen', {
              pinLength: authType == SecurityAuthenticationTypes.MANUAL ? 6 : 4,
              setManualPin: pin => {
                res(pin);
              },
            });
          });
        } else {
          return await new Promise(res => {
            navigate('AskPinScreen', {
              pinLength: authType == SecurityAuthenticationTypes.MANUAL ? 6 : 4,
              askManualPin: pin => {
                res(pin);
              },
            });
          });
        }
      } else {
        /*
         * Empty key if no authentication is used
         */
        return '';
      }
    },
    [supportedType],
  );

  /*
   * This function will read the key using the appropriate method, use it to
   * decrypt the wallet password and return it for its use.
   */

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

  /*
   * Changes the authentication mode to the one specified.
   *
   * The logic is:
   *  - Decrypt password using current method
   *  - Change the method
   *  - Re-encrypt with the new method
   */

  const changeMode = useCallback(
    async (newMode: SecurityAuthenticationTypes): Promise<boolean> => {
      let prevType =
        (await AsyncStorage.getItem('AuthenticationType')) ||
        SecurityAuthenticationTypes.NONE;
      let prevWalletKey = (await AsyncStorage.getItem('walletKey')) || '';
      return new Promise((res, rej) => {
        AsyncStorage.getItem('walletKey')
          .then(async val => {
            if (!val) {
              // There is no key written, we just reject
              rej('No wallet key found');
            } else {
              let key = Decrypt(val, await readPin());
              let newPin = await readPin(newMode);
              let encryptedKey = Encrypt(key, newPin);
              await AsyncStorage.setItem('AuthenticationType', newMode);
              await AsyncStorage.setItem('walletKey', encryptedKey);
              setCurrentAuthenticationType(newMode);
              res(true);
            }
          })
          .catch(async e => {
            console.log(e);
            await AsyncStorage.setItem('AuthenticationType', prevType);
            await AsyncStorage.setItem('walletKey', prevWalletKey);
            setCurrentAuthenticationType(
              prevType as SecurityAuthenticationTypes,
            );
            rej(e);
          });
      });
    },
    [supportedType],
  );

  // Context accessible through useSecurity hook

  const securityContext: SecurityContextValue = useMemo(
    () => ({
      supportedType,
      readPassword,
      changeMode,
      currentAuthenticationType,
    }),
    [readPassword, supportedType, changeMode, currentAuthenticationType],
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
