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
  white = 'white',
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
          buttonStyle: {backgroundColor: theme['color-radical-100']},
          textStyle: {},
        };
      if (cStyle === ButtonColorStyle.white)
        return {
          buttonStyle: {backgroundColor: 'white'},
          textStyle: {color: theme['color-basic-800']},
        };
      return {buttonStyle: {}, textStyle: {}};
    };
    let [finalizedButtonStyle, setFinalizedStyle] = useState<
      StyleProp<TextStyle>
    >({});
    let [finalizedTextStyle, setFinalizedTextStyle] = useState<
      StyleProp<TextStyle>
    >({});
    useEffect(() => {
      let defaultStyles = defaultColorStyle(colorStyle);
      let defaultButtonStyles: StyleProp<TextStyle> = defaultStyles.buttonStyle;
      defaultButtonStyles = {
        ...defaultButtonStyles,
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
      setFinalizedStyle([defaultButtonStyles, injectedStyles]);
      setFinalizedTextStyle(defaultStyles.textStyle);
    }, [size, style]);
    return (
      <Button style={finalizedButtonStyle} {...rest}>
        {evaProps => (
          <Text
            style={[{fontWeight: '700'}, finalizedTextStyle]}
            category={'call-out'}>
            {children}
          </Text>
        )}
      </Button>
    );
  },
);
