import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {scale, verticalScale} from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import {useModal} from '../../hooks/useModal';
import {cleanTemporaryErrorRecord, errorGroupParser} from '../../utils/errors';
import {sendErrorCrashEmail} from '../../utils/sendMail';
import Button, {ButtonColorStyle} from '../Button';
import Text from '../Text';
import {screenHeight} from '../../utils/layout';
import {AsyncStoredItems} from '../../utils/asyncStorageManager';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const DeleteWalletModalContent = (props: {
  deleteWallet: () => void;
  walletName: string;
}) => {
  const insets = useSafeAreaInsets();
  const {deleteWallet, walletName} = props;
  const {closeModal} = useModal();
  const [tempErrorRecords, setErrorRecords] = useAsyncStorage(
    AsyncStoredItems.TEMP_ERROR_RECORDS,
    null,
  );
  const buttonOptions = [
    {
      text: 'Cancel',
      colorStyle: ButtonColorStyle.default,
      onPress: async () => {
        closeModal();
      },
    },
    {
      text: 'Delete',
      colorStyle: ButtonColorStyle.radical,
      onPress: async () => {
        deleteWallet();
        closeModal();
      },
    },
  ];
  return (
    <>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Text category="title3" style={styles.item}>
          {`Do you want to delete the wallet "${walletName}"?`}
        </Text>
        <Text category="body" style={styles.item}>
          {`The coins stored on the wallet "${walletName}" will be lost and you cannot do undo this action. \n\n Please be sure your seed words are correctly backed up, as the wallet will only be accessible again using a valid backup.\n\nAre you sure you want to delete this wallet?`}
        </Text>
        <View style={[styles.buttonGroup]}>
          {buttonOptions.map((option, index) => (
            <Button
              key={index}
              status={'primary-whisper'}
              style={[styles.button]}
              children={option.text}
              colorStyle={option.colorStyle}
              onPress={() => option.onPress()}
            />
          ))}
        </View>
      </ScrollView>
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

export default DeleteWalletModalContent;
