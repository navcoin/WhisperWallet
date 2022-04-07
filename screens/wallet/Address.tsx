import {TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Text from '../../components/Text';
import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import {TopNavigation} from '@ui-kitten/components';
import useLayout from '../../hooks/useLayout';
import QRCode from 'react-native-qrcode-svg';
import {Destination_Types_Enum} from '../../constants/Type';
import useWallet from '../../hooks/useWallet';

const Address = (props: any) => {
  const [addressType, setAddressType] = useState(
    props.route.params.from || Destination_Types_Enum.PublicWallet,
  );
  const [address, setAddress] = useState('');
  const {width} = useLayout();
  const {parsedAddresses} = useWallet();

  useEffect(() => {
    setAddress(
      parsedAddresses.filter(el => el.type_id == addressType)[0]?.address,
    );
  }, [addressType, parsedAddresses]);

  return (
    <Container>
      <TopNavigation
        title={() => <Text category="title4">{addressType + ' Address'}</Text>}
      />
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
          <Text
            center
            style={{
              marginBottom: 32,
              padding: 32,
            }}>
            {address}
          </Text>
          <Text center variants={'transparent'}>
            Tap to copy
          </Text>
        </TouchableOpacity>
      </Container>
    </Container>
  );
};

export default Address;
