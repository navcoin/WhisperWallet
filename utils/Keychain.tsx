import {useEffect, useState, useCallback} from 'react';
import * as crypto from 'crypto';

/* Imports for keychain */
import * as Keychain from 'react-native-keychain';

/* Imports for encrypted storage */
import EncryptedStorage from 'react-native-encrypted-storage';
import {isEmulatorSync} from 'react-native-device-info';
import LocalAuth from './LocalAuth';

enum StorageType {
  keychain = 'keychain',
  encrypted_storage = 'encrypted_storage',
}

const useKeychain = () => {
  const [storageType, setStorageType] = useState<StorageType>();
  const [keychainState, setKeychainState] = useState({
    service: 'net.whisperwallet.wallet',
    authenticationType:
      Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
    accessControl: isEmulatorSync()
      ? undefined
      : Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    accessible: isEmulatorSync()
      ? undefined
      : Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
    storage: Keychain.STORAGE_TYPE.RSA,
  });

  //const appBundleId = await DeviceInfo.getBundleId();

  useEffect(() => {
    Keychain.getSupportedBiometryType({}).then(biometryType => {
      if (biometryType === null) {
        setStorageType(StorageType.encrypted_storage);
        return;
      }
      setStorageType(StorageType.keychain);
      setKeychainState((prev: any) => ({...prev, biometryType}));
    });
  }, []);

  const writeKeychain = async (suffix: string) => {
    try {
      await Keychain.setGenericPassword(
        crypto.randomBytes(64).toString('hex'),
        crypto.randomBytes(64).toString('hex'),
        {...keychainState, service: 'net.whisperwallet.wallet.' + suffix},
      );
      console.log('writing shits ended');
    } catch (err) {
      console.log('err on write function');
      console.log(err.message);
    }
  };

  const readKeychain = async (suffix: string) => {
    console.log('looping....');
    const options = {
      ...keychainState,
      service: 'net.whisperwallet.wallet.' + suffix,
      authenticationPrompt: {
        title: 'Authentication needed',
        cancel: 'Cancel',
      },
    };
    try {
      let creds = await Keychain.getGenericPassword(options);

      if (creds) {
        console.log('c2hilddddl');
        console.log(JSON.stringify(creds));
        return creds.password;
      } else {
        console.log('c321hilddddl');
        console.log('options');
        console.log(JSON.stringify(suffix));
        console.log('2221111options');
        await writeKeychain(suffix);
        console.log('1111options');
        return await readKeychain(suffix);
      }
    } catch (e) {
      console.log(e);
      throw new Error('Authentication Failed');
    }
  };

  const writeEncrypedStorage = useCallback(async (suffix: string) => {
    try {
      await EncryptedStorage.setItem(
        suffix,
        crypto.randomBytes(64).toString('hex'),
      );
    } catch (e) {
      console.log(e);
    }
  }, []);

  const readEncrytedStorage = async (suffix: string) => {
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

  const read = (suffix: string) => {
    if (storageType === StorageType.keychain) {
      return readKeychain(suffix);
    }
    if (storageType === StorageType.encrypted_storage) {
      return readEncrytedStorage(suffix);
    }
  };

  /* The following function might be useful if we export the write function in the future:
  const write = (suffix: string) => {
    if (storageType === StorageType.keychain) {
      return writeKeychain(suffix);
    }
    if (storageType === StorageType.encrypted_storage) {
      return writeEncrytedStorage(suffix);
    }
  };
  */

  return {read};
};

export default useKeychain;
