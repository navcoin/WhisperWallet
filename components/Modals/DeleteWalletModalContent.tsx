import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {scale, verticalScale} from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import {useModal} from '../../hooks/useModal';
import {cleanTemporaryErrorRecord, errorGroupParser} from '../../utils/errors';
import {sendErrorCrashEmail} from '../../utils/sendMail';
import {Button} from '@tsejerome/ui-kitten-components';
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
      status: 'white-whisper',
      onPress: async () => {
        closeModal();
      },
    },
    {
      text: 'Delete',
      status: 'radical-whisper',
      onPress: async () => {
        deleteWallet();
        closeModal();
      },
    },
  ];
  return (
    <>
      <View style={{paddingHorizontal: scale(30)}}>
        <Text category="title3" style={styles.item}>
          {`Do you want to delete the wallet "${walletName}"?`}
        </Text>
        <Text category="body" style={styles.item}>
          {`The coins stored on the wallet "${walletName}" will be lost and you cannot do undo this action. \n\nPlease be sure your seed words are correctly backed up, as the wallet will only be accessible again using a valid backup.?`}
        </Text>
        <View style={[styles.buttonGroup]}>
          {buttonOptions.map((option, index) => (
            <Button
              key={index}
              status={option.status}
              style={[styles.button]}
              children={option.text}
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
    marginBottom: scale(40),
  },
  buttonGroup: {
    marginTop: scale(10),
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
