import FingerprintScanner from 'react-native-fingerprint-scanner';

const isDeviceBiometricCapable = async () => {
  try {
    if (await FingerprintScanner.isSensorAvailable()) {
      return true;
    }
  } catch (e) {
    console.log('Biometrics isDeviceBiometricCapable failed');
    console.log(e);
    return false;
  }
};

const LocalAuth = async (res: any) => {
  if (await isDeviceBiometricCapable()) {
    res(
      await new Promise(resolve => {
        FingerprintScanner.authenticate({
          description: 'Authenticate to unlock Whisper',
          fallbackEnabled: true,
        })
          .then(() => resolve(false))
          .catch(error => {
            console.log('Biometrics authentication failed');
            console.log(error);
            resolve(true);
          })
          .finally(() => FingerprintScanner.release());
      }),
    );
  } else {
    res(true);
  }
};

export default LocalAuth;
