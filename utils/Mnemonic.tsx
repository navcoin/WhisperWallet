// eslint-disable-next-line @typescript-eslint/no-var-requires
const Mnemonic = require('@aguycalled/bitcore-mnemonic');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const electrumMnemonic = require('electrum-mnemonic');

export function IsValidMnemonic(mnemonic: string, type: string) {
  try {
    return type == 'navcash'
      ? electrumMnemonic.validateMnemonic(
          mnemonic,
          electrumMnemonic.PREFIXES.standard,
        )
      : Mnemonic.isValid(mnemonic);
  } catch (e) {
    console.log(e);
    return false;
  }
}
