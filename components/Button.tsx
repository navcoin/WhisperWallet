import React, {memo, useEffect, useState} from 'react';
import {Button, ButtonProps, useTheme} from '@tsejerome/ui-kitten-components';
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
  colorStyle?: ButtonColorStyle;
}

const ButtonStyleOptionsWithNumbers = [
  'minHeight',
  'borderRadius',
  'borderWidth',
  'paddingHorizontal',
];

export enum ButtonColorStyle {
  default = 'default',
  radical = 'radical',
}

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
  ({size = 'medium', children, colorStyle, style, ...rest}: MyButtonProps) => {
    const theme = useTheme();
    const defaultColorStyle = (
      cStyle: ButtonColorStyle = ButtonColorStyle.default,
    ) => {
      if (cStyle === ButtonColorStyle.radical)
        return {
          backgroundColor: theme['color-radical-100'],
        };
      return {};
    };
    let [finalizedStyle, setFinalizedStyle] = useState<StyleProp<TextStyle>>(
      {},
    );
    useEffect(() => {
      let defaultStyles: StyleProp<TextStyle> = defaultColorStyle(colorStyle);
      console.log(JSON.stringify(defaultStyles), ' defaultStyles');
      console.log('wtf');
      defaultStyles = {
        ...defaultStyles,
        ...parseUiKittenStyle(size as sizeOptions),
      };
      console.log(JSON.stringify(defaultStyles), ' defaultStyles');
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
