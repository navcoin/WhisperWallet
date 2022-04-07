import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon, useTheme} from '@ui-kitten/components';

import Text from './Text';
import AnimatedAppearance from './AnimatedAppearance';

import {Animation_Types_Enum} from '../constants/Type';

interface ItemProps {
  text: string;
}

interface OptionProps {
  item: ItemProps;
  onPress?(): void;
  index: number;
  selected: string;
  id: string;
  icon: string;
  iconColor?: string;
  showArrow?: boolean;
  backgroundSelected?: string;
  backgroundDefault?: string;
  animation?: Animation_Types_Enum;
}

const OptionCard = ({
  item,
  index,
  onPress,
  selected,
  id,
  icon,
  iconColor,
  showArrow,
  backgroundSelected,
  backgroundDefault,
  animation,
}: OptionProps) => {
  const theme = useTheme();

  const {text} = item;

  return (
    <AnimatedAppearance
      type={animation || Animation_Types_Enum.SlideInRight}
      index={index}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[
          styles.container,
          {
            backgroundColor:
              selected == text || (id && selected == id)
                ? backgroundSelected || theme['background-basic-color-4']
                : backgroundDefault || theme['background-basic-color-2'],
          },
        ]}>
        <View style={styles.content}>
          <View style={styles.walletIcon}>
            {icon != 'none' && (
              <Icon
                pack="assets"
                name={icon || 'creditCard'}
                style={{tintColor: iconColor || theme['icon-basic-color']}}
              />
            )}
          </View>
          <View>
            <Text category="headline">{text ? text : ''}</Text>
          </View>
        </View>
        {showArrow && (
          <Icon
            pack="assets"
            name="arrowRight16"
            style={[styles.icon, {tintColor: theme['icon-basic-color']}]}
          />
        )}
      </TouchableOpacity>
    </AnimatedAppearance>
  );
};

export default OptionCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 21,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    width: 16,
    height: 16,
  },
  card: {},
});
