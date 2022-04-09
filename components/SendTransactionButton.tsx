import {
  Button,
  Layout,
  StyleService,
  TopNavigation,
  useStyleSheet,
} from '@ui-kitten/components';
import React, {useState} from 'react';
import Loading from './Loading';
import useKeychain from '../utils/Keychain';
import useWallet from '../hooks/useWallet';
import {useBottomSheet} from '../hooks/useBottomSheet';
import Text from './Text';
import BottomSheetView from './BottomSheetView';
import {View} from 'react-native';
import SwipeButton from '../components/SwipeButton';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/type';

const SendTransactionButton = (props: any) => {
  const {walletName, from, to, amount, memo, subtractFee, fromAddress} = props;
  const {createTransaction, sendTransaction, wallet} = useWallet();
  const {read} = useKeychain();
  const [loading, setLoading] = useState(false);
  const bottomSheet = useBottomSheet();
  const {goBack} = useNavigation<NavigationProp<RootStackParamList>>();
  const {collapse} = useBottomSheet();
  const styles = useStyleSheet(themedStyles);
  return (
    <>
      <Loading loading={loading}></Loading>
      <Button
        activeOpacity={0.7}
        children="Send"
        onPress={() => {
          setLoading(true);
          read(walletName).then((password: string) => {
            createTransaction(
              from,
              to,
              amount,
              password,
              memo,
              subtractFee,
              fromAddress,
            )
              .then((tx: any) => {
                setLoading(false);
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
                          {(amount - (subtractFee ? tx.fee / 1e8 : 0)).toFixed(
                            8,
                          )}
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
                          {(tx.fee / 1e8).toFixed(8)}
                        </Text>
                      </View>
                    </Layout>

                    <SwipeButton
                      goBackToStart={true}
                      onComplete={() => {
                        setLoading(true);
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
                setLoading(false);
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
