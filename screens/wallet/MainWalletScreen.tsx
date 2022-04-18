import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, RefreshControl, View} from 'react-native';
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
import {scale, verticalScale} from 'react-native-size-matters';

const MainWalletScreen = () => {
  const {navigate} = useNavigation<NavigationProp<WalletParamList>>();

  const styles = useStyleSheet(themedStyles);
  const {connected} = useWallet();

  const [dotColor, setDotColor] = useState('gray');

  useEffect(() => {
    if (connected == Connection_Stats_Enum.Connecting) {
      setDotColor('orange');
    } else if (connected == Connection_Stats_Enum.Connected) {
      setDotColor('green');
    } else if (connected == Connection_Stats_Enum.Disconnected) {
      setDotColor('red');
    }
  }, [connected]);

  return (
    <BottomSheetProvider>
      <Container style={styles.container}>
        <Layout style={styles.topTab}>
          <View
            style={{
              width: scale(8),
              borderRadius: scale(4),
              height: scale(8),
              backgroundColor: dotColor,
              marginLeft: scale(12),
              marginTop: scale(12),
              alignSelf: 'center',
            }}
          />
          <Text />
          <NavigationAction
            icon={'menu'}
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
