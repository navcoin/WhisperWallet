import React from 'react';
import Container from '../../components/Container';
import {ScreenProps} from '../../navigation/type';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import useSecurity from '../../hooks/useSecurity';
import PINCode from '@haskkor/react-native-pincode';
import {useNavigation} from '@react-navigation/native';

const AskPinScreen: React.FC<ScreenProps<'AskPinScreen'>> = (props: any) => {
  const {setManualPin, setSetManualPin, askManualPin, setAskManualPin} =
    useSecurity();
  const {goBack} = useNavigation();
  return (
    <Container>
      {setManualPin ? (
        <PINCode
          status={'choose'}
          passwordLength={props.route.params.pinLength}
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
            setSetManualPin(undefined);
          }}
        />
      ) : askManualPin ? (
        <PINCode
          status={'enter'}
          passwordLength={props.route.params.pinLength}
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
            setAskManualPin(undefined);
          }}
        />
      ) : (
        <></>
      )}
    </Container>
  );
};

export default gestureHandlerRootHOC(AskPinScreen);
