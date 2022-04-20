import {StyleSheet, TouchableOpacity, View, ScrollView} from 'react-native';
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
import {verticalScale, scale} from 'react-native-size-matters';

const AddressScreen = (props: any) => {
  const [addressType, setAddressType] = useState<BalanceFragment>(
    props.route.params.from,
  );
  const [address, setAddress] = useState('');
  const {height} = useLayout();
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
        <ScrollView>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: verticalScale(32),
            }}>
            {address ? (
              <QRCode value={'navcoin:' + address} size={height * 0.4} />
            ) : (
              <></>
            )}
          </View>
          <View
            style={[
              styles.container,
              {backgroundColor: theme['background-basic-color-2']},
            ]}>
            <Text category={'caption1'} center>
              {address}
            </Text>
          </View>
          <TouchableOpacity onPress={() => Clipboard.setString(address)}>
            <Text
              center
              variants={'transparent'}
              style={{marginTop: verticalScale(32)}}>
              Tap to copy
            </Text>
          </TouchableOpacity>
          <View style={{height: verticalScale(40)}} />
        </ScrollView>
      </Container>
    </Container>
  );
};

export default gestureHandlerRootHOC(AddressScreen);

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingVertical: verticalScale(32),
    paddingLeft: scale(32),
    paddingRight: scale(32),
    marginLeft: scale(32),
    marginRight: scale(32),
  },
});
