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
  const {navigate} = useNavigation();
  const [walletName] = useState('');
  const {createWallet, walletsList} = useWallet();
  const [loading, setLoading] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');
  const {njs} = useNjs();
  const {read} = useKeychain();

  return (
    <Container useSafeArea>
      <Loading loading={!!loading} text={loading} />
      <TopNavigationComponent title={'Open Wallet'} />
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={styles.content}
          enableOnAndroid
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          {walletsList.sort().map((el, index) => {
            return (
              <View
                style={[layoutStyles.responsiveColumnComponentWidth]}
                key={el}>
                <OptionCard
                  item={{text: el}}
                  index={index}
                  icon={'creditCard'}
                  selected={walletName}
                  onPress={() => {
                    read(el)
                      .then((password: string) => {
                        setLoading('Loading wallet...');
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
                            setLoading(undefined);
                            navigate('Wallet');
                          },
                        );
                      })
                      .catch((e: any) => {
                        setLoading(undefined);
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
