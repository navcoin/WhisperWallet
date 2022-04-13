import React from 'react';
import {TouchableOpacity, ViewStyle, StyleProp} from 'react-native';
import {StyleService, useStyleSheet, Icon} from '@ui-kitten/components';

import Text, {MyTextProps} from './Text';
import {scale} from 'react-native-size-matters';

interface Props extends MyTextProps {
  title: string;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  styleIcon?: StyleProp<ViewStyle>;
  onPress?(): void;
  center?: boolean;
}

const ButtonText = ({
  title,
  icon,
  style,
  styleIcon,
  center,
  onPress,
  ...props
}: Props) => {
  const styles = useStyleSheet(themedStyles);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        style,
        {alignSelf: center ? 'center' : undefined, alignItems: 'center'},
      ]}>
      {icon ? (
        <Icon
          style={[styleIcon, {width: scale(16), height: scale(16)}]}
          pack="assets"
          name={icon}
        />
      ) : null}
      <Text {...props}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonText;

const themedStyles = StyleService.create({
  container: {
    flexDirection: 'row',
  },
});
