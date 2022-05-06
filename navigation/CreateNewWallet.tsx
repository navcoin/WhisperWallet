import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {Button, Input} from '@tsejerome/ui-kitten-components';
import {useNavigation} from '@react-navigation/native';
import Text from '../components/Text';
import Container from '../components/Container';
import AnimatedStep from '../components/AnimatedStep';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useWallet from '../hooks/useWallet';
import LoadingModalContent from '../components/LoadingModalContent';
import useNjs from '../hooks/useNjs';
import {NetworkTypes} from '../constants/Type';
import OptionCard from '../components/OptionCard';
import Mnemonic from '../components/Mnemonic';
import {layoutStyles} from '../utils/layout';
import TopNavigationComponent from '../components/TopNavigation';
import {scale, verticalScale} from 'react-native-size-matters';
import useSecurity from '../hooks/useSecurity';
import {useModal} from '../hooks/useModal';
import {errorTextParser, promptErrorToaster} from '../utils/errors';
import ErrorModalContent from '../components/ErrorModalContent';

function useArrayRef() {
  const refs = [];
  return [refs, el => el && refs.push(el)];
}

const CreateNewWallet = () => {
  const {navigate, goBack} = useNavigation();
  const [index, setIndex] = useState(0);
  const [walletName, setWalletName] = useState('');
  const {mnemonic, createWallet} = useWallet();
  const [loading, setLoading] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');
  const [network, setNetwork] = useState('mainnet');
  const {njs} = useNjs();
  const {readPassword} = useSecurity();
  const [elements, ref] = useArrayRef();
  const {openModal, closeModal} = useModal();
  const [words, setWords] = useState<string[]>(new Array(12));

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

  useEffect(() => {
    if (loading) {
      openModal(<LoadingModalContent loading={!!loading} text={loading} />);
      return;
    }
    closeModal();
  }, [loading]);
  return (
    <Container useSafeArea>
      <TopNavigationComponent title={'New wallet'} pressBack={onBackPress} />
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <AnimatedStep style={styles.animatedStep} step={index} steps={5} />

        {index == 0 ? (
          <View style={[styles.container, styles.horizontalPadding24]}>
            <Text category="title4" center marginBottom={32}>
              Choose a name
            </Text>
            <View style={[styles.layout]}>
              <Input
                autoFocus={true}
                style={[layoutStyles.responsiveRowComponentWidth, styles.flex1]}
                value={walletName}
                autoCapitalize="none"
                onChangeText={(name: string) => {
                  setError('');
                  setWalletName(name.trim());
                }}
              />
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
          <View style={[styles.container, styles.horizontalPadding24]}>
            <Text category="title4" center marginBottom={32}>
              Choose the network
            </Text>
            {NetworkTypes.map((el, index) => {
              return (
                <View
                  style={[layoutStyles.responsiveColumnComponentWidth]}
                  key={el[0]}>
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
                </View>
              );
            })}
            <View
              style={[
                layoutStyles.responsiveRowComponentWidth,
                styles.bottomButtonWrapper,
              ]}>
              <Button
                children="Continue"
                status={'primary-whisper'}
                style={styles.button}
                onPressOut={() => {
                  readPassword()
                    .then((password: string) => {
                      setLoading('Creating wallet keys...');
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
                          setLoading(undefined);
                          setIndex(2);
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
                }}
              />
            </View>
          </View>
        ) : index == 2 ? (
          <View style={styles.container}>
            <View style={{marginBottom: scale(90)}}>
              <Mnemonic mnemonic={mnemonic} />
            </View>
            <View
              style={[styles.bottomButtonWrapper, styles.horizontalPadding24]}>
              <Button
                children="Continue"
                status={'primary-whisper'}
                style={styles.button}
                onPressOut={() => setIndex(3)}
              />
            </View>
          </View>
        ) : index == 3 ? (
          <View style={styles.container}>
            <Text
              center
              category={'footnote'}
              style={{marginHorizontal: scale(12)}}>
              Confirm the words:
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: scale(16),
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
                      ref={ref}
                      textAlign={'center'}
                      key={'word' + wordpos}
                      size="small"
                      style={{width: scale(120), padding: 0}}
                      autoCapitalize="none"
                      value={words[wordpos]}
                      onSubmitEditing={() => {
                        if (elements[wordpos + 1])
                          elements[wordpos + 1].focus();
                      }}
                      onChangeText={(name: string) => {
                        let newWords = [...words];
                        newWords[wordpos] = name.toLowerCase();
                        setWords(newWords);
                      }}
                    />
                  </View>
                );
              })}
            </View>
            {error ? (
              <Text
                style={{color: 'red', flex: 1, marginTop: scale(16)}}
                center>
                {error}
              </Text>
            ) : (
              <></>
            )}
            <View
              style={[styles.bottomButtonWrapper, styles.horizontalPadding24]}>
              <Button
                children="Skip"
                style={[styles.button, {marginRight: scale(20)}]}
                status={'primary-whisper'}
                onPress={() => {
                  setIndex(4);
                }}
              />
              <Button
                children="Continue"
                status={'primary-whisper'}
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
            <Text center key={'title'}>
              Congratulations!
            </Text>
            <Text center key={'text'}>
              {'\n'}
              You can now start using Whisper.
            </Text>
            <View
              style={[styles.bottomButtonWrapper, styles.horizontalPadding24]}>
              <Button
                children="Continue"
                status={'primary-whisper'}
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
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default CreateNewWallet;

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
    bottom: 0,
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
  bottomButtonWrapper: {
    flexDirection: 'row',
    bottom: scale(24),
    position: 'absolute',
  },
  horizontalPadding24: {marginHorizontal: scale(24)},
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
    marginBottom: verticalScale(24),
  },
  button: {
    marginTop: verticalScale(32),
    flex: 1,
  },
});
