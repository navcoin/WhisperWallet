import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {
  Layout,
  StyleService,
  TopNavigation,
  useStyleSheet,
  useTheme,
} from '@tsejerome/ui-kitten-components';

import Container from '../../../components/Container';
import useWallet from '../../hooks/useWallet';
import Text from '../../../components/Text';

import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../navigation/type';
import {scale} from 'react-native-size-matters';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Gzip from 'rn-gzip';
import BottomSheetView from '../../../components/BottomSheetView';
import {SwipeButton} from '../../../components/SwipeButton';
import {useModal} from '../../hooks/useModal';
import {useBottomSheet} from '../../hooks/useBottomSheet';
import LoadingModalContent from '../../../components/Modals/LoadingModalContent';
import useSecurity from '../../hooks/useSecurity';
import useLayout from '../../hooks/useLayout';
import {QRreader} from 'react-native-qr-decode-image-camera';

const ScanQRScreen = (props: any) => {
  const {goBack} = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = useStyleSheet(themedStyles);
  const {ExecWrapperPromise, ExecWrapperSyncPromise, sendTransaction} =
    useWallet();
  const {readPassword} = useSecurity();
  const {collapse} = useBottomSheet();
  const [qrError, setQrError] = useState<string | undefined>(undefined);
  const theme = useTheme();
  const {width} = useLayout();

  const {openModal, closeModal} = useModal();
  const bottomSheet = useBottomSheet();

  const [loading, setLoading] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (loading) {
      openModal(<LoadingModalContent loading={!!loading} text={loading} />);
      return;
    }
    closeModal();
  }, [loading]);

  const AcceptOrder = useCallback((order: any) => {
    readPassword()
      .then(async spendingPassword => {
        setLoading('Creating transaction...');
        ExecWrapperPromise(
          'wallet.AcceptOrder',
          [order, spendingPassword].map(el => JSON.stringify(el)),
        )
          .then(tx => {
            setLoading(undefined);
            bottomSheet.expand(
              <BottomSheetView>
                <TopNavigation title="Accept order" />
                <Layout level="2" style={styles.card}>
                  <View style={styles.row}>
                    <Text category="headline" style={{marginRight: 16}}>
                      You pay:
                    </Text>
                    <Text
                      category="headline"
                      style={{flex: 1, flexWrap: 'wrap'}}>
                      {(order.pay[0].amount + tx.fee) / 1e8}{' '}
                      {!order.pay[0].tokenId ? 'xNAV' : order.pay[0].tokenId}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text category="headline" style={{marginRight: 16}}>
                      You receive:
                    </Text>
                    <Text
                      category="headline"
                      style={{flex: 1, flexWrap: 'wrap'}}>
                      Item #{order.receive[0].tokenNftId} of{' '}
                      {order.receive[0].tokenId.substring(0, 12)}...
                    </Text>
                  </View>
                </Layout>

                <SwipeButton
                  goBackToStart={true}
                  onComplete={() => {
                    setLoading('Broadcasting...');
                    sendTransaction(tx.tx).then(res => {
                      if (res.error) {
                        bottomSheet.expand(
                          <BottomSheetView>
                            <Text center style={{paddingBottom: 16}}>
                              Unable to send transaction
                            </Text>
                            <Text center style={{paddingBottom: 16}}>
                              {res.error.split('[')[0]}
                            </Text>
                          </BottomSheetView>,
                        );
                        setLoading(undefined);
                      } else {
                        setLoading(undefined);
                        collapse();
                        goBack();
                      }
                    });
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
  }, []);

  const processData = useCallback(async data => {
    let toParse = data.data;
    let type = 'navcoin';
    if (data.data.indexOf(':') > -1) {
      type = data.data.split(':')[0];
      toParse = data.data.split(':')[1];
    }
    if (type == 'navcoin') {
      if (
        !(await ExecWrapperSyncPromise(
          'bitcore.Address.isValid',
          [toParse].map(el => JSON.stringify(el)),
        ))
      ) {
        setQrError('Wrong address');
      } else {
        setQrError(undefined);
      }
    } else if (type == 'gzo') {
      try {
        let order = JSON.parse(Gzip.unzip(toParse));
        if (
          !(await ExecWrapperPromise(
            'wallet.VerifyOrder',
            [order].map(el => JSON.stringify(el)),
          ))
        ) {
          setQrError('The order is invalid');
        } else {
          AcceptOrder(order);
          setQrError(undefined);
        }
      } catch (e: any) {
        setQrError('Error: ' + e.message ? e.message : e.toString());
      }
    } else {
      setQrError('Unknown QR code');
    }
  }, []);

  useEffect(() => {
    if (props.route.params?.uri) {
      QRreader(props.route.params?.uri)
        .then(response => {
          if (!response) {
            setQrError('Could not find a QR code');
          } else {
            processData({data: response});
          }
        })
        .catch(e => {
          setQrError('Could not find a QR code: ' + e.toString());
        });
    }
  }, []);

  const qrScanner = useRef<QRCodeScanner | null>();

  return (
    <Container style={styles.container}>
      {props.route.params?.uri ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Scan a QR code</Text>
            {qrError && (
              <Text center style={{paddingTop: scale(24), color: 'red'}}>
                {qrError}
              </Text>
            )}
          </View>
          <View style={{height: width * 0.9, width: width * 0.9}}>
            <Image
              width={100}
              height={100}
              resizeMode={'cover'}
              source={{
                height: width * 0.9,
                width: width * 0.9,
                uri: props.route.params?.uri,
              }}
            />
          </View>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                goBack();
                setQrError('');
              }}>
              <Text>Go back</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <QRCodeScanner
          ref={node => {
            qrScanner.current = node;
          }}
          reactivate={false}
          showMarker={true}
          markerStyle={{borderColor: theme['color-staking']}}
          onRead={processData}
          topContent={
            <View>
              <Text>Scan a QR code</Text>
              {qrError && (
                <Text center style={{paddingTop: scale(24), color: 'red'}}>
                  {qrError}
                </Text>
              )}
            </View>
          }
          bottomContent={
            <>
              <TouchableOpacity
                onPress={() => {
                  setQrError('');
                  goBack();
                }}>
                <Text>Go back</Text>
              </TouchableOpacity>
            </>
          }
        />
      )}
    </Container>
  );
};

export default ScanQRScreen;

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  topTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    zIndex: 9999,
  },
  iconGrp: {
    flexDirection: 'row',
  },
  iconContainer: {
    backgroundColor: '#ff0000',
    padding: 12,
  },
  icon: {
    width: scale(18),
    height: scale(18),
    tintColor: '$icon-basic-color',
  },
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
