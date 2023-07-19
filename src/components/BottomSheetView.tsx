import { View } from 'react-native';
import React, { memo } from 'react';
import { useStyleSheet } from '@tsejerome/ui-kitten-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bottomSheetViewStyles } from './styles';
const BottomSheetView = (props: any) => {
  const styles = useStyleSheet(bottomSheetViewStyles);

  const { bottom: safeBottomArea } = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingBottom: safeBottomArea || 6,
        ...styles.contentContainer,
      }}>
      {props.children}
    </View>
  );
};

export default memo(BottomSheetView);
