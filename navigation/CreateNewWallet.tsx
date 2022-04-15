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
import {NetworkTypes} from '../constants/Type';
import OptionCard from '../components/OptionCard';
import useKeychain from '../utils/Keychain';
import Mnemonic from '../components/Mnemonic';

const CreateNewWallet = () => {
  const {goBack, navigate} = useNavigation();
  const theme = useTheme();
  const {width, bottom} = useLayout();
  const [index, setIndex] = useState(0);
  const [walletName, setWalletName] = useState('');
  const {mnemonic, createWallet} = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [network, setNetwork] = useState('mainnet');
  const {njs} = useNjs();
  const {read} = useKeychain();

  const [words, setWords] = useState([]);

  return (
    <Container useSafeArea>
      <Loading loading={loading} />
      <Text category="title1" center marginTop={32}>
        New wallet
      </Text>
      <AnimatedStep style={styles.animatedStep} step={index} steps={5} />

      {index == 0 ? (
        <View style={styles.container}>
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
                value={walletName}
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
          </KeyboardAwareScrollView>
          <View style={{flexDirection: 'row', marginBottom: 24}}>
            <Button
              children="Next"
              status={'control'}
              style={styles.button}
              onPressOut={async () => {
                const walletList = await njs.wallet.WalletFile.ListWallets();
                if (walletList.indexOf(walletName) > -1) {
                  setError('There is already a wallet with that name.');
                } else if (walletName) {
                  setIndex(1);
                }
              }}
            />
          </View>
        </View>
      ) : index == 1 ? (
        <View style={styles.container}>
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
                  id={el[0]}
                  item={{text: el[1]}}
                  index={index}
                  selected={network}
                  onPress={() => {
                    setNetwork(el[0]);
                  }}
                  icon={'creditCard'}
                />
              );
            })}
          </KeyboardAwareScrollView>
          <View style={{flexDirection: 'row', marginBottom: 24}}>
            <Button
              children="Next"
              status={'control'}
              style={styles.button}
              onPressOut={() => {
                setLoading(true);
                read(walletName)
                  .then((password: string) => {
                    createWallet(
                      walletName,
                      '',
                      '',
                      password,
                      password,
                      false,
                      true,
                      network,
                      () => {
                        setLoading(false);
                        setIndex(2);
                      },
                    );
                  })
                  .catch((e: any) => {
                    console.log(e);
                    setLoading(false);
                  });
              }}
            />
          </View>
        </View>
      ) : index == 2 ? (
        <View style={styles.container}>
          <Mnemonic mnemonic={mnemonic} />
          <View style={{flexDirection: 'row', marginBottom: 24}}>
            <Button
              children="Next"
              status={'control'}
              style={styles.button}
              onPressOut={() => setIndex(3)}
            />
          </View>
        </View>
      ) : index == 3 ? (
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <Text center style={{marginHorizontal: 12}}>
              Confirm the words:
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 16,
              }}>
              {mnemonic.split(' ').map((word, wordpos) => {
                return (
                  <View style={styles.boxConfirm} key={word + wordpos}>
                    <Text
                      category="label"
                      status="white"
                      center
                      style={{color: 'gray'}}
                      key={'pos' + wordpos}>
                      {wordpos + 1}
                    </Text>
                    <Input
                      key={'word' + wordpos}
                      style={{width: 120, padding: 0}}
                      autoCapitalize="none"
                      value={words[wordpos]}
                      onChangeText={(name: string) => {
                        setWords((prev) => prev[wordpos] = name.toLowerCase());
                      }}
                    />
                  </View>
                );
              })}
            </View>
            {error ? (
              <Text style={{color: 'red', flex: 1, marginTop: 16}} center>
                {error}
              </Text>
            ) : (
              <></>
            )}
          </KeyboardAwareScrollView>
          <View style={{flexDirection: 'row', marginBottom: 24}}>
            <Button
              children="Back"
              status={'control'}
              style={styles.button}
              onPress={() => {
                setError('');
                setIndex(2);
              }}
            />
            <Button
              children="Skip"
              style={styles.button}
              status={'control'}
              onPress={() => {
                setIndex(4);
              }}
            />
            <Button
              children="Next"
              status={'control'}
              style={styles.button}
              onPressOut={() => {
                if (words.join(' ') == mnemonic) {
                  setError('');
                  setIndex(4);
                } else {
                  setError('Wrong mnemonic.');
                }
              }}
            />
          </View>
        </View>
      ) : index == 4 ? (
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <Text center key={'title'}>
              Congratulations!
            </Text>
            <Text center key={'text'}>
              {'\n'}
              You can now start using NavCash.
            </Text>
          </KeyboardAwareScrollView>
          <View style={{flexDirection: 'row', marginBottom: 24}}>
            <Button
              children="Next"
              status={'control'}
              style={styles.button}
              onPressOut={() => {
                navigate('Wallet');
              }}
            />
          </View>
        </View>
      ) : (
        <Text center>Wrong option</Text>
      )}
    </Container>
  );
};

export default CreateNewWallet;

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
    marginTop: 32,
    marginHorizontal: 24,
    flex: 1,
  },
});
