import React from 'react';
import {ScrollViewProps} from 'react-native';
import {useTheme} from '@tsejerome/ui-kitten-components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface ContentProps extends ScrollViewProps {
  padder?: boolean;
  level?: '1' | '2' | '3' | '4';
}

const Content: React.FC<ContentProps> = ({
  style,
  contentContainerStyle,
  children,
  padder,
  level,
  ...props
}) => {
  const theme = useTheme();
  return (
    <KeyboardAwareScrollView
      {...props}
      style={[
        padder && {paddingHorizontal: 32},
        {backgroundColor: theme[`background-basic-color-${level}`]},
        style,
      ]}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}>
      {children}
    </KeyboardAwareScrollView>
  );
};

export default Content;
