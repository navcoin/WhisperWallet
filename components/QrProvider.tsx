import React, {useMemo, useState} from 'react';
import {StyleService, useStyleSheet} from '@ui-kitten/components';
import {QrContextValue, QrContext} from './QrContext';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Text from './Text';
import {TouchableOpacity} from 'react-native';
import useWallet from '../hooks/useWallet';

export const QrProvider = (props: any) => {
  const [content, setContent] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [qrError, setQrError] = useState('');
  const [to, setTo] = useState('');
  const {bitcore} = useWallet();

  const qrContext: QrContextValue = useMemo(
    () => ({
      show: c => {
        setShowQr(true);
      },
      hide: () => {
        setShowQr(false);
      },
      to: to,
    }),
    [to],
  );

  return (
    <QrContext.Provider value={qrContext}>
      {showQr ? (
        <QRCodeScanner
          onRead={data => {
            if (bitcore.Address.isValid(data.data)) {
              setTo(data.data);
              setShowQr(false);
              setQrError('');
            } else {
              setQrError('Wrong address');
            }
          }}
          topContent={<Text>Scan a QR code with a Navcoin address.</Text>}
          bottomContent={
            <>
              <TouchableOpacity
                onPress={() => {
                  setShowQr(false);
                  setQrError('');
                }}>
                <Text>Go back</Text>
              </TouchableOpacity>
            </>
          }
        />
      ) : (
        props.children
      )}
    </QrContext.Provider>
  );
};
