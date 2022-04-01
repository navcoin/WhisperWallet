import useWallet from '../../hooks/useWallet';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {TopNavigation} from '@ui-kitten/components';
import Container from '../../components/Container';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {
  Connection_Stats_Enum,
  Connection_Stats_Text,
} from '../../constants/Type';
import OptionCard from '../../components/OptionCard';
import useLayout from '../../hooks/useLayout';
import {RootStackParamList} from '../../navigation/type';

interface SettingsItem {
  title: string;
  onPress: () => void;
  icon?: string;
  iconColor?: string;
}

const Settings = (props: any) => {
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

  // const goToAddressCoin = () => {
  //   if (props && props.navigation) {
  //     navigate(RootScreenNames.Wallet, {
  //       screen: WalletScreenNames.Address,
  //       params: {from: props.route.params.publicWallet},
  //     });
  //   }
  // };

  const items: SettingsItem[] = [
    {
      title: 'Show Mnemonic',
      onPress: () => {
        navigate('Wallet', {
          screen: 'MnemonicScreen',
          params: {items: 'a'},
        });
      },
    },
    {
      title: 'Biometrics Configuration',
      onPress: () => {},
    },
    {
      title: 'Setup Electrum Servers',
      onPress: () => {},
    },
    {
      title: 'Delete Wallet',
      onPress: () => {
        navigate('Intro');
      },
    },
    {
      title: 'Close Wallet',
      onPress: () => {
        navigate('Intro');
      },
    },
  ];

  return (
    <Container useSafeArea>
      <TopNavigation title={'Wallet History'} />
      {items.map((item, index) => {
        return (
          <OptionCard
            key={index}
            id={index.toString()}
            index={index}
            item={{text: item.title}}
            selected={'walletName'}
            onPress={item.onPress}
            icon={item.icon || 'download'}
            iconColor={item.iconColor || 'white'}
          />
        );
      })}
    </Container>
  );
};

export default Settings;

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
