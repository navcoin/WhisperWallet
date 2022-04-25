import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {
  Layout,
  StyleService,
  useStyleSheet,
} from '@tsejerome/ui-kitten-components';

import Container from '../../components/Container';
import NavigationAction from '../../components/NavigationAction';
import useWallet from '../../hooks/useWallet';
import Text from '../../components/Text';

import {Connection_Stats_Enum} from '../../constants/Type';

import {NavigationProp, useNavigation} from '@react-navigation/native';

import BalanceCircle from '../../components/BalanceCircle';

import {BottomSheetProvider} from '../../contexts/BottomSheetProvider';
import AccountsTab from '../../components/AccountTabs';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {WalletParamList} from '../../navigation/type';
import {scale} from 'react-native-size-matters';

const MainWalletScreen = () => {
  const {navigate} = useNavigation<NavigationProp<WalletParamList>>();

  const styles = useStyleSheet(themedStyles);
  const {connected} = useWallet();

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

  return (
    <BottomSheetProvider>
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
                marginLeft: scale(8),
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

          <NavigationAction
            icon={'menuBtn'}
            onPress={() =>
              navigate('Wallet', {
                screen: 'SettingsScreen',
              })
            }
          />
        </Layout>
        <BalanceCircle />
        <AccountsTab />
      </Container>
    </BottomSheetProvider>
  );
};

export default gestureHandlerRootHOC(MainWalletScreen);

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
  },
});
