import { TouchableOpacity, View } from 'react-native';
import {
  Icon,
  Input,
  Layout,
  useStyleSheet,
} from '@tsejerome/ui-kitten-components';
import Text from './Text';
import {
  Balance_Types_Enum,
  BalanceFragment,
  Destination_Types_Enum,
} from '@constants';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import BottomSheetOptions from './BottomSheetOptions';
import { useWallet, useQr, useBottomSheet } from '@hooks';
import { destinationStyles } from './styles';

const DestinationComponent = (props: any) => {
  const styles = useStyleSheet(destinationStyles);
  const bottomSheet = useBottomSheet();
  const destinationInputRef = useRef<Input>();
  const qrContext = useQr();
  const { parsedAddresses, accounts } = useWallet();

  const [toType, setToType] = useState<BalanceFragment | undefined>(
    props.toType || undefined,
  );
  const [to, setTo] = useState(
    toType?.destination_id != Destination_Types_Enum.Address
      ? parsedAddresses.filter(
          el =>
            el.type_id == toType?.destination_id &&
            (!toType?.address ||
              (toType?.address && el.stakingAddress == toType?.address)),
        )[0]?.address
      : '',
  );

  useEffect(() => {
    if (props.setToType) {
      props.setToType(toType);
    }
    if (toType?.destination_id != Destination_Types_Enum.Address) {
      setTo(
        parsedAddresses.filter(el => el.type_id == toType?.destination_id)[0]
          ?.address,
      );
      if (props.setTo) {
        props.setTo(
          parsedAddresses.filter(
            el =>
              el.type_id == toType?.destination_id &&
              (!toType?.address ||
                (toType?.address && el.stakingAddress == toType?.address)),
          )[0]?.address,
        );
      }
    } else {
      setTo('');
    }
  }, [toType, parsedAddresses]);

  useEffect(() => {
    setTo(qrContext.to);
    if (props.setTo && qrContext.to) {
      props.setTo(qrContext.to);
    }
  }, [qrContext.to]);

  useEffect(() => {
    if (props.setTo && to) {
      props.setTo(to);
    }
  }, [to]);

  const pickDestination = useCallback(() => {
    let options = accounts
      .filter(el => el.name != props.from?.name)
      .map(el => {
        return { ...el, text: el.name + ' Wallet' };
      });

    options.push({
      name: 'Address',
      text: 'Address',
      amount: 0,
      pending_amount: 0,
      type_id: Balance_Types_Enum.Nav,
      destination_id: Destination_Types_Enum.Address,
      currency: 'NAV',
      icon: 'qr',
    });

    bottomSheet.expand(
      <BottomSheetOptions
        title={'Select destination'}
        options={options}
        bottomSheetRef={bottomSheet.getRef}
        onSelect={(el: any) => {
          setToType(el);
        }}
      />,
    );
  }, [accounts]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          destinationInputRef.current?.focus();
        }}>
        <Layout level="2" style={styles.card}>
          <View>
            <Text category="headline">Destination</Text>
            <Text style={styles.marginTopLeft} category="headline">
              {toType?.destination_id != Destination_Types_Enum.Address &&
                toType?.name}
            </Text>
          </View>
          {toType?.destination_id == Destination_Types_Enum.Address ? (
            <View style={styles.cardNumber}>
              <Input
                autoFocus
                ref={destinationInputRef}
                keyboardType={'ascii-capable'}
                status={'transparent'}
                style={styles.flex1}
                value={to}
                onChangeText={(m: string) => {
                  setTo(m);
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  qrContext.show();
                }}>
                <Icon pack="assets" name={'qr'} style={styles.qrIcon} />
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
          {!(
            props.from &&
            (props.from.type_id == Balance_Types_Enum.Nft ||
              props.from.type_id == Balance_Types_Enum.PrivateToken)
          ) && (
            <TouchableOpacity
              style={styles.iconView}
              onPress={() => {
                pickDestination();
              }}>
              <View>
                <Icon pack="assets" name="downArrow" style={styles.icon} />
              </View>
            </TouchableOpacity>
          )}
        </Layout>
      </TouchableOpacity>
    </>
  );
};

export default DestinationComponent;
