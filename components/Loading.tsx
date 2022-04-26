import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import Modal from './Modal';
import Text from './Text';

const Loading = (props: any) => {
  const {loading, text} = props;

  return (
    <Modal visible={loading}>
      {text ? (
        <Text center style={styles.item}>
          {text}
        </Text>
      ) : (
        <></>
      )}
      <ActivityIndicator animating={loading} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default Loading;
