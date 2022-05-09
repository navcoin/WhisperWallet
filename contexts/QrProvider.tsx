import React, {useMemo, useState} from 'react';
import {StyleService, useStyleSheet} from '@tsejerome/ui-kitten-components';
import {QrContextValue, QrContext} from './QrContext';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Text from '../components/Text';
import {Platform, TouchableOpacity} from 'react-native';
import useWallet from '../hooks/useWallet';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useEffect} from 'react';

export const QrProvider = (props: any) => {
  const [content, setContent] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [qrError, setQrError] = useState('');
  const [to, setTo] = useState('');
  const [cameraPermision, setCameraPermision] = useState(false);
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

  const checkPermissions = () => {
    request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then((result) => {
      setCameraPermision(result == RESULTS.GRANTED);
    });
  }

  useEffect(() => {
    if (showQr)
      checkPermissions();
  }, [showQr])

  return (
    <QrContext.Provider value={qrContext}>
      {showQr ? (
        <QRCodeScanner
          onRead={data => {
            let toParse = data.data;
            if (data.data?.substring(0, 8) === 'navcoin:')
              toParse = data.data.split(':')[1];
            if (bitcore.Address.isValid(toParse)) {
              setTo(toParse);
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
