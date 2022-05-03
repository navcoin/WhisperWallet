import useWallet from '../../hooks/useWallet';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Alert, ScrollView} from 'react-native';
import Container from '../../components/Container';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Animation_Types_Enum} from '../../constants/Type';
import OptionCard from '../../components/OptionCard';
import {RootStackParamList, ScreenProps} from '../../navigation/type';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import useNjs from '../../hooks/useNjs';
import LoadingModalContent from '../../components/LoadingModalContent';
import TopNavigationComponent from '../../components/TopNavigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {screenHeight} from '../../utils/layout';
import {scale, verticalScale} from 'react-native-size-matters';
import useSecurity from '../../hooks/useSecurity';
import {SecurityAuthenticationTypes} from '../../contexts/SecurityContext';
import {useToast} from 'react-native-toast-notifications';
import {useBottomSheet} from '../../hooks/useBottomSheet';
import BottomSheetOptions from '../../components/BottomSheetOptions';
import {useModal} from '../../hooks/useModal';

interface SettingsItem {
  title: string;
  onPress: () => void;
  icon?: string;
  color?: string;
  show?: boolean;
}

const SettingsScreen = (props: ScreenProps<'SettingsScreen'>) => {
  const {readPassword} = useSecurity();
  const [loading, setLoading] = useState<string | undefined>(undefined);
  const {walletName, wallet, createWallet} = useWallet();
  const {njs} = useNjs();
  const toast = useToast();
  const bottomSheet = useBottomSheet();
  const {changeMode, supportedType, currentAuthenticationType} = useSecurity();
  const [authTypes, setAuthTypes] = useState<any>([]);

  useEffect(() => {
    let deviceAuth = [];
    if (
      supportedType == SecurityAuthenticationTypes.KEYCHAIN ||
      supportedType == SecurityAuthenticationTypes.LOCALAUTH
    ) {
      deviceAuth = [{text: supportedType, icon: 'biometrics'}];
    }

    deviceAuth.push(
      {
        text: SecurityAuthenticationTypes.MANUAL_4,
        icon: 'pincode',
      },
      {
        text: SecurityAuthenticationTypes.MANUAL,
        icon: 'pincode',
      },
      {
        text: SecurityAuthenticationTypes.NONE,
        icon: 'unsecure',
      },
    );

    deviceAuth = deviceAuth.filter(el => el.text != currentAuthenticationType);

    setAuthTypes(deviceAuth);
  }, [supportedType, currentAuthenticationType]);

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
    setLoading('Restarting...');
    wallet.Disconnect();
    wallet.CloseDb();
    readPassword().then((password: string) => {
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
      title: 'Biometrics configuration',
      icon: 'eye',
      show: supportedType != SecurityAuthenticationTypes.MANUAL,
      onPress: () => biometricsAlert(),
    },
    {
      title: 'Security: ' + currentAuthenticationType,
      icon: 'pincode',
      show: true,
      onPress: () => {
        bottomSheet.expand(
          <BottomSheetOptions
            title={'Select a new authentication mode'}
            options={authTypes}
            bottomSheetRef={bottomSheet.getRef}
            onSelect={(el: any) => {
              changeMode(el.text);
            }}
          />,
        );
      },
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
