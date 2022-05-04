import useWallet from '../../hooks/useWallet';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Alert, ScrollView} from 'react-native';
import Container from '../../components/Container';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Animation_Types_Enum} from '../../constants/Type';
import OptionCard from '../../components/OptionCard';
import {RootStackParamList, ScreenProps} from '../../navigation/type';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import useNjs from '../../hooks/useNjs';
import useKeychain from '../../utils/Keychain';
import LoadingModalContent from '../../components/LoadingModalContent';
import TopNavigationComponent from '../../components/TopNavigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {screenHeight} from '../../utils/layout';
import {scale, verticalScale} from 'react-native-size-matters';
import {useModal} from '../../hooks/useModal';

interface SettingsItem {
  title: string;
  onPress: () => void;
  icon?: string;
  color?: string;
  show?: boolean;
}

const SettingsScreen = (props: ScreenProps<'SettingsScreen'>) => {
  const [loading, setLoading] = useState<string | undefined>(undefined);
  const {read} = useKeychain();
  const {walletName, wallet, createWallet} = useWallet();
  const {njs} = useNjs();

  const {navigate, goBack} =
    useNavigation<NavigationProp<RootStackParamList>>();

  const [lockAfterBackground, setLockAfterBackground] = useAsyncStorage(
    'lockAfterBackground',
    'false',
  );
  const {openModal, closeModal} = useModal();

  const biometricsAlert = () => {
    let title = 'Your wallet is NOT locked when WhisperWallet goes background.';
    if (lockAfterBackground === 'true') {
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
    wallet.Disconnect();
    wallet.CloseDb();
    if (deleteWallet) {
      await njs.wallet.WalletFile.RemoveWallet(walletName);
    }
    navigate('Intro');
  };

const deleteWallet = () => {
    Alert.alert(
      'Delete Wallet',
      'The coins stored on the wallet "' +
        walletName +
        '" will be lost and only accessible again using a valid backup.\n\nPlease be sure your seed words are correctly backed up.\n\nAre you sure you want to delete this wallet?',
      [
        {
          text: 'Delete',
          onPress: () => {
            read(walletName).then((password: string) => {
              disconnectWallet(true);
            });
          },
        },
        {
          text: 'Cancel',
          onPress: () => {},
        },
      ],
    );
  };

  const resyncWallet = () => {
    try {
      wallet.Disconnect();
      wallet.CloseDb();
    } catch (e) {}

    read(walletName).then((password: string) => {
      setLoading('Restarting...');

      createWallet(
        walletName,
        '',
        '',
        password,
        password,
        true,
        true,
        '',
        () => {
          setLoading(undefined);
          goBack();
        },
      );
    });
  };

  const leaveWallet = () => disconnectWallet();

  const items: SettingsItem[] = [
    {
      title: 'Show mnemonic',
      icon: 'padLock',
      show: true,
      onPress: () => {
        navigate('Wallet', {
          screen: 'MnemonicScreen',
        });
      },
    },
    {
      title: 'Biometrics configuration',
      icon: 'eye',
      show: true,
      onPress: () => biometricsAlert(),
    },
    {
      title: 'Staking nodes',
      icon: 'factory',
      show: true,
      onPress: () => {
        navigate('Wallet', {
          screen: 'StakingNodeScreen',
        });
      },
    },
    {
      title: 'Electrum servers',
      icon: 'book',
      show: true,
      onPress: () => {
        navigate('Wallet', {
          screen: 'ServersScreen',
        });
      },
    },
    {
      title: 'Clear history and resync',
      icon: 'refresh',
      show: true,
      onPress: () => resyncWallet(),
    },
    {
      title: 'Delete wallet',
      icon: 'cancel',
      show: true,
      onPress: () => deleteWallet(),
    },
    {
      title: 'Close wallet',
      icon: 'undo',
      show: true,
      onPress: () => leaveWallet(),
    },
    {
      title: 'Error Logs',
      icon: 'search',
      show: true,
      onPress: () => {
        navigate('Wallet', {
          screen: 'ErrorLogsScreen',
        });
      },
    },
  ];

  useEffect(() => {
    if (loading) {
      openModal(<LoadingModalContent loading={!!loading} text={loading} />);
      return;
    }
    closeModal();
  }, [loading]);
  return (
    <Container useSafeArea>
      <TopNavigationComponent title={'Settings'} />
      <ScrollView style={styles.contentWrapper}>
        {items.map((item, index) => {
          if (!item.show) {
            return <View key={index} />;
          }
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
      </ScrollView>
    </Container>
  );
};

export default gestureHandlerRootHOC(SettingsScreen);

const styles = StyleSheet.create({
  contentWrapper: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(20),
    height: screenHeight,
  },
});
