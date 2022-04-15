import Content from '../../components/Content';
import {
  Icon,
  Input,
  Layout,
  StyleService,
  useStyleSheet,
} from '@ui-kitten/components';
import Text from '../../components/Text';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Container from '../../components/Container';
import {TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import useWallet from '../../hooks/useWallet';
import CardSelect from '../../components/CardSelect';
import {
  Balance_Types_Enum,
  BalanceFragment,
  Destination_Types_Enum,
} from '../../constants/Type';
import DialogInput from 'react-native-dialog-input';
import BottomSheetProvider from '../../contexts/BottomSheetProvider';
import DestinationComponent from '../../components/DestinationComponent';
import {QrProvider} from '../../contexts/QrProvider';
import SendTransactionButton from '../../components/SendTransactionButton';
import TopNavigationComponent from '../../components/TopNavigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

const SendToScreen = (props: any) => {
  const styles = useStyleSheet(themedStyles);
  const [from, setFrom] = useState<BalanceFragment | undefined>(
    props.route.params.from,
  );
  const [to, setTo] = useState('');
  const [toType, setToType] = useState(
    props.route.params.toType || {
      name: 'Address',
      text: 'Address',
      amount: 0,
      pending_amount: 0,
      type_id: Balance_Types_Enum.Nav,
      destination_id: Destination_Types_Enum.Address,
      currency: 'NAV',
      icon: 'qr',
    },
  );
  const [memo, setMemo] = useState('');
  const {bottom} = useSafeAreaInsets();
  const [amountInString, setAmount] = useState('0');
  const [showMemo, setShowMemo] = useState(false);
  const [subtractFee, setSubtractFee] = useState(false);
  const {bitcore, accounts, tokens, nfts, walletName, balances} = useWallet();
  const [isMemoDialogVisible, showMemoDialog] = useState(false);

  const [nftId, setNftId] = useState(-1);

  const amountInputRef = useRef<Input>();
  const [sources, setSources] = useState(accounts);

  useEffect(() => {
    if (from?.type_id == Balance_Types_Enum.PrivateToken) setSources(tokens);
    else if (from?.type_id == Balance_Types_Enum.Nft) {
      setAmount((1 / 1e8).toFixed(8));
      setSources(nfts);
    }
  }, [from, tokens, nfts]);

  const currentAmount = useMemo(() => {
    let el = sources?.filter(
      el =>
        el.type_id == from?.type_id &&
        (!from?.address || (from?.address && el.address == from?.address)) &&
        (!from?.tokenId || (from?.tokenId && el.tokenId == from?.tokenId)) &&
        (!from?.nftId || (from?.nftId && el.nftId == from?.nftId)),
    )[0];
    if (!el) {
      return 0;
    } else {
      return el.amount;
    }
  }, [from, sources]);

  useEffect(() => {
    if (
      toType == Destination_Types_Enum.Address &&
      to &&
      bitcore.Address(to).isXnav()
    ) {
      setShowMemo(true);
    } else {
      setShowMemo(false);
    }
  }, [to, toType]);

  useEffect(() => {
    if (parseFloat(amountInString) === currentAmount) {
      setSubtractFee(true);
    } else {
      setSubtractFee(false);
    }
  }, [amountInString, currentAmount]);

  return (
    <BottomSheetProvider>
      <Container useSafeArea>
        <QrProvider>
          <DialogInput
            isDialogVisible={isMemoDialogVisible}
            title={'Encrypted Memo'}
            message={
              'The following message will be encrypted and attached to the transaction. Only the receiver can see it.'
            }
            hintInput={'Message'}
            submitInput={(inputText: string) => {
              setMemo(inputText);
              showMemoDialog(false);
            }}
            closeDialog={() => {
              showMemoDialog(false);
            }}
          />
          <TopNavigationComponent
            title={
              'Send ' +
              (from?.type_id == Balance_Types_Enum.PrivateToken
                ? 'tokens'
                : from?.type_id == Balance_Types_Enum.Nft
                ? 'nfts'
                : 'coins')
            }
          />
          <Content contentContainerStyle={styles.contentContainerStyle}>
            <CardSelect
              options={sources.map(el => {
                return {
                  ...el,
                  text:
                    el.name + ' Wallet (' + el.amount + ' ' + el.currency + ')',
                };
              })}
              text={'From'}
              defaultOption={(() => {
                let el = sources?.filter(
                  el =>
                    el.type_id == from?.type_id &&
                    (!from.address ||
                      (from.address && el.address == from.address)),
                )[0];
                if (!el) {
                  return '';
                }
                return (
                  el.name + ' Wallet (' + el.amount + ' ' + el.currency + ')'
                );
              })()}
              onSelect={el => {
                setFrom(el);
              }}
            />

            <DestinationComponent
              setTo={setTo}
              from={from}
              toType={toType}
              setToType={setToType}
            />

            {showMemo && (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    showMemoDialog(true);
                  }}
                  style={{marginHorizontal: 12, flexDirection: 'row'}}>
                  {memo ? (
                    <>
                      <Text category={'headline'} style={{paddingRight: 12}}>
                        Encrypted memo:
                      </Text>
                      <Text
                        category={'headline'}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{flex: 1}}>
                        {memo}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Icon
                        pack={'assets'}
                        name={'add'}
                        style={{tintColor: 'white', marginRight: 24}}
                      />
                      <Text>Add an encrypted memo</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {from?.type_id == Balance_Types_Enum.Nft ? (
              <></>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  amountInputRef.current?.focus();
                }}>
                <Layout level="2" style={styles.card}>
                  <View style={styles.row}>
                    <Text category="headline">Amount</Text>
                    <Text category="headline" uppercase />
                  </View>
                  <View style={styles.cardNumber}>
                    <Input
                      ref={amountInputRef}
                      keyboardType={'decimal-pad'}
                      status={'transparent'}
                      style={styles.flex1}
                      value={amountInString}
                      onChangeText={(text: string) => {
                        let t = 0;
                        let res = text.replace(/\./g, match =>
                          ++t === 2 ? '' : match,
                        );
                        setAmount(res.trim());
                      }}
                    />
                    <View
                      style={{
                        padding: 5,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setAmount(currentAmount.toString());
                        }}>
                        <Text category={'footnote'}>MAX</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Layout>
              </TouchableOpacity>
            )}
          </Content>
          <Layout style={[styles.bottom, {paddingBottom: bottom + 16}]}>
            <SendTransactionButton
              walletName={walletName}
              from={from}
              to={to}
              amount={parseFloat(amountInString)}
              memo={memo}
              subtractFee={subtractFee}
              nftId={nftId}
            />
          </Layout>
        </QrProvider>
      </Container>
    </BottomSheetProvider>
  );
};

export default gestureHandlerRootHOC(SendToScreen);

const themedStyles = StyleService.create({
  contentContainerStyle: {
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  avatar: {
    alignSelf: 'center',
    borderRadius: 32,
  },
  boxView: {
    marginTop: 54,
  },
  box: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'color-radical-100',
  },
  iconView: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    top: -36,
    borderColor: 'background-basic-color-1',
    backgroundColor: 'color-salmon-100',
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: 'color-basic-100',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'color-basic-1500',
    marginTop: 24,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  note: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  text: {
    color: 'color-basic-1100',
  },
  bottom: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    paddingTop: 8,
    paddingHorizontal: 24,
  },
  item: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 16,
  },
  container: {
    flex: 1,
  },
  button: {padding: 100},
  contentContainer: {
    backgroundColor: 'background-basic-color-3',
    flex: 1,
    padding: 20,
  },
  flex1: {
    flex: 1,
    border: 'none',
  },
});
