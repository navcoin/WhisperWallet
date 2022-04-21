import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Text from '../components/Text';
import Container from '../components/Container';
import useWallet from '../hooks/useWallet';
import Loading from '../components/Loading';
import useNjs from '../hooks/useNjs';
import OptionCard from '../components/OptionCard';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {layoutStyles} from '../utils/layout';
import TopNavigationComponent from '../components/TopNavigation';
import useSecurity from '../hooks/useSecurity';

const OpenWallet = () => {
  const {navigate} = useNavigation();
  const {createWallet} = useWallet();
  const [loading, setLoading] = useState(false);
  const {njs} = useNjs();
  const {readPassword} = useSecurity();

  const [walletList, setWalletList] = useState<any>([]);

  useEffect(() => {
    njs.wallet.WalletFile.ListWallets().then(list => {
      setWalletList(list);
    });
  }, []);

  return (
    <Container useSafeArea>
      <Loading loading={loading} />
      <TopNavigationComponent title={'Open Wallet'} />
      <View style={styles.container}>
        <Text category="title4" center marginBottom={32}>
          Select which wallet you want to open:
        </Text>
        <KeyboardAwareScrollView
          style={styles.content}
          enableOnAndroid
          showsVerticalScrollIndicator={false}>
          {walletList.map((el, index) => {
            return (
              <View
                style={[layoutStyles.responsiveColumnComponentWidth]}
                key={el}>
                <OptionCard
                  item={{text: el}}
                  index={index}
                  icon={'creditCard'}
                  onPress={() => {
                    readPassword()
                      .then((password: string) => {
                        setLoading(true);
                        createWallet(
                          el,
                          '',
                          '',
                          password,
                          password,
                          false,
                          true,
                          'mainnet',
                          () => {
                            setLoading(false);
                            navigate('Wallet');
                          },
                        );
                      })
                      .catch((e: any) => {
                        setLoading(false);
                      });
                  }}
                />
              </View>
            );
          })}
        </KeyboardAwareScrollView>
      </View>
    </Container>
  );
};

export default OpenWallet;

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  tabBar: {
    marginHorizontal: 80,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  topNav: {
    marginHorizontal: 12,
  },
  input01: {
    flex: 1,
    marginRight: 16,
  },
  inputPhone: {
    marginVertical: 20,
  },
  content: {
    marginHorizontal: 24,
  },
  flexRow: {
    flexDirection: 'row',
  },
  box: {
    borderRadius: 12,
    padding: 16,
    width: 120,
  },
  boxConfirm: {
    margin: 4,
    width: 120,
  },
  boxWord: {
    borderRadius: 16,
    margin: 4,
    padding: 16,
    width: 120,
  },
  animatedStep: {
    marginTop: 28,
  },
  layout: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  button: {
    flex: 1,
    marginTop: 32,
    marginHorizontal: 12,
    height: 21,
  },
});
