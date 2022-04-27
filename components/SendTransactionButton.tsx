import {
  Button,
  Layout,
  StyleService,
  TopNavigation,
  useStyleSheet,
} from '@tsejerome/ui-kitten-components';
import React, {useState, useEffect} from 'react';
import LoadingModalContent from './LoadingModalContent';
import useKeychain from '../utils/Keychain';
import useWallet from '../hooks/useWallet';
import {useBottomSheet} from '../hooks/useBottomSheet';
import Text from './Text';
import BottomSheetView from './BottomSheetView';
import {View} from 'react-native';
import SwipeButton from '../components/SwipeButton';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/type';
import {Balance_Types_Enum, Destination_Types_Enum} from '../constants/Type';
import {useModal} from '../hooks/useModal';

const SendTransactionButton = (props: any) => {
  const {walletName, from, to, amount, memo, subtractFee} = props;
  const {createTransaction, sendTransaction, wallet} = useWallet();
  const {read} = useKeychain();
  const [loading, setLoading] = useState<string | undefined>(undefined);
  const bottomSheet = useBottomSheet();
  const {goBack} = useNavigation<NavigationProp<RootStackParamList>>();
  const {collapse} = useBottomSheet();
  const styles = useStyleSheet(themedStyles);
  const {openModal, closeModal} = useModal();

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
          setLoading('Creating transaction...');
          read(walletName).then((password: string) => {
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
                setLoading(undefined);
                bottomSheet.expand(
                  <BottomSheetView>
                    <TopNavigation title="Confirm Transaction" />
                    <Layout level="2" style={styles.card}>
                      <View style={styles.row}>
                        <Text category="headline" style={{marginRight: 16}}>
                          To:
                        </Text>
                        <Text
                          category="headline"
                          style={{flex: 1, flexWrap: 'wrap'}}>
                          {to}
                        </Text>
                      </View>
                    </Layout>
                    <Layout level="2" style={styles.card}>
                      <View style={styles.row}>
                        <Text category="headline" style={{marginRight: 16}}>
                          Amount:
                        </Text>
                        <Text category="headline">
                          {(
                            amount -
                            (subtractFee &&
                            from.type_id != Balance_Types_Enum.PrivateToken &&
                            from.type_id != Balance_Types_Enum.Nft
                              ? tx.fee / 1e8
                              : 0)
                          ).toFixed(8)}{' '}
                          {from.currency}
                        </Text>
                      </View>
                    </Layout>

                    <Layout
                      level="2"
                      style={{...styles.card, marginBottom: 24}}>
                      <View style={styles.row}>
                        <Text category="headline" style={{marginRight: 16}}>
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
                          setLoading(undefined);
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
                    <Text center style={{paddingBottom: 16}}>
                      ERROR
                    </Text>
                    <Text center style={{paddingBottom: 16}}>
                      {e.message}
                    </Text>
                  </BottomSheetView>,
                );
                setLoading(undefined);
              });
          });
        }}
      />
    </>
  );
};

export default SendTransactionButton;

const themedStyles = StyleService.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'color-basic-1500',
    marginTop: 24,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
