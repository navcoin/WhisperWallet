import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  Layout,
  useStyleSheet,
  useTheme,
} from '@tsejerome/ui-kitten-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  Text,
  BalanceCircle,
  BottomSheetOptions,
} from '@components';
import { useWallet, useBottomSheet } from '@hooks';
import { Connection_Stats_Enum } from '@constants';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import MainScreenTab from '@screens/main';
import { RootStackParamList } from '@navigation/type';
import { scale } from 'react-native-size-matters';
import { TouchableWithoutFeedback } from '@tsejerome/ui-kitten-components/devsupport';
import { launchImageLibrary } from 'react-native-image-picker';
import { mainWalletStyles } from './styles';

const MainWalletScreen = ({ navigation }) => {
  const theme = useTheme();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = useStyleSheet(mainWalletStyles);
  const { refreshWallet, connected, walletName } = useWallet();

  const [dotColor, setDotColor] = useState('gray');
  const backgroundColor = { backgroundColor: dotColor };

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
                if (result.assets[0].uri) {
                  navigate('ScanQRScreen', { uri: result.assets[0].uri });
                } else {
                  bottomSheet.collapse();
                }
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
          <View style={styles.connectedView}>
            <Text style={styles.textAlign} category={'caption1'}>
              {connected}
            </Text>
            <View style={[styles.divider, backgroundColor]} />
          </View>
        </View>
        <View style={styles.settingClickWrapper}>
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
      <View style={{ margin: scale(6) }}>
        <BalanceCircle />
      </View>
      <MainScreenTab />
    </Container>
  );
};

export default MainWalletScreen;
