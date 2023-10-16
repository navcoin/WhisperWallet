import React, { useState } from 'react';
import { Container } from '@components';
import { ScreenProps } from '@navigation';
import { White } from '@constants';
import PINCode from '@haskkor/react-native-pincode';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scale } from 'react-native-size-matters';
import { Button, Text, useStyleSheet } from '@tsejerome/ui-kitten-components';
import { askPinScreenStyles } from './styles';

const AskPinScreen: React.FC<ScreenProps<'AskPinScreen'>> = (props: any) => {
  const { setManualPin, askManualPin, pinLength } = props.route.params;
  const { goBack } = useNavigation();
  const [showInstructions, setShowInstructions] = useState(true);
  const styles = useStyleSheet(askPinScreenStyles);
  return (
    <Container doNotLock={true}>
      {setManualPin ? (
        showInstructions ? (
          <Container useSafeArea style={styles.container}>
            <Icon
              name={'warning'}
              size={scale(32)}
              color={White}
              style={styles.warningIcon}
            />
            <Text style={styles.instructionText}>
              In the next screen you are going to be asked to introduce a{' '}
              {pinLength}-digit PIN code. {'\n\n'}This code will be asked when:{' '}
              {'\n\n'}- A wallet is opened, deleted or resynced {'\n\n'}- Access
              to the private keys is required {'\n\n'}
            </Text>
            <Button
              style={[styles.wallet]}
              status={'primary-whisper'}
              children={'Continue'}
              onPress={() => setShowInstructions(false)}
            />
          </Container>
        ) : (
          <PINCode
            status={'choose'}
            passwordLength={pinLength}
            styleMainContainer={styles.backgroundMirage}
            stylePinCodeTextTitle={styles.boldFontFamily}
            stylePinCodeTextSubtitle={styles.boldFontFamily}
            stylePinCodeDeleteButtonText={styles.boldFontFamily}
            stylePinCodeTextButtonCircle={styles.boldFontFamily}
            stylePinCodeButtonCircle={styles.backgroundMirage}
            colorPassword={White}
            subtitleChoose={'to protect the access to your wallet'}
            storePin={async (pin: string) => {
              setManualPin(pin);
              goBack();
            }}
          />
        )
      ) : askManualPin ? (
        <PINCode
          status={'enter'}
          passwordLength={pinLength}
          touchIDDisabled={true}
          styleMainContainer={styles.backgroundMirage}
          stylePinCodeTextTitle={styles.boldFontFamily}
          stylePinCodeTextSubtitle={styles.boldFontFamily}
          stylePinCodeDeleteButtonText={styles.boldFontFamily}
          stylePinCodeTextButtonCircle={styles.boldFontFamily}
          stylePinCodeButtonCircle={styles.backgroundMirage}
          stylePinCodeDeleteButtonColorHideUnderlay={White}
          stylePinCodeDeleteButtonColorShowUnderlay={White}
          colorPassword={White}
          subtitleChoose={'to access your wallet'}
          endProcessFunction={async (pin: string) => {
            askManualPin(pin);
            goBack();
          }}
        />
      ) : (
        <></>
      )}
    </Container>
  );
};

export default AskPinScreen;
