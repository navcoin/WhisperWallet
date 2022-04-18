import React, {Component, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import Text from './Text';
import {Button} from '@tsejerome/ui-kitten-components';

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

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'background-basic-color-1',
    padding: 24,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default Alert;
