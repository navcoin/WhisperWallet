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

const parseUiKittenStyle = (size: sizeOptions) => {
  let styles: StyleProp<TextStyle> = {};

  if (BUTTON_SIZE[size]) {
    for (const styleKey in BUTTON_SIZE[size]) {
      if (ButtonStyleOptionsWithNumbers.includes(styleKey)) {
        styles[styleKey] = scale(BUTTON_SIZE[size][styleKey]);
      }
    }
    if (BUTTON_SIZE[size].textFontSize) {
      styles.fontSize = BUTTON_SIZE[size].textFontSize;
    }
  }
  return styles;
};

export default memo(
  ({size = 'medium', children, style, ...rest}: MyButtonProps) => {
    let [finalizedStyle, setFinalizedStyle] = useState<StyleProp<TextStyle>>(
      {},
    );
    useEffect(() => {
      let defaultStyles: StyleProp<TextStyle> = {};
      defaultStyles = {
        ...defaultStyles,
        ...parseUiKittenStyle(size as sizeOptions),
      };
      let injectedStyles: StyleProp<TextStyle> = {};
      if (Array.isArray(style)) {
        for (const e of style) {
          Object.assign(injectedStyles, e);
        }
      } else {
        injectedStyles = style;
      }
      setFinalizedStyle([defaultStyles, injectedStyles]);
    }, [size, style]);
    return (
      <Button style={finalizedStyle} {...rest}>
        {evaProps => (
          <Text style={{fontWeight: '700'}} category={'call-out'}>
            {children}
          </Text>
        )}
      </Button>
    );
  },
);
