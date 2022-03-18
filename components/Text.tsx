import React, {memo} from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {Text, TextProps} from '@ui-kitten/components';
import {EvaStatus} from '@ui-kitten/components/devsupport';

export interface MyTextProps extends TextProps {
  style?: StyleProp<TextStyle>;
  category?:
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
  status?:
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
const getLineHeight = (
  category:
    | 'roboto'
    | 'extra'
    | 'extra-1'
    | 'header'
    | 'title1'
    | 'title2'
    | 'title3'
    | 'title4'
    | 'body'
    | 'call-out'
    | 'headline'
    | 'subhead'
    | 'footnote'
    | 'caption1'
    | 'caption2'
    | 'h6'
    | 'label',
): number => {
  switch (category) {
    case 'roboto':
      return 37.5;
    case 'extra':
      return 85.79;
    case 'extra-1':
      return 66.83;
    case 'header':
      return 44;
    case 'title1':
      return 40;
    case 'title2':
      return 40;
    case 'title3':
      return 36;
    case 'title4':
      return 24;
    case 'body':
      return 24;
    case 'call-out':
      return 24;
    case 'headline':
      return 22;
    case 'subhead':
      return 20;
    case 'footnote':
      return 18;
    case 'caption1':
      return 16;
    case 'caption2':
      return 13;
    case 'h6':
      return 18;
    default:
      return 24;
  }
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

    return (
      <Text
        category={category}
        status={status}
        style={[
          {
            marginLeft: marginLeft,
            marginRight: marginRight,
            marginTop: marginTop,
            paddingTop: paddingTop,
            paddingBottom: paddingBottom,
            marginBottom: marginBottom,
            marginVertical: marginVertical,
            marginHorizontal: marginHorizontal,
            opacity: opacity,
            textAlign: textAlign,
            maxWidth: maxWidth,
            lineHeight: getLineHeight(category),
            textTransform: textTransform,
            textDecorationLine: textDecorationLine,
            fontStyle: fontStyle,
          },
          style,
        ]}
        {...rest}>
        {children}
      </Text>
    );
  },
);
