import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Text from '../../components/Text';
import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import {useTheme} from '@tsejerome/ui-kitten-components';
import useLayout from '../../hooks/useLayout';
import QRCode from 'react-native-qrcode-svg';
import {BalanceFragment} from '../../constants/Type';
import useWallet from '../../hooks/useWallet';
import TopNavigationComponent from '../../components/TopNavigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

const AddressScreen = (props: any) => {
  const [addressType, setAddressType] = useState<BalanceFragment>(
    props.route.params.from,
  );
  const [address, setAddress] = useState('');
  const {width} = useLayout();
  const {parsedAddresses} = useWallet();
  const theme = useTheme();

  useEffect(() => {
    setAddress(
      parsedAddresses.filter(
        el =>
          el.type_id == addressType.destination_id &&
          (!addressType.address ||
            (addressType.address && addressType.address == el.stakingAddress)),
      )[0]?.address,
    );
  }, [addressType, parsedAddresses]);

  return (
    <Container>
      <TopNavigationComponent title={addressType.destination_id + ' Address'} />

      <Container
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={() => Clipboard.setString(address)}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 32,
            }}>
            {address ? (
              <QRCode value={'navcoin:' + address} size={(width * 7) / 9} />
            ) : (
              <></>
            )}
          </View>
          <View
            style={[
              styles.container,
              {backgroundColor: theme['background-basic-color-2']},
            ]}>
            <Text center>{address}</Text>
          </View>
          <Text center variants={'transparent'} style={{marginTop: 32}}>
            Tap to copy
          </Text>
          <View style={{flex: 1}} />
        </TouchableOpacity>
      </Container>
    </Container>
  );
};

export default gestureHandlerRootHOC(AddressScreen);

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingVertical: 32,
    paddingLeft: 32,
    paddingRight: 32,
    marginLeft: 32,
    marginRight: 32,
  },
});
