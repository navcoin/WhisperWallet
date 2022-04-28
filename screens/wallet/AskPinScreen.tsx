import React, {useState} from 'react';
import Container from '../../components/Container';
import {ScreenProps} from '../../navigation/type';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import PINCode from '@haskkor/react-native-pincode';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {Button, StyleService, Text} from '@tsejerome/ui-kitten-components';

const AskPinScreen: React.FC<ScreenProps<'AskPinScreen'>> = (props: any) => {
  const {setManualPin, askManualPin, pinLength} = props.route.params;
  const {goBack} = useNavigation();
  const [showInstructions, setShowInstructions] = useState(true);
  return (
    <Container>
      {setManualPin ? (
        showInstructions ? (
          <Container
            useSafeArea
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
            }}>
            <Icon
              name={'warning'}
              size={scale(32)}
              color={'#fff'}
              style={{opacity: 1, marginBottom: scale(32)}}
            />
            <Text
              style={{
                textAlign: 'center',
                paddingHorizontal: scale(32),
              }}>
              In the next screen you are going to be asked to introduce a new{' '}
              {pinLength}-digit PIN code. {'\n\n'}This code will be asked
              anytime: {'\n\n'}- A wallet is opened, deleted or resynced{' '}
              {'\n\n'}- Access to the private keys is required {'\n\n'}
            </Text>
            <Button
              style={[styles.wallet]}
              status={'primary-whisper'}
              children={'Continue'}
              onPress={() => setShowInstructions(false)}></Button>
          </Container>
        ) : (
          <PINCode
            status={'choose'}
            passwordLength={pinLength}
            styleMainContainer={{backgroundColor: '#1F2933'}}
            stylePinCodeTextTitle={{fontFamily: 'Overpass-Bold'}}
            stylePinCodeTextSubtitle={{fontFamily: 'Overpass-Bold'}}
            stylePinCodeDeleteButtonText={{fontFamily: 'Overpass-Bold'}}
            stylePinCodeTextButtonCircle={{fontFamily: 'Overpass-Bold'}}
            stylePinCodeButtonCircle={{backgroundColor: '#1F2933'}}
            colorPassword={'#fff'}
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
          styleMainContainer={{backgroundColor: '#1F2933'}}
          stylePinCodeTextTitle={{fontFamily: 'Overpass-Bold'}}
          stylePinCodeTextSubtitle={{fontFamily: 'Overpass-Bold'}}
          stylePinCodeDeleteButtonText={{fontFamily: 'Overpass-Bold'}}
          stylePinCodeTextButtonCircle={{fontFamily: 'Overpass-Bold'}}
          stylePinCodeButtonCircle={{backgroundColor: '#1F2933'}}
          stylePinCodeDeleteButtonColorHideUnderlay={'#fff'}
          stylePinCodeDeleteButtonColorShowUnderlay={'#fff'}
          colorPassword={'#fff'}
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

export default gestureHandlerRootHOC(AskPinScreen);

const styles = StyleService.create({
  wallet: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(16),
    width: moderateScale(250, 0.5),
  },
});
