import {createContext} from 'react';

export enum SecurityAuthenticationTypes {
  KEYCHAIN,
  LOCALAUTH,
  MANUAL,
  NONE,
}

export interface SecurityContextValue {
  supportedType: SecurityAuthenticationTypes;
  readPassword(): Promise<string>;
}

export const SecurityContext = createContext<SecurityContextValue | undefined>(
  undefined,
);
