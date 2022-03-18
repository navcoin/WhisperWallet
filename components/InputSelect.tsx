import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme, Icon} from '@ui-kitten/components';

import Text from './Text';

interface InputSelectProps {
  title?: string;
  value?: string;
  onPress?(): void;
}

const InputSelect = ({title, value, onPress, hideArrow}: InputSelectProps) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.container, {borderBottomColor: theme['color-basic-800']}]}
      onPress={onPress}>
      <Text category="body" status="snow" marginRight={24}>
        {title}
      </Text>
      <View style={styles.content}>
        <Text category="headline" status="white">
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    width: 12,
    height: 12,
    marginLeft: 6,
  },
});
