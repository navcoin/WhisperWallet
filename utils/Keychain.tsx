import * as Keychain from 'react-native-keychain';
import {Platform} from 'react-native';
import {useEffect, useState} from 'react';
import * as crypto from 'crypto';

const useKeychain = () => {
  const [state, setState] = useState({
    service: 'net.whisperwallet.wallet',
    authenticationType:
      Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
    storage: Keychain.STORAGE_TYPE.RSA,
  });

  //const appBundleId = await DeviceInfo.getBundleId();

  useEffect(() => {
    Keychain.getSupportedBiometryType({}).then(biometryType => {
      console.log(biometryType);
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
