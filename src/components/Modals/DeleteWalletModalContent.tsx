import React from 'react';
import { View } from 'react-native';
import { useModal } from '@hooks';
import { Button } from '@tsejerome/ui-kitten-components';
import Text from '../Text';
import { deleteWalletModalStyles as styles } from './styles';

const DeleteWalletModalContent = (props: {
  deleteWallet: () => void;
  walletName: string;
}) => {
  const { deleteWallet, walletName } = props;
  const { closeModal } = useModal();

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
      <View style={styles.containerPadding}>
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

export default DeleteWalletModalContent;
