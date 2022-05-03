import * as Keychain from 'react-native-keychain';
import {useEffect, useState} from 'react';
import * as crypto from 'crypto';
import {isEmulatorSync} from 'react-native-device-info';

const useKeychain = () => {
  const [state, setState] = useState({
    service: 'net.whisperwallet.wallet',
    authenticationType:
      Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
    accessControl: isEmulatorSync()
      ? undefined
      : Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    accessible: isEmulatorSync()
      ? undefined
      : Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
    storage: Keychain.STORAGE_TYPE.AES,
  });

  //const appBundleId = await DeviceInfo.getBundleId();

  useEffect(() => {
    Keychain.getSupportedBiometryType({}).then(biometryType => {
      setState((prev: any) => ({...prev, biometryType}));
    });
  }, []);

  const write = async (suffix: string) => {
    await Keychain.setGenericPassword(
      crypto.randomBytes(64).toString('hex'),
      crypto.randomBytes(64).toString('hex'),
      {...state, service: 'net.whisperwallet.wallet.' + suffix},
    );
  };

  const read = async (suffix: string) => {
    const options = {
      ...state,
      service: 'net.whisperwallet.wallet.' + suffix,
      authenticationPrompt: {
        title: 'Authentication needed',
        cancel: 'Cancel',
      },
    };
    try {
      let creds = await Keychain.getGenericPassword(options);

      if (creds) {
        return creds.password;
      } else {
        await write(suffix);
        return await read(suffix);
      }
    } catch (e) {
      console.log(e);
      throw new Error('Authentication Failed');
    }
  };

  return {read};
};

export default useKeychain;
