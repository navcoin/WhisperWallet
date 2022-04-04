import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import {Icon, useTheme} from '@ui-kitten/components';

import Text from './Text';
import AnimatedAppearance from './AnimatedAppearance';

import {Animation_Types_Enum} from '../constants/Type';

interface ItemProps {
  text: string;
}

type CardStyle = 'outline' | 'fill';
interface OptionProps {
  item: ItemProps;
  onPress?(): void;
  index: number;
  selected: string;
  id: string;
  icon: string;
  color: string;
  showArrow?: boolean;
  animationType?: Animation_Types_Enum;
  cardType?: 'outline' | 'fill';
}

const OptionCard = ({
  item,
  index,
  onPress,
  selected,
  id,
  icon,
  color,
  showArrow,
  animationType = Animation_Types_Enum.SlideInRight,
  cardType = 'fill',
}: OptionProps) => {
  const theme = useTheme();

  const {text} = item;
  const isSelected = selected === text || (id && selected === id);

  const setContainerStyle = (type: CardStyle): ViewStyle => {
    const styleResult = {
      paddingLeft: icon ? 10 : 12,
      paddingRight: 12,
    };
    if (type === 'fill') {
      Object.assign(styleResult, {
        backgroundColor: isSelected
          ? theme['background-basic-color-4']
          : theme['background-basic-color-2'],
        borderColor: 'transparent',
      });
    }
    if (type === 'outline') {
      Object.assign(styleResult, {
        borderStyle: 'dashed',
        borderColor: '#FFFFFF99',
      });
    }
    return styleResult;
  };

  return (
    <AnimatedAppearance type={animationType} index={index}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.container, {}, setContainerStyle(cardType)]}>
        <View style={styles.content}>
          {icon ? (
            <View style={styles.leftIcon}>
              <Icon
                pack="assets"
                name={icon || 'creditCard'}
                style={{tintColor: color || theme['icon-basic-color']}}
              />
            </View>
          ) : null}
          <View>
            <Text style={{color: color || 'white'}} category="headline">
              {text ? text : ''}
            </Text>
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
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
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
