import useWallet from '../../hooks/useWallet';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TopNavigation} from '@ui-kitten/components';
import Container from '../../components/Container';
import {ScreenProps} from '../../navigation/type';
import useKeychain from '../../utils/Keychain';
import Mnemonic from '../../components/Mnemonic';
import Text from '../../components/Text';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

const MnemonicScreen: React.FC<ScreenProps<'MnemonicScreen'>> = () => {
  const {mnemonic: mnemonicSource, wallet, walletName} = useWallet();
  const {read} = useKeychain();

  const [mnemonic, setMnemonic] = useState(mnemonicSource);
  useEffect(() => {
    if (mnemonic) {
      return;
    }
    read(walletName).then(async (password: string) => {
      const updatedMnemonic: string = await wallet.db.GetMasterKey(
        'mnemonic',
        password,
      );
      setMnemonic(updatedMnemonic);
    });
  }, [mnemonic]);
  return (
    <Container>
      <TopNavigation title={'Mnemonic'} />
      <View style={styles.contentWrapper}>
        {mnemonic ? (
          <Mnemonic mnemonic={mnemonic} />
        ) : (
          <View>
            <Text status="white" center>
              Loading...
            </Text>
          </View>
        )}
      </View>
    </Container>
  );
};

export default gestureHandlerRootHOC(MnemonicScreen);

const styles = StyleSheet.create({
  contentWrapper: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
