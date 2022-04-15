import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Input, useTheme} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';

import Text from '../components/Text';
import Container from '../components/Container';
import AnimatedStep from '../components/AnimatedStep';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useLayout from '../hooks/useLayout';
import useWallet from '../hooks/useWallet';
import Loading from '../components/Loading';
import useNjs from '../hooks/useNjs';
import {IsValidMnemonic} from '../utils/Mnemonic';
import OptionCard from '../components/OptionCard';
import {NetworkTypes, WalletTypes} from '../constants/Type';
import useKeychain from '../utils/Keychain';
import {layoutStyles} from '../utils/layout';
import TopNavigationComponent from '../components/TopNavigation';
import {scale} from 'react-native-size-matters';

const ImportWallet = () => {
  const {goBack, navigate} = useNavigation();
  const theme = useTheme();
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

  return (
    <Container useSafeArea>
      <Loading loading={loading} />
      <TopNavigationComponent title={'Import Wallet'} />
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
                <View style={[layoutStyles.responsiveColumnComponentWidth]}>
                  <OptionCard
                    item={{text: el[1]}}
                    index={index}
                    icon={'creditCard'}
                    onPress={() => {
                      setType(el[0]);
                      setIndex(1);
                    }}
                  />
                </View>
              );
            })}
          </KeyboardAwareScrollView>
        ) : index === 1 ? (
          <View>
            <Text
              center
              style={{marginHorizontal: scale(12), marginBottom: scale(24)}}>
              Type the recovery words.
            </Text>
            <View
              style={[
                layoutStyles.responsiveColumnComponentWidth,
                styles.layout,
              ]}>
              <Input
                multiline={true}
                numberOfLines={3}
                autoFocus={true}
                style={styles.flex1}
                value={mnemonic}
                onChangeText={(m: string) => {
                  setMnemonic(m.toLowerCase());
                }}
              />
            </View>
            {error ? (
              <Text style={{color: 'red'}} center>
                {error}
              </Text>
            ) : (
              <></>
            )}
            <View style={[layoutStyles.responsiveRowComponentWidth]}>
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
          </View>
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
                          setIndex(4);
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
        ) : index === 4 ? (
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
    marginTop: scale(32),
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  tabBar: {
    marginHorizontal: scale(80),
  },
  bottom: {
    position: 'absolute',
    bottom: scale(0),
    width: '100%',
  },
  topNav: {
    marginHorizontal: scale(12),
  },
  input01: {
    flex: 1,
    marginRight: scale(16),
  },
  inputPhone: {
    marginVertical: scale(20),
  },
  content: {
    marginHorizontal: scale(24),
  },
  flexRow: {
    flexDirection: 'row',
  },
  box: {
    borderRadius: scale(12),
    padding: scale(16),
    width: scale(120),
  },
  boxConfirm: {
    margin: scale(4),
    width: scale(120),
  },
  boxWord: {
    borderRadius: scale(16),
    margin: scale(4),
    padding: scale(16),
    width: scale(120),
  },
  animatedStep: {
    marginTop: scale(28),
  },
  layout: {
    flexDirection: 'row',
    marginBottom: scale(24),
    paddingHorizontal: scale(24),
  },
  button: {
    marginTop: scale(24),
    marginHorizontal: scale(24),
    flex: 1,
  },
});
