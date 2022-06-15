import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import Text from '../Text';

const LoadingModalContent = (props: any) => {
  const {loading, text} = props;

  return (
    <>
      {text ? (
        <Text center style={styles.item}>
          {text}
        </Text>
      ) : (
        <></>
      )}
      <ActivityIndicator animating={loading} />
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default LoadingModalContent;
