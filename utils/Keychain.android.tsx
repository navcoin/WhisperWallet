import EncryptedStorage from 'react-native-encrypted-storage';
import {useCallback} from 'react';
import * as crypto from 'crypto';
import LocalAuth from './LocalAuth';

const useKeychain = () => {
  const write = useCallback(async (suffix: string) => {
    try {
      await EncryptedStorage.setItem(
        suffix,
        crypto.randomBytes(64).toString('hex'),
      );
    } catch (e) {
      console.log(e);
    }
  }, []);

  const read = async (suffix: string) => {
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
