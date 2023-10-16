import React from 'react';
import { ActivityIndicator } from 'react-native';
import Text from '../Text';
import { loadingModalStyles as styles } from './styles';
const LoadingModalContent = (props: any) => {
  const { loading, text } = props;

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

export default LoadingModalContent;
