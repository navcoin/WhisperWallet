import {createContext} from 'react';

export enum SecurityAuthenticationTypes {
  KEYCHAIN = 'FaceId/Fingerprint',
  LOCALAUTH = 'Device Unlock Code',
  MANUAL = 'Manual Pin Code (6 digits)',
  MANUAL_4 = 'Manual Pin Code (4 digits)',
  NONE = 'None',
}
export const GetAuthenticationName = (type: SecurityAuthenticationTypes) => {
  switch (type) {
    case SecurityAuthenticationTypes.KEYCHAIN:
      return 'Face ID or Touch ID';
      break;
    case SecurityAuthenticationTypes.LOCALAUTH:
      return 'Device Lock';
      break;
    case SecurityAuthenticationTypes.MANUAL:
      return '6-digit PIN code';
      break;
    case SecurityAuthenticationTypes.MANUAL_4:
      return '4-digit PIN code';
      break;
    default:
      return 'None';
  }
};

export interface SecurityContextValue {
  supportedType: SecurityAuthenticationTypes | number;
  readPassword(): Promise<string>;
  changeMode(newMode: SecurityAuthenticationTypes): Promise<boolean>;
  currentAuthenticationType: SecurityAuthenticationTypes | number;
  lockedScreen: boolean;
  setLockedScreen(locked: boolean): any;
  lockAfterBackground: boolean;
  setLockAfterBackground(shouldLock: boolean): any;
}

export const SecurityContext = createContext<SecurityContextValue | undefined>(
  undefined,
);
