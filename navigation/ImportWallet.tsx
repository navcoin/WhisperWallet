import React, {memo, useState, useEffect, useCallback} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {
  Button,
  IndexPath,
  Input,
  Select,
  SelectItem,
  Tab,
  TabBar,
  TopNavigation,
  useTheme,
} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';

import Text from '../components/Text';
import Container from '../components/Container';
import AnimatedStep from '../components/AnimatedStep';
import NavigationAction from '../components/NavigationAction';
import {SceneMap, TabView} from 'react-native-tab-view';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useLayout from '../hooks/useLayout';
import useWallet from '../hooks/useWallet';
import Loading from '../components/Loading';
import useNjs from '../hooks/useNjs';
import useWin from '../hooks/useWin';
import {IsValidMnemonic} from '../utils/Mnemonic';
import Card from '../components/Card';
import OptionCard from '../components/OptionCard';
import {NetworkTypes, WalletTypes} from '../constants/Type';
import useKeychain from '../utils/Keychain';

const ImportWallet = () => {
  const {goBack, navigate} = useNavigation();
  const theme = useTheme();
  const {width, bottom} = useLayout();
  const [index, setIndex] = useState(0);
  const [walletName, setWalletName] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [network, setNetwork] = useState('mainnet');
  const [type, setType] = useState('');
  const {createWallet} = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {njs} = useNjs();
  const {read} = useKeychain();

  let words = [];

  return (
    <Container useSafeArea>
      <Loading loading={loading} />
      <Text category="title1" center marginTop={32}>
        Import wallet
      </Text>
      <AnimatedStep style={styles.animatedStep} step={index} />

      <View style={styles.container}>
        {index === 0 ? (
          <KeyboardAwareScrollView
            style={styles.content}
            enableOnAndroid
            showsVerticalScrollIndicator={false}>
            <Text category="title4" center marginBottom={32}>
              Choose the wallet type
            </Text>

            {WalletTypes.map((el, index) => {
              return (
                <OptionCard
                  item={{text: el[1]}}
                  index={index}
                  icon={'creditCard'}
                  onPress={() => {
                    setType(el[0]);
                    setIndex(1);
                  }}
                />
              );
            })}
          </KeyboardAwareScrollView>
        ) : index === 1 ? (
          <KeyboardAwareScrollView>
            <Text center style={{marginHorizontal: 12, marginBottom: 24}}>
              Type the recovery words.
            </Text>
            <View style={styles.layout}>
              <Input
                multiline={true}
                numberOfLines={3}
                autoFocus={true}
                style={styles.flex1}
                onChangeText={(m: string) => {
                  setMnemonic(m.toLowerCase());
                }}
              />
            </View>
            {error ? (
              <Text style={{color: 'red', flex: 1}} center>
                {error}
              </Text>
            ) : (
              <></>
            )}
            <View style={styles.layout}>
              <Button
                status={'control'}
                children="Next"
                style={styles.button}
                onPress={() => {
                  if (IsValidMnemonic(mnemonic, type)) {
                    setError('');
                    setIndex(2);
                  } else {
                    setError('Invalid mnemonic');
                  }
                }}
              />
            </View>
          </KeyboardAwareScrollView>
        ) : index === 2 ? (
          <KeyboardAwareScrollView
            style={styles.content}
            enableOnAndroid
            showsVerticalScrollIndicator={false}>
            <Text category="title4" center marginBottom={32}>
              Choose the network
            </Text>

            {NetworkTypes.map((el, index) => {
              return (
                <OptionCard
                  key={el[0]}
                  item={{text: el[1]}}
                  index={index}
                  icon={'creditCard'}
                  onPress={() => {
                    setNetwork(el[0]);
                    setIndex(3);
                  }}
                />
              );
            })}
          </KeyboardAwareScrollView>
        ) : index === 3 ? (
          <KeyboardAwareScrollView
            style={styles.content}
            enableOnAndroid
            showsVerticalScrollIndicator={false}>
            <Text category="title4" center marginBottom={32}>
              Choose a name for the wallet
            </Text>
            <View style={styles.layout}>
              <Input
                autoFocus={true}
                style={styles.flex1}
                onChangeText={(name: string) => {
                  setError('');
                  setWalletName(name);
                }}
              />
            </View>
            {error ? (
              <Text style={{color: 'red', flex: 1}} center>
                {error}
              </Text>
            ) : (
              <></>
            )}
            <Button
              children="Next"
              status={'control'}
              style={styles.button}
              onPressOut={async () => {
                const walletList = await njs.wallet.WalletFile.ListWallets();
                if (walletList.indexOf(walletName) > -1) {
                  setError('There is already a wallet with that name.');
                } else if (walletName) {
                  setLoading(true);
                  read(walletName)
                    .then((password: string) => {
                      createWallet(
                        walletName,
                        mnemonic,
                        type,
                        password,
                        password,
                        false,
                        true,
                        network,
                        () => {
                          setLoading(false);
                          setIndex(3);
                        },
                      );
                    })
                    .catch((e: any) => {
                      setLoading(false);
                    });
                }
              }}
            />
          </KeyboardAwareScrollView>
        ) : index == 3 ? (
          <KeyboardAwareScrollView>
            <Text center key={'title'}>
              Congratulations!
            </Text>
            <Text center key={'text'}>
              {'\n'}
              You can now start using NavCash.
            </Text>
            <Button
              status={'control'}
              children="Finish"
              style={styles.button}
              onPress={() => {
                navigate('Wallet');
              }}
            />
          </KeyboardAwareScrollView>
        ) : (
          <Text center>Wrong option</Text>
        )}
      </View>
    </Container>
  );
};

export default ImportWallet;

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
    marginHorizontal: 24,
  },
  button: {
    marginTop: 24,
    marginHorizontal: 12,
    flex: 1,
  },
});
