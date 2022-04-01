import useWallet from '../../hooks/useWallet';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {TopNavigation} from '@ui-kitten/components';
import Container from '../../components/Container';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  Connection_Stats_Enum,
  Connection_Stats_Text,
} from '../../constants/Type';
import OptionCard from '../../components/OptionCard';
import useLayout from '../../hooks/useLayout';
import {RootStackParamList, ScreenProps} from '../../navigation/type';
import useKeychain from '../../utils/Keychain';

const MnemonicScreen: React.FC<ScreenProps<'MnemonicScreen'>> = props => {
  const {history, connected} = useWallet();

  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();
  const [loadingStatusText, setLoadingStatus] =
    useState<Connection_Stats_Text>();
  const {read} = useKeychain();
  const {wallet, walletName} = useWallet();

  useEffect(() => {
    read(walletName).then(async (password: string) => {
      const mnemonic: string = await wallet.db.GetMasterKey(
        'mnemonic',
        password,
      );
    });
  }, []);
  return (
    <Container>
      <TopNavigation title={'Mnemonic'} />
      <OptionCard
        key={1}
        id={'1'}
        index={1}
        item={{text: 'Show receiving address'}}
        selected={'walletName'}
        onPress={() => {
          goToAddressCoin();
        }}
        icon={'download'}
        color={'white'}
      />
    </Container>
  );
};

export default MnemonicScreen;

const styles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 8,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  emptyView: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardWrapper: {
    maxWidth: 300,
    alignSelf: 'center',
    marginTop: 50,
  },
});
