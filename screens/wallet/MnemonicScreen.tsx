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

namespace WalletScreenNames {
  export type Mnemonic = 'Mnemonic';
}

const MnemonicScreen: React.FC<ScreenProps<'MnemonicScreen'>> = props => {
  const {width, height} = useLayout();
  const {history, connected} = useWallet();

  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();
  const [loadingStatusText, setLoadingStatus] =
    useState<Connection_Stats_Text>();

  useEffect(() => {
    switch (connected) {
      case Connection_Stats_Enum.Connected: {
        setLoadingStatus(Connection_Stats_Text.Connected);
        break;
      }
      case Connection_Stats_Enum.Connecting: {
        setLoadingStatus(Connection_Stats_Text.Connecting);
        break;
      }
      case Connection_Stats_Enum.Disconnected: {
        setLoadingStatus(Connection_Stats_Text.Disconnected);
        break;
      }
      case Connection_Stats_Enum.NoServers: {
        setLoadingStatus(Connection_Stats_Text.NoServers);
        break;
      }
      case Connection_Stats_Enum.Syncing: {
        setLoadingStatus(Connection_Stats_Text.Syncing);
        break;
      }
      default:
        break;
    }
  }, [connected]);

  const goToAddressCoin = () => {
    if (props && props.navigation) {
      navigate('Wallet', {
        screen: 'AddressScreen',
        params: {from: props.route.params.publicWallet},
      });
    }
  };

  return (
    <Container useSafeArea>
      <TopNavigation title={'Wallet History'} />
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
        iconColor={'white'}
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
