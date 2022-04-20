import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Input, useTheme} from '@tsejerome/ui-kitten-components';
import {useNavigation} from '@react-navigation/native';

import Text from '../components/Text';
import Container from '../components/Container';
import useLayout from '../hooks/useLayout';
import useWallet from '../hooks/useWallet';
import Loading from '../components/Loading';
import useNjs from '../hooks/useNjs';
import OptionCard from '../components/OptionCard';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useKeychain from '../utils/Keychain';
import {layoutStyles} from '../utils/layout';
import TopNavigationComponent from '../components/TopNavigation';

const OpenWallet = () => {
  const {goBack, navigate} = useNavigation();
  const {width, bottom} = useLayout();
  const [walletName, setWalletName] = useState('');
  const {createWallet} = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {njs} = useNjs();
  const {read} = useKeychain();

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
              <View style={[layoutStyles.responsiveColumnComponentWidth]} key={el}>
                <OptionCard
                  item={{text: el}}
                  index={index}
                  icon={'creditCard'}
                  selected={walletName}
                  onPress={() => {
                    setLoading(true);
                    read(el)
                      .then((password: string) => {
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

        {error ? (
          <Text style={{color: 'red', flex: 1}} center key={'error'}>
            {error}
          </Text>
        ) : (
          <></>
        )}
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
