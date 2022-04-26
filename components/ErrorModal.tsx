import React from 'react';
import {ActivityIndicator, Clipboard, StyleSheet} from 'react-native';
import {sendErrorCrashEmail} from '../utils/sendMail';
import Button from './Button';
import Modal, {ModalType} from './Modal';
import Text from './Text';

const ErrorModal = (props: any) => {
  const {loading, errorText} = props;
  const buttonOptions = [
    {
      text: 'Send report via Email',
      onPress: () => {
        sendErrorCrashEmail(errorText, errorText.includes('Fatal'));
      },
    },
    {
      text: 'Copy Error',
      onPress: () => {
        Clipboard.setString(errorText);
      },
    },
    {
      text: 'Close',
      onPress: () => {},
    },
  ];
  return (
    <Modal visible={loading}>
      {errorText ? (
        <Text center style={styles.item}>
          {errorText}
        </Text>
      ) : null}
      {buttonOptions.map(option => (
        <Button
          children={option.text}
          status="primary-whisper"
          onPress={() => option.onPress()}
        />
      ))}
    </Modal>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default ErrorModal;
