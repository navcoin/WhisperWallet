import {TouchableOpacity, View} from 'react-native';
import {
  Icon,
  Input,
  Layout,
  StyleService,
  useStyleSheet,
} from '@ui-kitten/components';
import Text from './Text';
import {
  Balance_Types_Enum,
  BalanceFragment,
  Destination_Types_Enum,
} from '../constants/Type';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import BottomSheetOptions from './BottomSheetOptions';
import {useBottomSheet} from '../hooks/useBottomSheet';
import {useQr} from '../hooks/useQr';
import useWallet from '../hooks/useWallet';

const DestinationComponent = (props: any) => {
  const styles = useStyleSheet(themedStyles);
  const bottomSheet = useBottomSheet();
  const destinationInputRef = useRef<Input>();
  const qrContext = useQr();
  const {parsedAddresses, accounts} = useWallet();

  const [toType, setToType] = useState<BalanceFragment | undefined>(
    props.toType || undefined,
  );
  const [to, setTo] = useState(
    toType?.destination_id != Destination_Types_Enum.Address
      ? parsedAddresses.filter(el => el.type_id == toType?.destination_id)[0]
          ?.address
      : '',
  );

  useEffect(() => {
    if (props.setToType) props.setToType(toType);
    if (toType?.destination_id != Destination_Types_Enum.Address) {
      setTo(
        parsedAddresses.filter(el => el.type_id == toType?.destination_id)[0]
          ?.address,
      );
      if (props.setTo) {
        props.setTo(
          parsedAddresses.filter(el => el.type_id == toType?.destination_id)[0]
            ?.address,
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
        return {...el, text: el.name + ' Wallet'};
      });

    options.push({
      name: 'Address',
      text: 'Address',
      amount: 0,
      pending_amount: 0,
      type_id: Balance_Types_Enum.Nav,
      destination_id: Destination_Types_Enum.Address,
      currency: 'NAV',
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
          <View style={styles.row}>
            <Text category="headline">Destination</Text>
            <Text category="headline">
              {toType?.destination_id != Destination_Types_Enum.Address &&
                toType?.name}
            </Text>
          </View>
          {toType?.destination_id == Destination_Types_Enum.Address ? (
            <View style={styles.cardNumber}>
              <Input
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
                <Icon
                  pack="assets"
                  name={'qr'}
                  style={{
                    tintColor: 'white',
                    width: 24,
                    height: 24,
                    marginRight: 8,
                    marginLeft: 16,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
          <TouchableOpacity
            style={styles.iconView}
            onPress={() => {
              pickDestination();
            }}>
            <View>
              <Icon pack="assets" name="downArrow" style={styles.icon} />
            </View>
          </TouchableOpacity>
        </Layout>
      </TouchableOpacity>
    </>
  );
};

export default DestinationComponent;

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
