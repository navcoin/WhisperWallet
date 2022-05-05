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
      colorStyle: ButtonColorStyle.white,
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
      <View>
        <Text category="body" style={styles.item}>
          {`The coins stored on the wallet "${walletName}" will be lost and you cannot do undo this action. \n\nPlease be sure your seed words are correctly backed up, as the wallet will only be accessible again using a valid backup.\n\nAre you sure you want to delete "${walletName}"?`}
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: scale(16),
  },
  buttonGroup: {
    marginTop: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    marginBottom: scale(20),
    flex: 1,
    maxWidth: '45%',
  },
});

export default DeleteWalletModalContent;
