import Svg, { Rect } from 'react-native-svg';

import React from 'react';
import { View, StyleSheet } from 'react-native';

export default class Identicon extends React.Component {
  render() {
    let value = this.props.value;
    if (value.length != 64) {
      value = require('crypto')
        .createHash('sha256')
        .update(value)
        .digest('hex');
    }

    let colors = [];

    for (let i = 0; i < 32; i++) {
      colors.push(
        value.substring(i * 2, i * 2 + 1) +
          (value.substring(i * 2, i * 2 - 1) || '00') +
          (value.substring(i * 2 + 1, i * 2 + 2) || '00'),
      );
    }

    return (
      <View style={[StyleSheet.absoluteFill, styles.container]}>
        <Svg height="75%" width="75%" viewBox="0 0 80 80">
          {colors.map((el, index) => {
            return (
              <Rect
                key={index}
                x={(index % 4) * 20}
                y={Math.floor(index / 4) * 20}
                width="20"
                height="20"
                fill={'#' + el}
              />
            );
          })}
        </Svg>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
