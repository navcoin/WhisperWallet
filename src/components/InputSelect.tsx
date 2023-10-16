import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme, Icon, useStyleSheet } from '@tsejerome/ui-kitten-components';
import Text from './Text';
import { scale } from 'react-native-size-matters';
import { inputSelectStyles } from './styles';

interface InputSelectProps {
  title?: string;
  value?: string;
  onPress?(): void;
  hideArrow?: boolean;
  flexColumn?: boolean;
}

const InputSelect = ({
  title,
  value,
  onPress,
  hideArrow,
  flexColumn,
}: InputSelectProps) => {
  const theme = useTheme();
  const styles = useStyleSheet(inputSelectStyles);
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.container, styles.borderBottomColor]}
      onPress={onPress}>
      <View style={[styles.content, flexColumn && styles.flexColumn]}>
        <Text
          category="body"
          status="snow"
          marginRight={flexColumn ? 0 : scale(24)}>
          {title}
        </Text>
        <Text category="headline" status="white" {...{ center: flexColumn }}>
          {value}
        </Text>
        {onPress && !hideArrow && (
          <Icon
            pack="assets"
            name="arrowRight16"
            style={[
              styles.icon,
              {
                tintColor: theme['icon-basic-color'],
              },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default InputSelect;
