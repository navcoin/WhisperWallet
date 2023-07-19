import React, { memo } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Text, TextProps } from '@tsejerome/ui-kitten-components';
import { EvaStatus } from '@tsejerome/ui-kitten-components/devsupport';
import {
  TEXT_CATEGORIES,
  TEXT_STYLE_VARIABLES,
} from '../constants/theme/TextSize';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';

type TextCategory =
  | 'h6'
  | 'roboto'
  | 'extra'
  | 'extra-1'
  | 'header'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'title4'
  | 'body'
  | 'headline'
  | 'call-out'
  | 'subhead'
  | 'footnote'
  | 'caption1'
  | 'caption2'
  | 'label';

type TextStatus =
  | EvaStatus
  | 'placeholder'
  | 'white'
  | 'corn'
  | 'black'
  | 'note'
  | 'blue'
  | 'salmon'
  | 'snow'
  | 'description'
  | 'details'
  | 'title'
  | 'grey300'
  | 'grey500';

export interface MyTextProps extends TextProps {
  style?: StyleProp<TextStyle>;
  category?: TextCategory;
  status?: TextStatus;
  children?: any;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  paddingTop?: number;
  paddingBottom?: number;
  marginBottom?: number;
  marginVertical?: number;
  marginHorizontal?: number;
  opacity?: number;
  maxWidth?: number;
  fontSize?: number;
  lineHeight?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
  none?: boolean;
  left?: boolean;
  right?: boolean;
  center?: boolean;
  underline?: boolean;
  bold?: boolean;
  italic?: boolean;
}
const getLineHeight = (category: TextCategory): number => {
  let lineHeight: number;
  switch (category) {
    case 'roboto': {
      lineHeight = 37.5;
      break;
    }
    case 'extra': {
      lineHeight = 85.79;
      break;
    }
    case 'extra-1': {
      lineHeight = 66.83;
      break;
    }
    case 'header': {
      lineHeight = 44;
      break;
    }
    case 'title1': {
      lineHeight = 40;
      break;
    }
    case 'title2': {
      lineHeight = 40;
      break;
    }
    case 'title3': {
      lineHeight = 36;
      break;
    }
    case 'title4': {
      lineHeight = 24;
      break;
    }
    case 'body': {
      lineHeight = 24;
      break;
    }
    case 'call-out': {
      lineHeight = 24;
      break;
    }
    case 'headline': {
      lineHeight = 22;
      break;
    }
    case 'subhead': {
      lineHeight = 20;
      break;
    }
    case 'footnote': {
      lineHeight = 18;
      break;
    }
    case 'caption1': {
      lineHeight = 16;
      break;
    }
    case 'caption2': {
      lineHeight = 13;
      break;
    }
    case 'h6': {
      lineHeight = 18;
      break;
    }
    default: {
      lineHeight = 24;
      break;
    }
  }
  return lineHeight;
};

const getFontSize = (category: TextCategory): number => {
  if (TEXT_CATEGORIES[category] && TEXT_CATEGORIES[category].fontSize) {
    const matchedStyle = TEXT_CATEGORIES[category].fontSize;
    return moderateScale(
      Number.parseInt(TEXT_STYLE_VARIABLES[matchedStyle], 0.8) as number,
    );
  }
  return scale(12);
};

export default memo(
  ({
    marginLeft,
    marginRight,
    marginTop,
    paddingTop,
    marginBottom,
    paddingBottom,
    marginVertical,
    marginHorizontal,
    opacity,
    uppercase,
    lowercase,
    capitalize,
    none,
    left,
    right,
    center,
    underline,
    bold,
    italic,
    category = 'call-out',
    status,
    children,
    maxWidth,
    style,
    ...rest
  }: MyTextProps) => {
    let textAlign: 'left' | 'center' | 'right' | 'auto' | 'justify' | 'left';

    left
      ? (textAlign = 'left')
      : right
      ? (textAlign = 'right')
      : center
      ? (textAlign = 'center')
      : (textAlign = 'left');

    let textTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'none';

    uppercase
      ? (textTransform = 'uppercase')
      : lowercase
      ? (textTransform = 'lowercase')
      : capitalize
      ? (textTransform = 'capitalize')
      : none
      ? (textTransform = 'none')
      : (textTransform = 'none');

    let textDecorationLine:
      | 'none'
      | 'underline'
      | 'line-through'
      | 'underline line-through';
    underline
      ? (textDecorationLine = 'underline')
      : (textDecorationLine = 'none');

    let fontStyle: 'normal' | 'italic';
    italic ? (fontStyle = 'italic') : (fontStyle = 'normal');

    let defaultStyles: StyleProp<TextStyle> = {
      marginLeft: marginLeft ? scale(marginLeft) : undefined,
      marginRight: marginRight ? scale(marginRight) : undefined,
      marginTop: marginTop ? verticalScale(marginTop) : undefined,
      paddingTop: paddingTop ? verticalScale(paddingTop) : undefined,
      paddingBottom: paddingBottom ? verticalScale(paddingBottom) : undefined,
      marginBottom: marginBottom ? verticalScale(marginBottom) : undefined,
      marginVertical: marginVertical
        ? verticalScale(marginVertical)
        : undefined,
      marginHorizontal: marginHorizontal ? scale(marginHorizontal) : undefined,
      opacity: opacity,
      textAlign: textAlign,
      maxWidth: maxWidth ? scale(maxWidth) : undefined,
      lineHeight: scale(getLineHeight(category)),
      textTransform: textTransform,
      textDecorationLine: textDecorationLine,
      fontStyle: fontStyle,
    };
    defaultStyles.fontSize = getFontSize(category);

    return (
      <Text
        category={category}
        status={status}
        style={[defaultStyles, style]}
        {...rest}>
        {children}
      </Text>
    );
  },
);
