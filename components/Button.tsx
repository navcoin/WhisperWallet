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

  if (BUTTON_SIZE[size]) {
    for (const styleKey in BUTTON_SIZE[size]) {
      if (ButtonStyleOptionsWithNumbers.includes(styleKey)) {
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
  ({
    size = 'medium',
    sizeMatters = true,
    children,
    style,
    ...rest
  }: MyButtonProps) => {
    let [finalizedStyle, setFinalizedStyle] = useState<StyleProp<TextStyle>>(
      {},
    );
    useEffect(() => {
      let defaultStyles: StyleProp<TextStyle> = {};
      if (size && sizeMatters) {
        defaultStyles = {
          ...defaultStyles,
          ...parseUiKittenStyle(size as sizeOptions, sizeMatters),
        };
      }
      let injectedStyles: StyleProp<TextStyle> = {};
      if (Array.isArray(style)) {
        for (const e of style) {
          Object.assign(injectedStyles, e);
        }
      } else {
        injectedStyles = style;
      }
      setFinalizedStyle([defaultStyles, injectedStyles]);
    }, [size, sizeMatters, style]);
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
