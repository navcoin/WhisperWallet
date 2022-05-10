import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, StyleSheet, View, Platform} from 'react-native';
import {Button, Input} from '@tsejerome/ui-kitten-components';
import {useNavigation} from '@react-navigation/native';

import Text from '../components/Text';
import Container from '../components/Container';
import AnimatedStep from '../components/AnimatedStep';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useWallet from '../hooks/useWallet';
import LoadingModalContent from '../components/Modals/LoadingModalContent';
import {IsValidMnemonic} from '../utils/Mnemonic';
import OptionCard from '../components/OptionCard';
import {NetworkTypes, WalletTypes} from '../constants/Type';
import {layoutStyles} from '../utils/layout';
import TopNavigationComponent from '../components/TopNavigation';
import {scale, verticalScale} from 'react-native-size-matters';
import useSecurity from '../hooks/useSecurity';
import {useModal} from '../hooks/useModal';
import {errorTextParser, promptErrorToaster} from '../utils/errors';
import ErrorModalContent from '../components/Modals/ErrorModalContent';

const ImportWallet = () => {
  const {navigate, goBack} = useNavigation();
  const [index, setIndex] = useState(0);
  const [walletName, setWalletName] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [network, setNetwork] = useState('mainnet');
  const [type, setType] = useState('');
  const {createWallet} = useWallet();
  const [loading, setLoading] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');
  const {walletsList} = useWallet();
  const {readPassword} = useSecurity();
  const {openModal, closeModal} = useModal();

  useEffect(() => {
    if (loading) {
      openModal(<LoadingModalContent loading={!!loading} text={loading} />);
      return;
    }
    closeModal();
  }, [loading]);

  const onBackPress = useCallback(() => {
    if (index == 0) {
      goBack();
    } else {
      setIndex(index - 1);
    }
    return true;
  }, [index]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  return (
    <Container useSafeArea>
      <TopNavigationComponent title={'Import wallet'} pressBack={onBackPress} />
      <AnimatedStep style={styles.animatedStep} step={index} />

      <View style={styles.container}>
        {index === 0 ? (
          <KeyboardAwareScrollView
            style={styles.content}
            enableOnAndroid
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}>
            <Text category="title4" center marginBottom={32}>
              Choose the wallet type
            </Text>

            {WalletTypes.map((el, index) => {
              return (
                <View
                  style={[layoutStyles.responsiveColumnComponentWidth]}
                  key={el[1]}>
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
                autoCapitalize={'none'}
                multiline={true}
                keyboardType={
                  // Platform.OS === 'ios' ? 'default' : 'visible-password'
                  Platform.OS === 'ios' ? 'default' : 'email-address'
                }
                numberOfLines={3}
                autoFocus={true}
                style={[styles.flex1, {height: scale(100), color: 'black'}]}
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
                status={'primary-whisper'}
                children="Continue"
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
            keyboardShouldPersistTaps="always"
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
            keyboardShouldPersistTaps="always"
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
              children="Continue"
              status={'primary-whisper'}
              style={styles.button}
              onPressOut={async () => {
                if (walletsList.indexOf(walletName) > -1) {
                  setError('There is already a wallet with that name.');
                } else if (walletName) {
                  readPassword()
                    .then((password: string) => {
                      setLoading('Creating wallet keys...');
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
                          setLoading(undefined);
                          setIndex(4);
                        },
                      );
                    })
                    .catch((e: any) => {
                      setLoading(undefined);
                      promptErrorToaster(e.toString(), false, false, () => {
                        const errorMsg = errorTextParser(e.toString(), false);
                        openModal(
                          <ErrorModalContent
                            errorText={errorMsg}></ErrorModalContent>,
                        );
                      });
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
              You can now start using Whisper.
            </Text>
            <Button
              status={'primary-whisper'}
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
    marginTop: verticalScale(32),
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
    marginVertical: verticalScale(20),
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
  },
  layout: {
    flexDirection: 'row',
    marginBottom: verticalScale(24),
    paddingHorizontal: scale(24),
  },
  button: {
    marginTop: verticalScale(24),
    marginHorizontal: scale(24),
    flex: 1,
  },
});
