import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useBottomSheet, useLayout } from '@hooks';
import BottomSheetView from './BottomSheetView';
import OptionCard from './OptionCard';
import Text from './Text';
import { mnemonicStyles as styles } from './styles';

const Mnemonic = (props: { mnemonic: string }) => {
  const bottomSheet = useBottomSheet();
  const { height } = useLayout();

  return (
    <View style={[styles.mainWrapper]}>
      <View style={[styles.innerWrapper]}>
        <Text category={'footnote'} center style={styles.infoText}>
          The following words will allow you to recover your wallet in case you
          lose your device. Write them down in a safe place.
        </Text>
        <View style={styles.boxWordGroup}>
          {props.mnemonic.length
            ? props.mnemonic.split(' ').map((word, wordpos) => {
                return (
                  <View style={styles.boxWord} key={word + wordpos}>
                    <Text category="label" status="white" center key={'pos'}>
                      {wordpos + 1}
                    </Text>
                    <Text status="white" marginTop={4} center key={'word'}>
                      {word}
                    </Text>
                  </View>
                );
              })
            : null}
        </View>
        <View style={styles.optionCardWrapper}>
          <OptionCard
            id={'1'}
            index={1}
            item={{ text: 'Show QR code' }}
            selected={''}
            onPress={() => {
              bottomSheet.expand(
                <BottomSheetView>
                  <QRCode value={props.mnemonic} size={height * 0.4} />
                </BottomSheetView>,
              );
            }}
            icon={'qr'}
            color={'white'}
          />
        </View>
      </View>
    </View>
  );
};

export default Mnemonic;
