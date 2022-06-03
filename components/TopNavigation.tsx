import React, {memo} from 'react';
import {
  TopNavigation,
  TopNavigationAction,
  TopNavigationProps,
} from '@tsejerome/ui-kitten-components';
import {useNavigation} from '@react-navigation/native';
import {verticalScale, scale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';

interface TopNavigationProps_ extends TopNavigationProps {
  hideBack?: boolean | undefined;
  pressBack?: () => void;
}

const TopNavigationComponent = memo((props: TopNavigationProps_) => {
  const {goBack} = useNavigation();
  return (
    <TopNavigation
      style={{marginBottom: scale(12)}}
      {...props}
      accessoryLeft={
        !props.hideBack ? (
          <TopNavigationAction
            style={{padding: scale(20)}}
            icon={
              <Icon size={scale(20)} color={'white'} name={'arrow-back'} />
            }
            onPress={props.pressBack ? props.pressBack : goBack}
          />
        ) : (
          <></>
        )
      }
    />
  );
});

export default TopNavigationComponent;
