import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {ScrollView, RefreshControl, View} from 'react-native';
import {Layout, StyleService, useStyleSheet} from '@ui-kitten/components';

import Container from '../../components/Container';
import NavigationAction from '../../components/NavigationAction';
import useWallet from '../../hooks/useWallet';
import Text from '../../components/Text';

import {Connection_Stats_Enum} from '../../constants/Type';

import {NavigationProp, useNavigation} from '@react-navigation/native';

import BalanceCircle from '../../components/BalanceCircle';

import {BottomSheetProvider} from '../../contexts/BottomSheetProvider';
import AccountsTab from '../../components/AccountTabs';
import {RootStackParamList} from '../../navigation/type';

const MainWalletScreen = () => {
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();

  const styles = useStyleSheet(themedStyles);
  const {connected, refreshWallet} = useWallet();

  const [dotColor, setDotColor] = useState('gray');

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshWallet();
    setRefreshing(false);
  }, []);

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
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
              titleColor="#fff"
            />
          }>
          <Layout style={styles.topTab}>
            <View
              style={{
                width: 8,
                borderRadius: 4,
                height: 8,
                backgroundColor: dotColor,
                marginLeft: 12,
                marginTop: 12,
                alignSelf: 'center',
              }}
            />
            <Text />
            <NavigationAction
              icon={'menu'}
              onPress={() => navigate({name: 'Intro'})}
            />
          </Layout>
          <BalanceCircle />
          <AccountsTab />
        </ScrollView>
      </Container>
    </BottomSheetProvider>
  );
};

export default MainWalletScreen;

const themedStyles = StyleService.create({
  item: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  contentContainer: {
    backgroundColor: 'background-basic-color-3',
    flex: 1,
    paddingTop: 8,
    padding: 20,
  },
  line: {
    height: 72,
    width: 4,
    backgroundColor: 'color-salmon-600',
    borderRadius: 8,
  },
  description: {
    flexDirection: 'row',
    marginLeft: 0,
    marginVertical: 24,
  },
  layout: {
    borderRadius: 8,
    padding: 16,
  },
  book: {
    width: 32,
    height: 43,
    marginRight: 12,
  },
  playPause: {
    width: 32,
    height: 32,
  },
  control: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  topTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  logo: {
    width: 28,
    height: 28,
  },
  handleStyle: {
    backgroundColor: 'background-basic-color-3',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});
