import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {scale} from 'react-native-size-matters';
import {useBottomSheet} from '../hooks/useBottomSheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ScanQR = (props: any) => {
  const bottomSheet = useBottomSheet();

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          bottomSheet.expand(<QRCodeScanner onRead={props.onRead} />);
        }}>
        <Icon name={'qrcode'} size={scale(24)} color={'black'} />
      </TouchableOpacity>
    </>
  );
};

export default ScanQR;
