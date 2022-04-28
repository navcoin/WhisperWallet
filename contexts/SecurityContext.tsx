import {createContext} from 'react';

export enum SecurityAuthenticationTypes {
  KEYCHAIN = 'FaceId/Fingerprint',
  LOCALAUTH = 'Device Unlock Code',
  MANUAL = 'Manual Pin Code (6 digits)',
  MANUAL_4 = 'Manual Pin Code (4 digits)',
  NONE = 'None',
}

export interface SecurityContextValue {
  supportedType: SecurityAuthenticationTypes;
  readPassword(): Promise<string>;
  changeMode(newMode: SecurityAuthenticationTypes): Promise<boolean>;
  currentAuthenticationType: SecurityAuthenticationTypes;
}

export const SecurityContext = createContext<SecurityContextValue | undefined>(
  undefined,
);
