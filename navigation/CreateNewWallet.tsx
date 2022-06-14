import React, {useCallback, useEffect, useState} from 'react';
import {Alert, BackHandler, StyleSheet, View} from 'react-native';
import {Button, Input} from '@tsejerome/ui-kitten-components';
import {useNavigation} from '@react-navigation/native';
import Text from '../components/Text';
import Container from '../components/Container';
import AnimatedStep from '../components/AnimatedStep';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useWallet from '../src/hooks/useWallet';
import LoadingModalContent from '../components/Modals/LoadingModalContent';
import {NetworkTypes} from '../constants/Type';
import OptionCard from '../components/OptionCard';
import Mnemonic from '../components/Mnemonic';
import {layoutStyles} from '../utils/layout';
import TopNavigationComponent from '../components/TopNavigation';
import {scale, verticalScale} from 'react-native-size-matters';
import useSecurity from '../src/hooks/useSecurity';
import {useModal} from '../src/hooks/useModal';
import {errorTextParser, promptErrorToaster} from '../utils/errors';
import ErrorModalContent from '../components/Modals/ErrorModalContent';
import SkipMnemonicConfirmationModalContent from '../components/Modals/SkipMnemonicConfirmationModalContent';

function useArrayRef() {
  const refs = [];
  return [refs, el => el && refs.push(el)];
}

const CreateNewWallet = () => {
  const {navigate, goBack} = useNavigation();
  const [index, setIndex] = useState(0);
  const [walletName, setWalletName] = useState('');
  const {mnemonic, createWallet, walletsList} = useWallet();
  const [loading, setLoading] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');
  const [network, setNetwork] = useState('mainnet');
  const {readPassword, lockAfterBackground, setLockAfterBackground} =
    useSecurity();
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

  const skipMenmonicConfirmation = () => {
    openModal(
      <SkipMnemonicConfirmationModalContent
        skip={() => {
          setIndex(4);
        }}
      />,
    );
  };

  return (
    <Container useSafeArea>
      <TopNavigationComponent title={'New wallet'} pressBack={onBackPress} />
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
          </View>
          <View style={[styles.layout]}>
            {error ? (
              <Text style={{color: 'red', flex: 1}} center>
                {error}
              </Text>
            ) : (
              <></>
            )}
          </View>
          <View style={[styles.bottomButtonWrapper, {paddingTop: scale(24)}]}>
            <Button
              children="Continue"
              status={'primary-whisper'}
              style={styles.button}
              onPressOut={async () => {
                if (walletsList.indexOf(walletName) > -1) {
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
          {NetworkTypes.map((el, index_) => {
            return (
              <View
                style={[layoutStyles.responsiveColumnComponentWidth]}
                key={el[0]}>
                <OptionCard
                  key={el[0]}
                  id={el[0]}
                  item={{text: el[1]}}
                  index={index_}
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
                      openModal(<ErrorModalContent errorText={errorMsg} />);
                    });
                  });
              }}
            />
          </View>
        </View>
      ) : index == 2 ? (
        <View style={styles.container}>
          <KeyboardAwareScrollView
            contentContainerStyle={{flexGrow: 1}}
            enableOnAndroid
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}>
            <View style={{marginBottom: scale(90)}}>
              <Mnemonic mnemonic={mnemonic} />
            </View>
          </KeyboardAwareScrollView>
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
          <KeyboardAwareScrollView
            contentContainerStyle={{flexGrow: 1}}
            enableOnAndroid
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}>
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
                        if (elements[wordpos + 1]) {
                          elements[wordpos + 1].focus();
                        }
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
          </KeyboardAwareScrollView>
          {error ? (
            <Text style={{color: 'red', flex: 1, marginTop: scale(16)}} center>
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
                skipMenmonicConfirmation();
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
              onPressOut={async () => {
                if (
                  !(
                    lockAfterBackground === true ||
                    lockAfterBackground === false
                  )
                ) {
                  Alert.alert(
                    'Security',
                    'Do you want to lock the wallet when it goes to background?',
                    [
                      {
                        text: 'Yes',
                        onPress: async () => {
                          setLockAfterBackground(true);
                          navigate('MainWalletScreen');
                        },
                      },
                      {
                        text: 'No',
                        onPress: async () => {
                          setLockAfterBackground(false);
                          navigate('MainWalletScreen');
                        },
                      },
                    ],
                  );
                } else {
                  navigate('MainWalletScreen');
                }
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
    marginBottom: scale(24),
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
  animatedStep: {},
  layout: {
    marginBottom: verticalScale(24),
  },
  button: {
    marginTop: verticalScale(32),
    flex: 1,
  },
});
