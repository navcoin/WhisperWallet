import React, {useEffect, useState} from 'react';
import {Clipboard, StyleSheet, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import {sendErrorCrashEmail} from '../utils/sendMail';
import Button from './Button';
import Modal from './Modal';
import Text from './Text';

const ErrorModal = (props: any) => {
  const {errorText, reset} = props;
  const [visible, setVisibility] = useState(errorText.length);
  useEffect(() => {
    setVisibility(!!errorText.length);
  }, [errorText]);
  const buttonOptions = [
    {
      text: 'Send report via email',
      onPress: () => {
        sendErrorCrashEmail(errorText, errorText.includes('Fatal'));
        reset();
      },
    },
    {
      text: 'Copy error',
      onPress: () => {
        Clipboard.setString(errorText);
        Toast.show({
          type: 'success',
          text1: 'Error Copied!',
        });
        reset();
      },
    },
    {
      text: 'Close',
      onPress: () => {
        reset();
      },
    },
  ];
  return (
    <Modal visible={visible}>
      {errorText ? (
        <Text category="title4" center style={styles.item}>
          {errorText}
        </Text>
      ) : null}
      <View style={[styles.buttonGroup]}>
        {buttonOptions.map(option => (
          <Button
            style={[styles.button]}
            children={option.text}
            onPress={() => option.onPress()}
          />
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: scale(16),
    marginBottom: scale(16),
  },
  buttonGroup: {
    marginTop: scale(20),
    width: '100%',
  },
  button: {
    marginBottom: scale(20),
    width: scale(300),
  },
});

export default ErrorModal;
