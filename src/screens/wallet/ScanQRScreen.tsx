import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import {
  Layout,
  TopNavigation,
  useStyleSheet,
  useTheme,
} from '@tsejerome/ui-kitten-components';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  Container,
  Text,
  SwipeButton,
  BottomSheetView,
  LoadingModalContent,
} from '@components';
import {
  useWallet,
  useModal,
  useBottomSheet,
  useSecurity,
  useLayout,
} from '@hooks';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/type';
import Gzip from 'rn-gzip';
import { QRreader } from 'react-native-qr-decode-image-camera';
import { scanQrStyles } from './styles';

const ScanQRScreen = (props: any) => {
  const { goBack } = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = useStyleSheet(scanQrStyles);
  const {
    ExecWrapperPromise,
    ExecWrapperSyncPromise,
    sendTransaction,
    network,
  } = useWallet();
  const { readPassword } = useSecurity();
  const { collapse } = useBottomSheet();
  const [qrError, setQrError] = useState<string | undefined>(undefined);
  const theme = useTheme();
  const { width } = useLayout();

  const { openModal, closeModal } = useModal();
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
            setLoading(false);
            bottomSheet.expand(
              <BottomSheetView>
                <TopNavigation title="Accept order" />
                <Layout level="2" style={styles.card}>
                  <View style={styles.row}>
                    <Text category="headline" style={styles.marginRight16}>
                      You pay:
                    </Text>
                    <Text
                      category="headline"
                      style={styles.flexWrap}>
                      {(order.pay[0].amount + tx.fee) / 1e8}{' '}
                      {!order.pay[0].tokenId ? 'xNAV' : order.pay[0].tokenId}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text category="headline" style={styles.marginRight16}>
                      You receive:
                    </Text>
                    <Text
                      category="headline"
                      style={styles.flexWrap}>
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
                            <Text center style={styles.paddingBottom16}>
                              Unable to send transaction
                            </Text>
                            <Text center style={styles.paddingBottom16}>
                              {res.error.split('[')[0]}
                            </Text>
                          </BottomSheetView>,
                        );
                        setLoading(false);
                      } else {
                        setLoading(false);
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
                <Text center style={styles.paddingBottom16}>
                  Unable to create sell order
                </Text>
                <Text center style={styles.paddingBottom16}>
                  {e.message}
                </Text>
              </BottomSheetView>,
            );
            setLoading(false);
          });
      })
      .catch(e => {
        setLoading(false);

        bottomSheet.expand(
          <BottomSheetView>
            <Text center style={styles.paddingBottom16}>
              Unable to create sell order
            </Text>
            <Text center style={styles.paddingBottom16}>
              {e.message}
            </Text>
          </BottomSheetView>,
        );
      });
  }, []);

  const processData = useCallback(async data => {
    console.log(data.data);
    let toParse = data.data;
    let type = 'navcoin';
    if (data.data.indexOf(':') > -1) {
      type = data.data.split(':')[0];
      toParse = data.data.split(':')[1];
    }
    if (type == 'navcoin') {
      if (
        !(await ExecWrapperSyncPromise(
          'njs.wallet.bitcore.Address.isValid',
          [toParse, network].map(el => JSON.stringify(el)),
        ))
      ) {
        setQrError('Wrong address');
      } else {
        setQrError(undefined);
      }
    } else if (type == 'gzo') {
      try {
        let order = JSON.parse(Gzip.unzip(toParse));

        AcceptOrder(order);
        setQrError(undefined);
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
            processData({ data: response });
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
        <View style={styles.flexCenter}>
          <View style={styles.flexCenter}>
            <Text>Scan a QR code</Text>
            {qrError && (
              <Text center style={styles.qrError}>
                {qrError}
              </Text>
            )}
          </View>
          <View style={{ height: width * 0.9, width: width * 0.9 }}>
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
          <View style={{ height: width * 0.9, width: width * 0.9 }}>
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
          markerStyle={styles.markerStyles}
          onRead={processData}
          topContent={
            <View>
              <Text>Scan a QR code</Text>
              {qrError && (
                <Text center style={styles.qrError}>
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
