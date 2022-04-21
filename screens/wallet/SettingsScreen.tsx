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
import Loading from '../../components/Loading';
import TopNavigationComponent from '../../components/TopNavigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {screenHeight} from '../../utils/layout';
import {scale, verticalScale} from 'react-native-size-matters';
import useSecurity from '../../hooks/useSecurity';
import {SecurityAuthenticationTypes} from '../../contexts/SecurityContext';
import {useToast} from 'react-native-toast-notifications';

interface SettingsItem {
  title: string;
  onPress: () => void;
  icon?: string;
  color?: string;
  show?: boolean;
}

const SettingsScreen = (props: ScreenProps<'SettingsScreen'>) => {
  const [loading, setLoading] = useState(false);
  const {readPassword} = useSecurity();
  const {walletName, wallet, createWallet} = useWallet();
  const {njs} = useNjs();
  const toast = useToast();

  const {navigate, goBack} =
    useNavigation<NavigationProp<RootStackParamList>>();

  const [lockAfterBackground, setLockAfterBackground] = useAsyncStorage(
    'lockAfterBackground',
    'false',
  );

  const {supportedType} = useSecurity();

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
    wallet.Disconnect();
    wallet.CloseDb();
    readPassword().then((password: string) => {
      setLoading(true);
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
          setLoading(false);
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
        readPassword()
          .then(async (password: string) => {
            const updatedMnemonic: string = await wallet.db.GetMasterKey(
              'mnemonic',
              password,
            );
            navigate('Wallet', {
              screen: 'MnemonicScreen',
              params: {mnemonic: updatedMnemonic},
            });
          })
          .catch(e => {
            toast.hideAll();
            toast.show(e.toString());
          });
      },
    },
    {
      title: 'Biometrics Configuration',
      icon: 'eye',
      show: supportedType != SecurityAuthenticationTypes.MANUAL,
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
      <Loading loading={loading} />
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
