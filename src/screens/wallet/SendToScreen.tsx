import Content from '../../../components/Content';
import {
  Icon,
  Input,
  Layout,
  StyleService,
  useStyleSheet,
} from '@tsejerome/ui-kitten-components';
import Text from '../../../components/Text';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Container from '../../../components/Container';
import {TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale, verticalScale} from 'react-native-size-matters';

import useWallet from '../../hooks/useWallet';
import CardSelect from '../../../components/CardSelect';
import {
  Balance_Types_Enum,
  BalanceFragment,
  Destination_Types_Enum,
} from '../../../constants/Type';
import DialogInput from 'react-native-dialog-input';
import DestinationComponent from '../../../components/DestinationComponent';
import {QrProvider} from '../../../contexts/QrProvider';
import SendTransactionButton from '../../../components/SendTransactionButton';
import TopNavigationComponent from '../../../components/TopNavigation';

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
  const [amountInString, setAmount] = useState('');
  const [showMemo, setShowMemo] = useState(false);
  const [subtractFee, setSubtractFee] = useState(false);
  const {accounts, tokens, nfts, walletName, ExecWrapperSyncPromise} =
    useWallet();
  const [isMemoDialogVisible, showMemoDialog] = useState(false);
  const [accountStr, setAccountStr] = useState('account');

  const [nftId, setNftId] = useState(
    props.route.params.nftId !== undefined ? props.route.params.nftId : -1,
  );

  const amountInputRef = useRef<Input>();
  const [sources, setSources] = useState(accounts);

  useEffect(() => {
    if (from?.type_id == Balance_Types_Enum.PrivateToken) {
      setSources(tokens);
    } else if (from?.type_id == Balance_Types_Enum.Nft) {
      setAccountStr('collection');
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
      return el.spendable_amount;
    }
  }, [from, sources]);

  useEffect(() => {
    ExecWrapperSyncPromise('bitcore.Address("' + to + '").isXnav').then(
      isxNav => {
        if (toType == Destination_Types_Enum.Address && to && !isxNav) {
          setShowMemo(true);
        } else {
          setShowMemo(false);
        }
      },
    );
  }, [to, toType]);

  useEffect(() => {
    if (parseFloat(amountInString) === currentAmount) {
      setSubtractFee(true);
    } else {
      setSubtractFee(false);
    }
  }, [amountInString, currentAmount]);

  return (
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
              ? 'NFTs'
              : 'coins')
          }
        />
        <Content contentContainerStyle={styles.contentContainerStyle}>
          <CardSelect
            options={sources.map(el => {
              return {
                ...el,
                text:
                  el.name +
                  ' ' +
                  accountStr +
                  ' (' +
                  el.spendable_amount +
                  ' ' +
                  el.currency +
                  ')',
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
                el.name +
                ' ' +
                accountStr +
                ' (' +
                el.spendable_amount +
                ' ' +
                el.currency +
                ')'
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
                style={{marginHorizontal: scale(12), flexDirection: 'row'}}>
                {memo ? (
                  <>
                    <Text
                      category={'headline'}
                      style={{paddingRight: scale(12)}}>
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
                      style={{
                        tintColor: 'white',
                        width: scale(24),
                        height: scale(24),
                        marginRight: scale(24),
                      }}
                    />
                    <Text>Add an encrypted memo</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {from?.type_id == Balance_Types_Enum.Nft ? (
            <CardSelect
              options={Object.keys(from.items.confirmed).map(el => {
                let obj =
                  typeof from.items.confirmed[el] === 'object'
                    ? from.items.confirmed[el]
                    : JSON.parse(from.items.confirmed[el]);
                return {
                  ...from.items.confirmed[el],
                  text: obj.name + ' (#' + el + ')',
                  id: el,
                };
              })}
              text={'Item'}
              defaultOption={(() => {
                if (!from.items.confirmed[nftId]) return '';
                let obj =
                  typeof from.items.confirmed[nftId] === 'object'
                    ? from.items.confirmed[nftId]
                    : JSON.parse(from.items.confirmed[nftId]);

                return obj.name + ' (#' + nftId + ')';
              })()}
              onSelect={el => {
                setNftId(el.id);
              }}
            />
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
                    returnKeyType={'done'}
                    status={'transparent'}
                    style={styles.flex1}
                    value={amountInString}
                    placeholder={'0'}
                    onChangeText={(text: string) => {
                      let t = 0;
                      let res = text.replace(/\./g, match =>
                        ++t === 2 ? '' : match,
                      );
                      setAmount(res.trim().replace(',', '.'));
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
          <View
            style={[
              styles.bottom,
              {paddingBottom: verticalScale(bottom + 16)},
            ]}>
            <SendTransactionButton
              walletName={walletName}
              from={from}
              to={to}
              amount={parseFloat(amountInString)}
              memo={memo}
              subtractFee={subtractFee}
              nftId={nftId}
            />
          </View>
        </Content>
      </QrProvider>
    </Container>
  );
};

export default SendToScreen;

const themedStyles = StyleService.create({
  contentContainerStyle: {
    paddingTop: verticalScale(24),
    paddingHorizontal: scale(24),
  },
  card: {
    borderRadius: scale(12),
    borderWidth: scale(1),
    borderColor: 'color-basic-1500',
    marginTop: verticalScale(24),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(12),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(24),
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
    marginTop: verticalScale(4),
  },
  note: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(24),
  },
  text: {
    color: 'color-basic-1100',
  },
  bottom: {
    paddingTop: verticalScale(8),
    paddingHorizontal: scale(24),
  },
  flex1: {
    flex: 1,
    border: 'none',
  },
});
