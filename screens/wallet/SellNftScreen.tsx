import useWallet from '../../hooks/useWallet';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Button,
  Input,
  Layout,
  TopNavigation,
} from '@tsejerome/ui-kitten-components';
import Container from '../../components/Container';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Destination_Types_Enum} from '../../constants/Type';
import Text from '../../components/Text';
import {RootStackParamList} from '../../navigation/type';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TopNavigationComponent from '../../components/TopNavigation';
import useSecurity from '../../hooks/useSecurity';
import BottomSheetView from '../../components/BottomSheetView';
import {SwipeButton} from '../../components/SwipeButton';
import {useBottomSheet} from '../../hooks/useBottomSheet';
import {useModal} from '../../hooks/useModal';
import LoadingModalContent from '../../components/Modals/LoadingModalContent';
import QRCode from 'react-native-qrcode-svg';
import Gzip from 'rn-gzip';
import useLayout from '../../hooks/useLayout';
import Share from 'react-native-share';
import {scale} from 'react-native-size-matters';

const SellNftScreen = (props: any) => {
  const {CreateSellOrder, parsedAddresses} = useWallet();
  const {readPassword} = useSecurity();

  const {goBack} = useNavigation<NavigationProp<RootStackParamList>>();
  const {width} = useLayout();
  const {openModal, closeModal} = useModal();
  const bottomSheet = useBottomSheet();

  const nftCollection = props.route.params.from;
  const nftId = props.route.params.nftId;

  const [error, setError] = useState('');
  const [loading, setLoading] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (loading) {
      openModal(<LoadingModalContent loading={!!loading} text={loading} />);
      return;
    }
    closeModal();
  }, [loading]);

  const amountInputRef = useRef<Input>();
  const [price, setPrice] = useState<string>('');

  const [destination, setDestination] = useState<string>('');

  useEffect(() => {
    setDestination(
      parsedAddresses.filter(
        el => el.type_id == Destination_Types_Enum.PrivateWallet,
      )[0]?.address,
    );
  }, []);

  const qrCode = useRef<QRCode>();

  const createSellOrder = useCallback(async () => {
    if (!price) {
      setError('Please fill the price details.');
      return;
    }

    setError('');

    readPassword()
      .then(async spendingPassword => {
        setLoading('Creating transaction...');
        CreateSellOrder(
          nftCollection.tokenId,
          nftId,
          destination,
          parseFloat(price) * 1e8,
          spendingPassword,
        )
          .then(tx => {
            setLoading(undefined);
            bottomSheet.expand(
              <BottomSheetView>
                <TopNavigation title="Confirm sell order" />
                <Layout level="2" style={styles.card}>
                  <View style={styles.row}>
                    <Text category="headline" style={{marginRight: 16}}>
                      Collection:
                    </Text>
                    <Text
                      category="headline"
                      style={{flex: 1, flexWrap: 'wrap'}}>
                      {nftCollection.name}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text category="headline" style={{marginRight: 16}}>
                      Item:
                    </Text>
                    <Text
                      category="headline"
                      style={{flex: 1, flexWrap: 'wrap'}}>
                      #{nftId}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text category="headline" style={{marginRight: 16}}>
                      Price:
                    </Text>
                    <Text
                      category="headline"
                      style={{flex: 1, flexWrap: 'wrap'}}>
                      {price} xNAV
                    </Text>
                  </View>
                </Layout>

                <SwipeButton
                  goBackToStart={true}
                  onComplete={() => {
                    bottomSheet.expand(
                      <BottomSheetView>
                        <Text
                          center
                          category={'title4'}
                          style={{marginBottom: scale(24)}}>
                          Share the following QR code with your buyer:
                        </Text>
                        <QRCode
                          getRef={r => {
                            qrCode.current = r;
                          }}
                          quietZone={10}
                          value={'gzo:' + Gzip.zip(JSON.stringify(tx))}
                          size={width * 0.9}
                        />
                        <Button
                          style={{marginTop: 24}}
                          status={'primary-whisper'}
                          children={'Share'}
                          onPress={() => {
                            if (qrCode.current) {
                              qrCode.current?.toDataURL(base => {
                                Share.open({
                                  url: 'data:image/svg+xml;base64,' + base,
                                })
                                  .then(res => {
                                    bottomSheet.collapse();
                                    goBack();
                                  })
                                  .catch(err => {
                                    setError(err.toString());
                                    bottomSheet.collapse();
                                    err && console.log(err);
                                  });
                              });
                            }
                          }}
                        />
                      </BottomSheetView>,
                    );
                  }}
                  title="Swipe to confirm"
                />
              </BottomSheetView>,
            );
          })
          .catch(e => {
            console.log(e.stack);
            bottomSheet.expand(
              <BottomSheetView>
                <Text center style={{paddingBottom: 16}}>
                  Unable to create sell order
                </Text>
                <Text center style={{paddingBottom: 16}}>
                  {e.message}
                </Text>
              </BottomSheetView>,
            );
            setLoading(undefined);
          });
      })
      .catch(e => {
        setLoading(undefined);

        bottomSheet.expand(
          <BottomSheetView>
            <Text center style={{paddingBottom: 16}}>
              Unable to create sell order
            </Text>
            <Text center style={{paddingBottom: 16}}>
              {e.message}
            </Text>
          </BottomSheetView>,
        );
      });
  }, [qrCode, price]);

  return (
    <Container useSafeArea>
      <KeyboardAwareScrollView>
        <TopNavigationComponent title={'Create a NFT sell order'} />

        <Layout level="2" style={styles.inputCard}>
          <View style={styles.inputGroup}>
            <Text category="headline" style={[styles.inputTitle]}>
              Collection:
            </Text>
            <Text category="headline" style={[styles.inputTitle]}>
              {nftCollection.name}
            </Text>
          </View>
          <View style={styles.inputGroup}>
            <Text category="headline" style={[styles.inputTitle]}>
              Item:
            </Text>
            <Text category="headline" style={[styles.inputTitle]}>
              #{nftId}
            </Text>
          </View>
          <View style={styles.inputGroup}>
            <Text category="headline" style={[styles.inputTitle]}>
              Price:
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 15,
              }}>
              <Input
                ref={amountInputRef}
                keyboardType={'decimal-pad'}
                returnKeyType={'done'}
                status={'transparent'}
                value={price}
                placeholder={'0'}
                onChangeText={(text: string) => {
                  let t = 0;
                  let res = text.replace(/\./g, match =>
                    ++t === 2 ? '' : match,
                  );
                  setPrice(res.trim().replace(',', '.'));
                }}
              />
              <Text style={{marginBottom: 2, marginLeft: -10}}>xNAV</Text>
            </View>
          </View>
          <Button
            status={'primary-whisper'}
            onPress={() => {
              createSellOrder();
            }}>
            {'Create sell order'}
          </Button>
          {error ? (
            <Text style={[styles.errorText]} center>
              {error}
            </Text>
          ) : (
            <></>
          )}
        </Layout>
      </KeyboardAwareScrollView>
    </Container>
  );
};
export default SellNftScreen;

const styles = StyleSheet.create({
  inputCard: {
    borderRadius: 12,
    marginHorizontal: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputField: {
    flex: 1,
    flexWrap: 'wrap',
  },
  inputTitle: {
    marginRight: 16,
  },
  errorText: {color: 'red', flex: 1, marginTop: 24},
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 16,
    marginBotton: 24,
    flex: 1,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
