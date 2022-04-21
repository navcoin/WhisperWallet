import useWallet from '../../hooks/useWallet';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Container from '../../components/Container';
import {ScreenProps} from '../../navigation/type';
import Mnemonic from '../../components/Mnemonic';
import Text from '../../components/Text';
import TopNavigationComponent from '../../components/TopNavigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import useSecurity from '../../hooks/useSecurity';

const MnemonicScreen: React.FC<ScreenProps<'MnemonicScreen'>> = () => {
  const {mnemonic: mnemonicSource, wallet} = useWallet();
  const {readPassword} = useSecurity();

  const [mnemonic, setMnemonic] = useState(mnemonicSource);
  useEffect(() => {
    if (mnemonic) {
      return;
    }
    readPassword().then(async (password: string) => {
      const updatedMnemonic: string = await wallet.db.GetMasterKey(
        'mnemonic',
        password,
      );
      setMnemonic(updatedMnemonic);
    });
  }, [mnemonic]);
  return (
    <Container>
      <TopNavigationComponent title={'Mnemonic'} />
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
