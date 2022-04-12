import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Text from './Text';

const Mnemonic = (props: {mnemonic: string}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
      }}>
      <ScrollView
        style={{maxWidth: 360, margin: 'auto', justifySelf: 'center'}}>
        <Text center style={{marginHorizontal: 24}}>
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
      </ScrollView>
    </View>
  );
};

export default Mnemonic;

const styles = StyleSheet.create({
  boxWordGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  boxWord: {
    borderRadius: 16,
    paddingVertical: 20,
    width: 120,
  },
});
