import {
  Button,
  Layout,
  TopNavigation,
  useStyleSheet,
} from '@tsejerome/ui-kitten-components';
import React, { useState, useEffect } from 'react';
import LoadingModalContent from './Modals/LoadingModalContent';
import Text from './Text';
import BottomSheetView from './BottomSheetView';
import { View } from 'react-native';
import { SwipeButton } from '../components/SwipeButton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/type';
import { Balance_Types_Enum, Destination_Types_Enum } from '@constants';
import { useModal, useSecurity, useBottomSheet, useWallet } from '@hooks';
import { sendTransactionStyles } from './styles';

const SendTransactionButton = (props: any) => {
  const { from, to, amount, memo, subtractFee } = props;
  const { createTransaction, sendTransaction } = useWallet();
  const { readPassword } = useSecurity();
  const [loading, setLoading] = useState<string | undefined | boolean>(false);
  const bottomSheet = useBottomSheet();
  const { goBack } = useNavigation<NavigationProp<RootStackParamList>>();
  const { collapse } = useBottomSheet();
  const styles = useStyleSheet(sendTransactionStyles);
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (loading) {
      openModal(<LoadingModalContent loading={!!loading} text={loading} />);
      return;
    }
    closeModal();
  }, [loading]);

  return (
    <>
      <Button
        status={'primary-whisper'}
        activeOpacity={0.7}
        children="Send"
        onPress={() => {
          readPassword()
            .then((password: string) => {
              setLoading('Creating transaction...');
              createTransaction(
                from.type_id,
                to,
                amount,
                password,
                memo,
                subtractFee,
                from.address,
                from.tokenId,
                props.nftId,
              )
                .then((tx: any) => {
                  setLoading(false);
                  bottomSheet.expand(
                    <BottomSheetView>
                      <TopNavigation title="Confirm Transaction" />
                      <Layout level="2" style={styles.card}>
                        <View style={styles.row}>
                          <Text
                            category="headline"
                            style={styles.marginRight16}>
                            To:
                          </Text>
                          <Text category="headline" style={styles.textFlex}>
                            {to}
                          </Text>
                        </View>
                      </Layout>
                      <Layout level="2" style={styles.card}>
                        <View style={styles.row}>
                          <Text
                            category="headline"
                            style={styles.marginRight16}>
                            Amount:
                          </Text>
                          <Text category="headline">
                            {(
                              amount *
                                (from.type_id == Balance_Types_Enum.Nft
                                  ? 1e8
                                  : 1) -
                              (subtractFee &&
                              from.type_id != Balance_Types_Enum.PrivateToken &&
                              from.type_id != Balance_Types_Enum.Nft
                                ? tx.fee / 1e8
                                : 0)
                            ).toFixed(
                              from.type_id == Balance_Types_Enum.Nft ? 0 : 8,
                            )}{' '}
                            {from.currency}
                          </Text>
                        </View>
                      </Layout>
                      <Layout
                        level="2"
                        style={[styles.card, styles.marginBottom24]}>
                        <View style={styles.row}>
                          <Text
                            category="headline"
                            style={styles.marginRight16}>
                            Fee:
                          </Text>
                          <Text category="headline">
                            {(tx.fee / 1e8).toFixed(8)}{' '}
                            {from.destination_id ==
                            Destination_Types_Enum.PrivateWallet
                              ? 'xNAV'
                              : 'NAV'}
                          </Text>
                        </View>
                      </Layout>

                      <SwipeButton
                        goBackToStart={true}
                        onComplete={() => {
                          setLoading('Broadcasting...');
                          sendTransaction(tx.tx).then(() => {
                            setLoading(false);
                            collapse();
                            goBack();
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
                        Unable to create transaction
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
                    Unable to create transaction
                  </Text>
                  <Text center style={styles.paddingBottom16}>
                    {e.message}
                  </Text>
                </BottomSheetView>,
              );
            });
        }}
      />
    </>
  );
};

export default SendTransactionButton;
