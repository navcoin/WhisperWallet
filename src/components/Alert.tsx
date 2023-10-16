import React, { useEffect, useState } from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';
import Text from './Text';
import { Button } from '@tsejerome/ui-kitten-components';
import { alertStyles as styles } from './styles';

const Alert = (props: any) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!props.text);
  }, [props.text]);

  return (
    <Modal
      visible={visible}
      transparent={false}
      onRequestClose={() => {
        setVisible(!visible);
      }}>
      <TouchableWithoutFeedback
        onPress={() => {
          setVisible(false);
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <Text center>{props.text}</Text>
          </View>
          <Button>Tap to close</Button>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Alert;
