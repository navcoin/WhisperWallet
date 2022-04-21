import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import {Icon, useTheme} from '@tsejerome/ui-kitten-components';

import Text from './Text';
import AnimatedAppearance from './AnimatedAppearance';

import {Animation_Types_Enum} from '../constants/Type';
import {scale, verticalScale} from 'react-native-size-matters';

interface ItemProps {
  text: string;
}

type CardStyle = 'outline' | 'fill';
interface OptionProps {
  item: ItemProps;
  index: number;
  selected: string;
  id?: string;
  color?: string;
  icon?: string;
  onPress?: () => void;
  iconRight?: string;
  iconRightOnPress?: () => void;
  animationType?: Animation_Types_Enum;
  cardType?: 'outline' | 'fill';
  leftElement?: any;
}

const OptionCard = ({
  item,
  index,
  onPress,
  selected,
  id,
  icon,
  color,
  iconRight,
  iconRightOnPress,
  animationType = Animation_Types_Enum.SlideInRight,
  cardType = 'fill',
  leftElement,
}: OptionProps) => {
  const theme = useTheme();

  const {text} = item;
  const isSelected = selected === text || (id && selected === id);

  const setContainerStyle = (type: CardStyle): ViewStyle => {
    const styleResult = {};
    if (type === 'fill') {
      Object.assign(styleResult, {
        backgroundColor: isSelected
          ? theme['background-basic-color-2']
          : theme['background-basic-color-2'],
        borderColor: isSelected ? theme['color-xnav'] : 'transparent',
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
        style={[styles.container, setContainerStyle(cardType)]}>
        <View style={styles.contentWrapper}>
          <View style={[styles.iconWrapper, styles.leftIconWrapper]}>
            {leftElement ? (
              leftElement
            ) : (
              <Icon
                pack="assets"
                name={icon || 'creditCard'}
                style={[
                  styles.icon,
                  {tintColor: color || theme['icon-basic-color']},
                ]}
              />
            )}
          </View>
          <Text
            numberOfLines={3}
            style={[styles.content, {color: color || 'white'}]}
            category="headline">
            {text ? text : ''}
          </Text>
          {iconRight ? (
            <View style={[styles.iconWrapper, styles.rightIconWrapper]}>
              <TouchableOpacity
                style={[styles.rightIconTouchables]}
                onPress={iconRightOnPress}>
                <Icon
                  pack="assets"
                  name={iconRight}
                  style={[styles.icon, {tintColor: theme['icon-basic-color']}]}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </AnimatedAppearance>
  );
};

export default OptionCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: scale(1),
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifySelf: 'stretch',
    flexWrap: 'nowrap',
    flex: 1,
  },
  icon: {
    width: scale(24),
    height: scale(24),
  },
  content: {
    flex: 1,
  },
  iconWrapper: {
    borderRadius: scale(48),
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(12),
  },
  leftIconWrapper: {
    marginRight: scale(16),
  },
  rightIconWrapper: {
    marginLeft: scale(16),
  },
  rightIconTouchables: {
    justifyContent: 'center',
  },
});
