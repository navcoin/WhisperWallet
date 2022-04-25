import React from 'react';
import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';
import Text from './Text';
import {BlurView} from '@react-native-community/blur';

const Loading = (props: any) => {
  const {loading, ...attributes} = props;

  return (
    <Modal
      transparent={true}
      statusBarTranslucent={true}
      animationType={'none'}
      visible={loading}>
      <BlurView
        style={styles.absolute}
        blurType="dark"
        blurAmount={10}
        reducedTransparencyFallbackColor="white">
        <View style={styles.contentContainer}>
          {props.text ? (
            <Text center style={styles.item}>
              {props.text}
            </Text>
          ) : (
            <></>
          )}
          <ActivityIndicator animating={loading} />
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  contentContainer: {
    backgroundColor: 'background-basic-color-6',
    flex: 1,
    paddingTop: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolute: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
