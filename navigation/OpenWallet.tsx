import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Icon, Input, useTheme} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';

import Text from '../components/Text';
import Container from '../components/Container';
import useLayout from '../hooks/useLayout';
import useWallet from '../hooks/useWallet';
import Loading from '../components/Loading';
import useNjs from '../hooks/useNjs';
import {Picker} from '@react-native-picker/picker';
import {Animation_Types_Enum, NetworkTypes} from '../constants/Type';
import OptionCard from '../components/OptionCard';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useKeychain from '../utils/Keychain';

const OpenWallet = () => {
  const {goBack, navigate} = useNavigation();
  const theme = useTheme();
  const [walletName, setWalletName] = useState('');
  const {createWallet} = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {njs} = useNjs();
  const {read} = useKeychain();
  const [resync, setResync] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [walletList, setWalletList] = useState<any>([]);

  useEffect(() => {
    njs.wallet.WalletFile.ListWallets().then(list => {
      setWalletList(list);
    });
  }, []);

  return (
    <Container useSafeArea>
      <Loading loading={loading}></Loading>
      <Text category="title1" center marginTop={32}>
        Open wallet
      </Text>

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
              <OptionCard
                key={el}
                item={{text: el}}
                index={index}
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
                        resync,
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
                }}></OptionCard>
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

        <View style={[styles.contentBottom]}>
          <View
            onTouchEnd={() => {
              setShowOptions(!showOptions);
            }}>
            <Icon
              pack="assets"
              name={showOptions ? 'downArr' : 'upArr'}
              style={[
                styles.icon,
                {
                  alignSelf: 'center',
                  marginBottom: 24,
                  tintColor: theme['icon-basic-color'],
                },
              ]}
            />
            <Text category="title4" center marginBottom={16}>
              Options
            </Text>
          </View>
          {showOptions && (
            <OptionCard
              animation={Animation_Types_Enum.SlideBottom}
              key={'resync'}
              id={'resync'}
              item={{text: 'Clear history and resync'}}
              index={0}
              icon={resync == true ? 'check' : 'none'}
              selected={resync == true ? 'Clear history and resync' : ''}
              onPress={() => {
                setResync(!resync);
              }}
            />
          )}
        </View>
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
  contentBottom: {
    marginHorizontal: 24,
  },
  content: {
    marginHorizontal: 24,
    marginBottom: 24,
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
  icon: {
    width: 16,
    height: 16,
  },
});
