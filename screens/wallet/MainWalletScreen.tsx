import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {
  Icon,
  Layout,
  StyleService,
  useStyleSheet,
  useTheme,
} from '@tsejerome/ui-kitten-components';

import Container from '../../components/Container';
import useWallet from '../../hooks/useWallet';
import Text from '../../components/Text';

import {Connection_Stats_Enum} from '../../constants/Type';

import {NavigationProp, useNavigation} from '@react-navigation/native';

import BalanceCircle from '../../components/BalanceCircle';

import {BottomSheetProvider} from '../../contexts/BottomSheetProvider';
import AccountsTab from '../../components/AccountTabs';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {RootStackParamList} from '../../navigation/type';
import {scale} from 'react-native-size-matters';
import {TouchableWithoutFeedback} from '@tsejerome/ui-kitten-components/devsupport';

const MainWalletScreen = () => {
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const styles = useStyleSheet(themedStyles);
  const {refreshWallet, connected} = useWallet();

  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = useCallback(async () => {
    if (
      !(
        connected == Connection_Stats_Enum.Connecting ||
        connected == Connection_Stats_Enum.Bootstrapping ||
        connected == Connection_Stats_Enum.Syncing
      )
    ) {
      setRefreshing(true);
      await refreshWallet();
      setRefreshing(false);
    }
  }, []);

  return (
    <BottomSheetProvider>
      <Container style={styles.container}>
        <Layout style={styles.topTab}>
          <View>
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
          </View>
          <View style={[styles.iconGrp]}>
            <TouchableWithoutFeedback
              style={{padding: scale(12)}}
              onPress={() => {
                onRefresh();
              }}>
              <Icon pack="assets" name={'refresh'} style={[styles.icon]} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={{padding: scale(12)}}
              onPress={() => {
                navigate('Wallet', {
                  screen: 'SettingsScreen',
                });
              }}>
              <Icon pack="assets" name={'menuBtn'} style={[styles.icon]} />
            </TouchableWithoutFeedback>
          </View>
        </Layout>
        <BalanceCircle />
        <AccountsTab refreshing={refreshing} onRefresh={onRefresh} />
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
  iconGrp: {
    flexDirection: 'row',
  },
  icon: {
    width: scale(18),
    height: scale(18),
    tintColor: '$icon-basic-color',
  },
});
