import { TouchableOpacity, View, ScrollView } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { Text, TopNavigationComponent, Container } from '@components';
import React, { useEffect, useState } from 'react';
import { useStyleSheet } from '@tsejerome/ui-kitten-components';
import { useLayout, useWallet } from '@hooks';
import QRCode from 'react-native-qrcode-svg';
import { BalanceFragment } from '@constants';
import Toast from 'react-native-toast-message';
import { addressScreenStyles } from './styles';

const AddressScreen = (props: any) => {
  const styles = useStyleSheet(addressScreenStyles);
  const [addressType, setAddressType] = useState<BalanceFragment>(
    props.route.params.from,
  );
  const [address, setAddress] = useState('');
  const { height } = useLayout();
  const { parsedAddresses } = useWallet();

  useEffect(() => {
    setAddress(
      parsedAddresses
        .sort((a, b) => {
          return a.used - b.used;
        })
        .filter(
          el =>
            el.type_id == addressType.destination_id &&
            (!addressType.address ||
              (addressType.address &&
                addressType.address == el.stakingAddress)),
        )[0]?.address,
    );
  }, [addressType, parsedAddresses]);

  return (
    <Container>
      <TopNavigationComponent title={addressType.destination_id + ' address'} />
      <Container style={styles.wrapper}>
        <ScrollView>
          <View style={styles.qrCode}>
            {address ? (
              <QRCode value={'navcoin:' + address} size={height * 0.4} />
            ) : (
              <></>
            )}
          </View>
          <View style={[styles.container, styles.textWrapper]}>
            <Text category={'caption1'} center>
              {address}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Toast.hide();
              Toast.show({ text1: 'Address Copied' });
              Clipboard.setString(address);
            }}>
            <Text
              center
              underline
              variants={'transparent'}
              style={styles.marginTop32}>
              Tap here to copy address
            </Text>
          </TouchableOpacity>
          <View style={styles.height40} />
        </ScrollView>
      </Container>
    </Container>
  );
};

export default AddressScreen;
