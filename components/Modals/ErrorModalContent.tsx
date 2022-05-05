import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {scale, verticalScale} from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import {useModal} from '../../hooks/useModal';
import {cleanTemporaryErrorRecord, errorGroupParser} from '../../utils/errors';
import {sendErrorCrashEmail} from '../../utils/sendMail';
import Button from '../Button';
import Text from '../Text';
import {screenHeight} from '../../utils/layout';
import {AsyncStoredItems} from '../../utils/asyncStorageManager';
import useAsyncStorage from '../../hooks/useAsyncStorage';

const ErrorModalContent = (props: {
  errorText: string;
  focusOneError?: boolean;
}) => {
  const {errorText, focusOneError = false} = props;
  const {closeModal} = useModal();
  const [tempErrorRecords, setErrorRecords] = useAsyncStorage(
    AsyncStoredItems.TEMP_ERROR_RECORDS,
    null,
  );
  const buttonOptions = [
    {
      text: 'Send report via email',
      onPress: async () => {
        await sendErrorCrashEmail(focusOneError ? errorText : undefined);
        if (!focusOneError) await cleanTemporaryErrorRecord();
        closeModal();
      },
    },
    {
      text: 'Copy error',
      onPress: async () => {
        Clipboard.setString(
          focusOneError ? errorText : errorGroupParser(tempErrorRecords),
        );
        Toast.show({
          type: 'success',
          text1: 'Error Copied!',
        });
        if (!focusOneError) await cleanTemporaryErrorRecord();
        closeModal();
      },
    },
    {
      text: 'Close',
      onPress: async () => {
        if (!focusOneError) await cleanTemporaryErrorRecord();
        closeModal();
      },
    },
  ];
  return (
    <>
      {errorText ? (
        <ScrollView style={{maxHeight: verticalScale(screenHeight * 0.3)}}>
          <Text category="title4" center style={styles.item}>
            {`The error encountered is as below:\n${errorText}`}
          </Text>
        </ScrollView>
      ) : null}
      <View style={[styles.buttonGroup]}>
        {buttonOptions.map((option, index) => (
          <Button
            key={index}
            status={'primary-whisper'}
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
  item: {
    paddingHorizontal: scale(16),
    marginBottom: scale(16),
  },
  buttonGroup: {
    marginTop: scale(20),
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginBottom: scale(20),
    width: scale(300),
  },
});

export default ErrorModalContent;
