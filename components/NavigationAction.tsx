import React, {memo} from 'react';
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {
  useTheme,
  Icon,
  TopNavigationAction,
} from '@tsejerome/ui-kitten-components';
import {useNavigation} from '@react-navigation/native';

import Text from './Text';

import {EvaStatus} from '@tsejerome/ui-kitten-components/devsupport';
import {scale} from 'react-native-size-matters';

interface NavigationActionProps {
  icon?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  backgroundColor?: string | ColorValue;
  onPress?: () => void;
  title?: string;
  titleStatus?: EvaStatus | 'body' | 'white';
  status?: 'basic' | 'primary' | 'snow' | 'blue';
  size?: 'giant' | 'large' | 'medium' | 'small'; // giant-58-icon-24 large-48-icon-24  medium-40-icon-24  small-32-icon-16
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const NavigationAction = memo(
  ({
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    marginHorizontal,
    marginVertical,
    onPress,
    icon,
    title,
    size = 'giant',
    status = 'basic',
    titleStatus,
    disabled,
    backgroundColor,
    style,
  }: NavigationActionProps) => {
    const themes = useTheme();

    const {goBack} = useNavigation();
    const _onPress = React.useCallback(() => {
      if (onPress) {
        onPress && onPress();
      } else {
        goBack();
      }
    }, [onPress, goBack]);

    const getIconColor = (
      status: 'basic' | 'primary' | 'snow' | 'blue',
    ): string => {
      switch (status) {
        case 'basic':
          return themes['icon-basic-color'];
        case 'primary':
          return themes['color-primary-100'];
        case 'snow':
          return themes['text-snow-color'];
        case 'blue':
          return themes['text-blue-color'];
        default:
          return themes['color-primary-100'];
      }
    };

    const getSize = (size: 'giant' | 'large' | 'medium' | 'small'): number => {
      switch (size) {
        case 'giant':
          return 58;
        case 'large':
          return 48;
        case 'medium':
          return 40;
        case 'small':
          return 32;
        default:
          return 40;
      }
    };

    const getSizeIcon = (
      size: 'giant' | 'large' | 'medium' | 'small',
    ): number => {
      switch (size) {
        case 'giant':
          return 24;
        case 'large':
          return 20;
        case 'medium':
          return 20;
        case 'small':
          return 16;
        default:
          return 24;
      }
    };

    const getBorderRadius = (
      size: 'giant' | 'large' | 'medium' | 'small',
    ): number => {
      switch (size) {
        case 'giant':
          return 48;
        case 'large':
          return 24;
        case 'medium':
          return 12;
        case 'small':
          return 8;
        default:
          return 12;
      }
    };

    return title ? (
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.7}
        onPress={_onPress}>
        <Text category="headline" status={titleStatus}>
          {title}
        </Text>
      </TouchableOpacity>
    ) : (
      <TopNavigationAction
        onPress={_onPress}
        disabled={disabled}
        activeOpacity={0.7}
        style={[
          styles.container,
          style,
          {
            marginBottom: marginBottom ? scale(marginBottom) : undefined,
            marginTop: marginTop ? scale(marginTop) : undefined,
            marginLeft: marginLeft ? scale(marginLeft) : undefined,
            marginRight: marginRight ? scale(marginRight) : undefined,
            marginHorizontal: marginHorizontal
              ? scale(marginHorizontal)
              : undefined,
            marginVertical: marginVertical ? scale(marginVertical) : undefined,
            height: scale(getSize(size)),
            width: scale(getSize(size)),
            borderRadius: scale(getBorderRadius(size)),
            backgroundColor: backgroundColor,
          },
        ]}
        icon={props => (
          <Icon
            {...props}
            pack="assets"
            name={icon || 'cancel'}
            style={[
              {
                height: scale(getSizeIcon(size)),
                width: scale(getSizeIcon(size)),
              },
              {tintColor: getIconColor(status)},
            ]}
          />
        )}
      />
    );
  },
);

export default NavigationAction;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
