import Text from './Text';
import OptionCard from './OptionCard';
import {View} from 'react-native';
import React, {memo} from 'react';
import {StyleService, useStyleSheet} from '@ui-kitten/components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const BottomSheetView = (props: any) => {
  const styles = useStyleSheet(themedStyles);

  const {bottom: safeBottomArea} = useSafeAreaInsets();

  return (
    <View
      style={{paddingBottom: safeBottomArea || 6, ...styles.contentContainer}}>
      {props.children}
    </View>
  );
};

export default memo(BottomSheetView);

const themedStyles = StyleService.create({
  item: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  container: {
    flex: 1,
  },
  button: {padding: 100},
  contentContainer: {
    backgroundColor: 'background-basic-color-3',
    flex: 1,
    paddingTop: 8,
    padding: 20,
  },
});
