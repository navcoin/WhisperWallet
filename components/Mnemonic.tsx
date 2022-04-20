import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Text from './Text';

const Mnemonic = (props: {mnemonic: string}) => {
  return (
    <View style={[styles.mainWrapper]}>
      <View style={[styles.innerWrapper]}>
        <Text
          category={'footnote'}
          center
          style={{marginHorizontal: scale(24)}}>
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
      </View>
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
    marginTop: verticalScale(16),
  },
  boxWord: {
    borderRadius: scale(16),
    paddingBottom: verticalScale(20),
    width: scale(120),
  },
  mainWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  innerWrapper: {
    maxWidth: scale(380),
    flex: 1,
    margin: 'auto',
    justifySelf: 'center',
  },
});
