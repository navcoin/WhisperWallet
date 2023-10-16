import React from 'react';
import { View } from 'react-native';
import { useModal } from '@hooks';
import { Button } from '@tsejerome/ui-kitten-components';
import Text from '../Text';
import { skipMnemonicStyles as styles } from './styles';

const SkipMnemonicConfirmationModalContent = (props: { skip: () => void }) => {
  const { closeModal } = useModal();
  const { skip } = props;
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

export default SkipMnemonicConfirmationModalContent;
