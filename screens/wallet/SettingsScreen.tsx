import useWallet from '../../hooks/useWallet';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Alert, ScrollView, Switch} from 'react-native';
import Container from '../../components/Container';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Animation_Types_Enum} from '../../constants/Type';
import OptionCard from '../../components/OptionCard';
import {RootStackParamList, ScreenProps} from '../../navigation/type';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import LoadingModalContent from '../../components/Modals/LoadingModalContent';
import TopNavigationComponent from '../../components/TopNavigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {screenHeight} from '../../utils/layout';
import {scale, verticalScale} from 'react-native-size-matters';
import useSecurity from '../../hooks/useSecurity';
import {GetAuthenticationName, SecurityAuthenticationTypes} from '../../contexts/SecurityContext';
import {useBottomSheet} from '../../hooks/useBottomSheet';
import BottomSheetOptions from '../../components/BottomSheetOptions';
import {useModal} from '../../hooks/useModal';
import { useTheme } from '@tsejerome/ui-kitten-components';
import DeleteWalletModalContent from '../../components/Modals/DeleteWalletModalContent';

interface SettingsItem {
  title: string;
  onPress: () => void;
  icon?: string;
  colorType?: string;
  show?: boolean;
  rightElement?: any;
}

const SettingsScreen = (props: ScreenProps<'SettingsScreen'>) => {
  const {readPassword} = useSecurity();
  const [loading, setLoading] = useState<string | undefined>(undefined);
  const {walletName, wallet, createWallet, njs, removeWallet} = useWallet();
  const bottomSheet = useBottomSheet();
  const {changeMode, supportedType, currentAuthenticationType} = useSecurity();
  const [authTypes, setAuthTypes] = useState<any>([]);
  const theme = useTheme();

  useEffect(() => {
    let deviceAuth = [];
    if (
      supportedType == SecurityAuthenticationTypes.KEYCHAIN ||
      supportedType == SecurityAuthenticationTypes.LOCALAUTH
    ) {
      deviceAuth = [
        {text: GetAuthenticationName(supportedType), mode: supportedType, icon: 'biometrics'},
      ];
    }

    deviceAuth.push(
      {
        text: GetAuthenticationName(SecurityAuthenticationTypes.MANUAL_4),
        mode: SecurityAuthenticationTypes.MANUAL_4,
        icon: 'pincode',
      },
      {
        text: GetAuthenticationName(SecurityAuthenticationTypes.MANUAL),
        mode: SecurityAuthenticationTypes.MANUAL,
        icon: 'pincode',
      },
      {
        text: GetAuthenticationName(SecurityAuthenticationTypes.NONE),
        mode: SecurityAuthenticationTypes.NONE,
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

  const disconnectWallet = async (deleteWallet: boolean = false) => {
    wallet.Disconnect();
    wallet.CloseDb();
    if (deleteWallet) {
      await removeWallet(walletName);
    }
    navigate('Intro');
    setLoading(undefined);
  };

  const resyncWallet = () => {
    try {
      wallet.Disconnect();
      wallet.CloseDb();
    } catch (e) {}

    readPassword().then((password: string) => {
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

  const deleteWallet = () => {
    openModal(
      <DeleteWalletModalContent
        walletName={walletName}
        deleteWallet={() => {
          readPassword().then((password: string) => {
            setLoading('Deleting...');
            disconnectWallet(true);
          });
        }}
      />,
    );
  };

  const items: SettingsItem[] = [
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
      title: 'Security: ' + GetAuthenticationName(currentAuthenticationType),
      icon: 'pincode',
      show: true,
      onPress: () => {
        bottomSheet.expand(
          <BottomSheetOptions
            title={'Select a new authentication mode'}
            options={authTypes}
            bottomSheetRef={bottomSheet.getRef}
            onSelect={(el: any) => {
              changeMode(el.mode);
            }}
          />,
        );
      },
    },
    {
      title: 'Auto-lock',
      icon: 'eye',
      show: currentAuthenticationType != SecurityAuthenticationTypes.NONE,
      rightElement: (
          <Switch
          trackColor={{ false: '#fff', true: theme['color-staking'] }}
          onValueChange={(val) => {
            setLockAfterBackground(lockAfterBackground !== 'true' ? 'true' : 'false')
          }}
          value={lockAfterBackground === 'true'}
          style={{ marginRight: scale(12) }}
      />),
      onPress: () => {
        setLockAfterBackground(lockAfterBackground !== 'true' ? 'true' : 'false')
      },
    },
    {
      title: 'Show mnemonic',
      icon: 'padLock',
      show: true,
      onPress: () => {
        readPassword().then(async (password: string) => {
          const updatedMnemonic: string = await wallet.db.GetMasterKey(
            'mnemonic',
            password,
          );
          navigate('Wallet', {
            screen: 'MnemonicScreen',
            params: {mnemonic: updatedMnemonic},
          });
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
      title: 'Error Logs',
      icon: 'search',
      show: true,
      onPress: () => {
        navigate('Wallet', {
          screen: 'ErrorLogsScreen',
        });
      },
    },
    {
      title: 'Close wallet',
      icon: 'cancel',
      show: true,
      onPress: () => leaveWallet(),
    },
    {
      title: 'Delete wallet',
      icon: 'bin',
      show: true,
      onPress: () => deleteWallet(),
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
              rightElement={item.rightElement}
              color={item.colorType || 'white'}
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
