import React, {memo, useEffect, useState} from 'react';
import {Button, ButtonProps} from '@tsejerome/ui-kitten-components';
import BUTTON_SIZE from '../constants/theme/ButtonSize';
import {StyleProp, TextStyle} from 'react-native';
import {scale} from 'react-native-size-matters';
import Text from './Text';

type sizeOptions =
  | 'tiny'
  | '64'
  | '32'
  | '44'
  | '80'
  | 'small'
  | 'medium'
  | 'large'
  | '48'
  | 'giant';

export interface MyButtonProps extends ButtonProps {
  sizeMatters?: boolean;
}

const ButtonStyleOptionsWithNumbers = [
  'minHeight',
  'borderRadius',
  'borderWidth',
  'paddingHorizontal',
];

const parseUiKittenStyle = (size: sizeOptions, sizeMatters: boolean) => {
  let styles: StyleProp<TextStyle> = {};

  console.log('wtf312312');
  if (BUTTON_SIZE[size]) {
    console.log('wtf');
    console.log(JSON.stringify(BUTTON_SIZE[size]));
    for (const styleKey in BUTTON_SIZE[size]) {
      if (ButtonStyleOptionsWithNumbers.includes(styleKey)) {
        console.log(styleKey);
        console.log(BUTTON_SIZE[size][styleKey]);
        styles[styleKey] = sizeMatters
          ? scale(BUTTON_SIZE[size][styleKey])
          : BUTTON_SIZE[size][styleKey];
      }
    }
    if (BUTTON_SIZE[size].textFontSize) {
      styles.fontSize = sizeMatters
        ? scale(BUTTON_SIZE[size].textFontSize)
        : BUTTON_SIZE[size].textFontSize;
    }
  }
  return styles;
};

export default memo(
  ({size, sizeMatters = true, children, ...rest}: MyButtonProps) => {
    let defaultStyles: StyleProp<TextStyle> = {};
    if (size && sizeMatters) {
      defaultStyles = {
        ...defaultStyles,
        ...parseUiKittenStyle(size as sizeOptions, sizeMatters),
      };
      console.log(JSON.stringify(defaultStyles));
      console.log('defaultStyles');
    }
    return (
      <Button style={[defaultStyles]} {...rest}>
        {evaProps => (
          <Text style={{fontWeight: '700'}} category={'call-out'}>
            {children}
          </Text>
        )}
      </Button>
    );
  },
);
