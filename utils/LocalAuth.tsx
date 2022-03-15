import * as LocalAuthentication from 'expo-local-authentication';

const LocalAuth = (res: any) => {
  try {
    LocalAuthentication.authenticateAsync().then(
      (authResult: LocalAuthentication.LocalAuthenticationResult) => {
        if (authResult.success) res(undefined);
        else res(authResult.error);
      },
    );
  } catch (error) {
    res(error);
    console.log("Keychain couldn't be accessed!", error);
  }
};

export default LocalAuth;
