import { Icon, StyleService, useTheme } from '@tsejerome/ui-kitten-components';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { scale } from 'react-native-size-matters';
import { useBottomSheet } from '@hooks';

const ScanQR = (props: any) => {
  const bottomSheet = useBottomSheet();
  const theme = useTheme();

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          bottomSheet.expand(
            <QRCodeScanner
              reactivate={false}
              showMarker={true}
              markerStyle={{ borderColor: theme['color-staking'] }}
              onRead={data => {
                bottomSheet.collapse();
                props.onRead(data);
              }}
            />,
          );
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
