import {createContext} from 'react';

export enum SecurityAuthenticationTypes {
  KEYCHAIN = 'FaceId/Fingerprint',
  LOCALAUTH = 'Unlock Code',
  MANUAL = 'Manual Pin Code',
  NONE = 'None',
}

export interface SecurityContextValue {
  supportedType: SecurityAuthenticationTypes;
  readPassword(): Promise<string>;
}

export const SecurityContext = createContext<SecurityContextValue | undefined>(
  undefined,
);
