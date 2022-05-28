import {Icon, StyleService} from '@tsejerome/ui-kitten-components';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {scale} from 'react-native-size-matters';
import {useBottomSheet} from '../hooks/useBottomSheet';
import BottomSheetView from './BottomSheetView';
import OptionCard from './OptionCard';
import Text from './Text';

const ScanQR = (props: any) => {
  const bottomSheet = useBottomSheet();

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          bottomSheet.expand(<QRCodeScanner onRead={props.onRead} />);
        }}>
        <Icon pack="assets" name={'qr'} style={[styles.icon]} />
      </TouchableOpacity>
    </>
  );
};

export default ScanQR;

const styles = StyleService.create({
  icon: {
    width: scale(24),
    height: scale(24),
    tintColor: 'black',
  },
});
