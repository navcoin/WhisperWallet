import React, {Component, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import Text from './Text';
import {Button} from '@ui-kitten/components';

const Mnemonic = (props: {mnemonic: string}) => {
  return (
    <>
      <Text center style={{marginHorizontal: 12}}>
        The following words will allow you to recover your wallet in case you
        lose your device. Write them down in a safe place.
      </Text>
      <View style={styles.boxWordGroup}>
        {props.mnemonic.length
          ? props.mnemonic.split(' ').map((word, wordpos) => {
              return (
                <View style={styles.boxWord} key={word + wordpos}>
                  <Text category="label" status="white" center key={'pos'}>
                    {wordpos + 1}
                  </Text>
                  <Text status="white" marginTop={4} center key={'word'}>
                    {word}
                  </Text>
                </View>
              );
            })
          : null}
      </View>
    </>
  );
};

export default Mnemonic;

const styles = StyleSheet.create({
  boxWordGroup: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  boxWord: {
    borderRadius: 16,
    margin: 4,
    padding: 16,
    width: 120,
  },
});
