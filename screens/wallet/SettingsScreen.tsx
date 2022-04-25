import useWallet from '../../hooks/useWallet';
import React, {useState} from 'react';
import {StyleSheet, View, Alert, ScrollView} from 'react-native';
import Container from '../../components/Container';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Animation_Types_Enum} from '../../constants/Type';
import OptionCard from '../../components/OptionCard';
import {RootStackParamList, ScreenProps} from '../../navigation/type';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import useNjs from '../../hooks/useNjs';
import useKeychain from '../../utils/Keychain';
import Loading from '../../components/Loading';
import TopNavigationComponent from '../../components/TopNavigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {screenHeight} from '../../utils/layout';
import {scale, verticalScale} from 'react-native-size-matters';

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

  const resyncWallet = () => {
    setLoading('Restarting wallet...');
    wallet.Disconnect();
    wallet.CloseDb();
    read(walletName).then((password: string) => {
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
      title: 'Show Mnemonic',
      icon: 'padLock',
      show: true,
      onPress: () => {
        navigate('Wallet', {
          screen: 'MnemonicScreen',
        });
      },
    },
    {
      title: 'Biometrics Configuration',
      icon: 'eye',
      show: true,
      onPress: () => biometricsAlert(),
    },
    {
      title: 'Setup Staking Nodes',
      icon: 'factory',
      show: true,
      onPress: () => {
        navigate('Wallet', {
          screen: 'StakingNodeScreen',
        });
      },
    },
    {
      title: 'Setup Electrum Servers',
      icon: 'book',
      show: true,
      onPress: () => {
        navigate('Wallet', {
          screen: 'ServersScreen',
        });
      },
    },
    {
      title: 'Clear History and Resync',
      icon: 'refresh',
      show: true,
      onPress: () => resyncWallet(),
    },
    {
      title: 'Delete Wallet',
      icon: 'cancel',
      show: true,
      onPress: () => deleteWallet(),
    },
    {
      title: 'Close Wallet',
      icon: 'undo',
      show: true,
      onPress: () => leaveWallet(),
    },
  ];

  return (
    <Container useSafeArea>
      <Loading loading={!!loading} text={loading} />
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
