import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {
  Icon,
  Layout,
  StyleService,
  useStyleSheet,
} from '@tsejerome/ui-kitten-components';

import Container from '../../components/Container';
import useWallet from '../../hooks/useWallet';
import Text from '../../components/Text';

import {Connection_Stats_Enum} from '../../constants/Type';

import {NavigationProp, useNavigation} from '@react-navigation/native';

import BalanceCircle from '../../components/BalanceCircle';

import AccountsTab from '../../components/AccountTabs';
import {RootStackParamList} from '../../navigation/type';
import {scale} from 'react-native-size-matters';
import {TouchableWithoutFeedback} from '@tsejerome/ui-kitten-components/devsupport';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker, {types} from 'react-native-document-picker';
import BottomSheetOptions from '../../components/BottomSheetOptions';
import {useBottomSheet} from '../../hooks/useBottomSheet';

const MainWalletScreen = () => {
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = useStyleSheet(themedStyles);
  const {refreshWallet, connected} = useWallet();

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
        title={'Select QR code source'}
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            left: 0,
          }}>
          <View
            style={{
              width: scale(8),
              borderRadius: scale(4),
              marginLeft: scale(12),
              height: scale(8),
              backgroundColor: dotColor,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              alignSelf: 'center',
              marginLeft: scale(12),
            }}
            category={'caption1'}>
            {connected}
          </Text>
        </View>
        <View style={[styles.iconGrp]}>
          <TouchableWithoutFeedback
            style={{padding: scale(12)}}
            onPress={async () => {
              pickQrSource();
              /*const result = await DocumentPicker.pickSingle();
              console.log(result);*/
              //navigate('ScanQRScreen');
            }}>
            <Icon pack="assets" name={'qr'} style={[styles.icon]} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={{padding: scale(12)}}
            onPress={() => {
              refreshWallet();
            }}>
            <Icon pack="assets" name={'refresh'} style={[styles.icon]} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={{padding: scale(12)}}
            onPress={() => {
              navigate('SettingsScreen');
            }}>
            <Icon pack="assets" name={'menuBtn'} style={[styles.icon]} />
          </TouchableWithoutFeedback>
        </View>
      </Layout>
      <BalanceCircle />
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
    zIndex: 9999,
    marginBottom: scale(12),
  },
  iconGrp: {
    flexDirection: 'row',
  },
  iconContainer: {
    backgroundColor: '#ff0000',
    padding: 12,
  },
  icon: {
    width: scale(18),
    height: scale(18),
    tintColor: '$icon-basic-color',
  },
});
