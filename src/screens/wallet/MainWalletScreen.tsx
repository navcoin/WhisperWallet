import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {
  Layout,
  StyleService,
  useStyleSheet,
  useTheme,
} from '@tsejerome/ui-kitten-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Container from '../../../components/Container';
import useWallet from '../../hooks/useWallet';
import Text from '../../../components/Text';

import {Connection_Stats_Enum} from '../../../constants/Type';

import {NavigationProp, useNavigation} from '@react-navigation/native';

import BalanceCircle from '../../../components/BalanceCircle';

import AccountsTab from '../../../components/AccountTabs';
import {RootStackParamList} from '../../../navigation/type';
import {scale} from 'react-native-size-matters';
import {TouchableWithoutFeedback} from '@tsejerome/ui-kitten-components/devsupport';
import {launchImageLibrary} from 'react-native-image-picker';
import BottomSheetOptions from '../../../components/BottomSheetOptions';
import {useBottomSheet} from '../../hooks/useBottomSheet';

const MainWalletScreen = ({navigation}) => {
  const theme = useTheme();
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = useStyleSheet(themedStyles);
  const {refreshWallet, connected, walletName} = useWallet();

  const [dotColor, setDotColor] = useState('gray');

  useEffect(() => {
    if (connected == Connection_Stats_Enum.Connecting) {
      setDotColor('#FFEE93');
    } else if (
      connected == Connection_Stats_Enum.Bootstrapping ||
      connected == Connection_Stats_Enum.Syncing
    ) {
      setDotColor('#A0CED9');
    } else if (
      connected == Connection_Stats_Enum.Connected ||
      connected == Connection_Stats_Enum.Synced
    ) {
      setDotColor('#ADF7B6');
    } else if (connected == Connection_Stats_Enum.Disconnected) {
      setDotColor('#FFC09F');
    }
  }, [connected]);

  const bottomSheet = useBottomSheet();

  const pickQrSource = useCallback(() => {
    bottomSheet.expand(
      <BottomSheetOptions
        title={'Select QR source'}
        options={[
          {
            text: 'Gallery',
            icon: 'image',
            onTap: () => {
              launchImageLibrary({}).then(result => {
                if (result.assets[0].uri)
                  navigate('ScanQRScreen', {uri: result.assets[0].uri});
                else bottomSheet.collapse();
              });
            },
          },
          /*{
            text: 'Files',
            onTap: async () => {
              try {
                const result = await DocumentPicker.pickSingle({
                  type: types.images,
                });
                navigate('ScanQRScreen', {uri: result.uri});
              } catch (e) {
                bottomSheet.collapse();
              }
            },
          },*/
          {
            text: 'Camera',
            icon: 'camera',
            onTap: () => {
              navigate('ScanQRScreen');
            },
          },
        ]}
        bottomSheetRef={bottomSheet.getRef}
        onSelect={(el: any) => {
          el.onTap();
        }}
      />,
    );
  }, []);

  return (
    <Container style={styles.container}>
      <Layout style={styles.topTab}>
        <View style={[styles.iconGrp]}>
          <TouchableWithoutFeedback
            onPress={async () => {
              pickQrSource();
              /*const result = await DocumentPicker.pickSingle();
              console.log(result);*/
              //navigate('ScanQRScreen');
            }}>
            <Icon
              size={scale(20)}
              name={'qr-code'}
              color={theme['color-basic-1100']}
            />
          </TouchableWithoutFeedback>
        </View>
        <View>
          <Text center numberOfLines={1}>
            {walletName}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                alignSelf: 'center',
              }}
              category={'caption1'}>
              {connected}
            </Text>
            <View
              style={{
                width: scale(8),
                borderRadius: scale(4),
                marginLeft: scale(8),
                height: scale(8),
                backgroundColor: dotColor,
                alignSelf: 'center',
              }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scale(12),
            right: 0,
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigate('SettingsScreen');
            }}>
            <Icon
              size={scale(20)}
              name={'settings'}
              color={theme['color-basic-1100']}
            />
          </TouchableWithoutFeedback>
        </View>
      </Layout>
      <View style={{margin: scale(6)}}>
        <BalanceCircle />
      </View>
      <AccountsTab />
    </Container>
  );
};

export default MainWalletScreen;

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  topTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    marginTop: scale(6),
    marginBottom: scale(18),
  },
  iconGrp: {
    padding: scale(12),

    flexDirection: 'row',
  },
  iconContainer: {
    backgroundColor: '#ff0000',
    padding: 12,
  },
});
