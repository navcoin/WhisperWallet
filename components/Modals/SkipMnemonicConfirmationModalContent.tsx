import React from 'react';
import {StyleSheet, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import {useModal} from '../../src/hooks/useModal';
import {Button} from '@tsejerome/ui-kitten-components';
import Text from '../Text';

const SkipMnemonicConfirmationModalContent = (props: {skip: () => void}) => {
  const {closeModal} = useModal();
  const {skip} = props;
  const buttonOptions = [
    {
      text: 'Back',
      status: 'white-whisper',
      onPress: async () => {
        closeModal();
      },
    },
    {
      text: 'Skip',
      status: 'radical-whisper',
      onPress: async () => {
        closeModal();
        skip();
      },
    },
  ];
  return (
    <>
      <Text category="body" center style={[styles.item, styles.text]}>
        {
          'Your coins will be lost forever if you: \n- Lose your device, \n- Haven’t backed up the mnemonic, or \n- Back up a wrong set of words. \n\nAre you sure you want to skip the confirmation step?'
        }
      </Text>
      <View style={[styles.buttonGroup, styles.item]}>
        {buttonOptions.map((option, index) => (
          <Button
            key={index}
            status={option.status || 'primary-whisper'}
            style={[styles.button]}
            children={option.text}
            onPress={() => option.onPress()}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
  item: {
    paddingHorizontal: scale(16),
    marginTop: scale(32),
  },
  buttonGroup: {
    marginTop: scale(20),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    marginBottom: scale(20),
    width: '47%',
  },
});

export default SkipMnemonicConfirmationModalContent;
