import useWallet from '../../hooks/useWallet';
import React from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {TopNavigation} from '@ui-kitten/components';
import Container from '../../components/Container';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {
  Animation_Types_Enum,
  Connection_Stats_Enum,
} from '../../constants/Type';
import OptionCard from '../../components/OptionCard';
import {RootStackParamList, ScreenProps} from '../../navigation/type';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import useNjs from '../../hooks/useNjs';

interface SettingsItem {
  title: string;
  onPress: () => void;
  icon?: string;
  color?: string;
}

const SettingsScreen = (props: ScreenProps<'SettingsScreen'>) => {
  const {walletName, wallet, connected} = useWallet();
  const {njs} = useNjs();

  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();

  const [lockAfterBackground, setLockAfterBackground] = useAsyncStorage(
    'lockAfterBackground',
    'false',
  );

  const biometricsAlert = () => {
    let title = 'Your wallet is NOT locked when WhisperWallet goes background.';
    if (lockAfterBackground) {
      title =
        'Your wallet is currently locked when WhisperWallet goes background.';
    }
    Alert.alert(
      title,
      'Do you want to lock automatically the wallet when it goes to background?',
      [
        {
          text: 'Yes',
          onPress: () => {
            setLockAfterBackground('true');
          },
        },
        {
          text: 'No',
          onPress: () => {
            setLockAfterBackground('false');
          },
        },
        {
          text: 'Cancel',
          onPress: () => {},
        },
      ],
    );
  };

  const disconnectWallet = async (deleteWallet: boolean = false) => {
    if (connected === Connection_Stats_Enum.Connected) {
      wallet.Disconnect();
      wallet.CloseDb();
      if (deleteWallet) {
        await njs.wallet.WalletFile.RemoveWallet(walletName);
      }
    }
    navigate('Intro');
  };

  const deleteWallet = () => {
    Alert.alert('Delete Wallet', 'Are you sure to delete ' + walletName, [
      {
        text: 'Delete',
        onPress: () => disconnectWallet(true),
      },
      {
        text: 'Cancel',
        onPress: () => {},
      },
    ]);
  };

  const leaveWallet = () => disconnectWallet();

  const items: SettingsItem[] = [
    {
      title: 'Show Mnemonic',
      icon: 'padLock',
      onPress: () => {
        navigate('Wallet', {
          screen: 'MnemonicScreen',
        });
      },
    },
    {
      title: 'Biometrics Configuration',
      icon: 'eye',
      onPress: () => biometricsAlert(),
    },
    {
      title: 'Setup Electrum Servers',
      icon: 'book',
      onPress: () => {
        navigate('Wallet', {
          screen: 'ServersScreen',
        });
      },
    },
    {
      title: 'Delete Wallet',
      icon: 'cancel',
      onPress: () => deleteWallet(),
    },
    {
      title: 'Close Wallet',
      icon: 'undo',
      onPress: () => leaveWallet(),
    },
  ];

  return (
    <Container useSafeArea>
      <TopNavigation title={'Settings'} />
      <View style={styles.contentWrapper}>
        {items.map((item, index) => {
          return (
            <OptionCard
              key={index}
              id={index.toString()}
              index={index}
              item={{text: item.title}}
              selected={'walletName'}
              onPress={item.onPress}
              animationType={Animation_Types_Enum.SlideInLeft}
              icon={item.icon || 'download'}
              color={item.color || 'white'}
            />
          );
        })}
      </View>
    </Container>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 8,
  },
  contentWrapper: {
    padding: 20,
    marginTop: 40,
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
