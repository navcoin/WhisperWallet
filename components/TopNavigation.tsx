import React, {memo} from 'react';
import {
  Icon,
  TopNavigation,
  TopNavigationAction,
  TopNavigationProps,
} from '@tsejerome/ui-kitten-components';
import {useNavigation} from '@react-navigation/native';
import {verticalScale, scale} from 'react-native-size-matters';

interface TopNavigationProps_ extends TopNavigationProps {
  hideBack?: boolean | undefined;
  pressBack?: () => void;
}

const TopNavigationComponent = memo((props: TopNavigationProps_) => {
  const {goBack} = useNavigation();
  return (
    <TopNavigation
      {...props}
      accessoryLeft={
        !props.hideBack ? (
          <TopNavigationAction
            style={{padding: scale(20)}}
            icon={
              <Icon width={scale(20)} height={scale(20)} name={'leftArrow'} />
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
