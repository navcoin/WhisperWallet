import React from 'react';
import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {useTheme, Layout} from '@tsejerome/ui-kitten-components';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import Text from './Text';
import {verticalScale, scale} from 'react-native-size-matters';

interface Props {
  style?: ViewStyle;
  selectedIndex: number;
  tabs: string[];

  onChange(index: number): void;
}

const FrequencyTab = ({style, selectedIndex, onChange, tabs}: Props) => {
  const theme = useTheme();
  const transX = useSharedValue(0);

  const [widthItem, setWidthItem] = React.useState(0);

  return (
    <Layout style={[styles.container, style]}>
      {tabs.map((item, index) => {
        return (
          <TouchableOpacity
            style={styles.btn}
            key={index}
            activeOpacity={0.7}
            onPressOut={() => onChange(index)}>
            <Text
              category="headline"
              marginTop={4}
              style={{
                color:
                  selectedIndex === index
                    ? theme['color-basic-100']
                    : theme['color-basic-1200'],
              }}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
      <View
        style={[
          styles.boxAni,
          {
            transform: [
              {
                translateX: widthItem * selectedIndex,
              },
            ],
            backgroundColor: theme['color-primary-100'],
            width: `${100 / tabs.length}%`
          },
        ]}
        onLayout={({nativeEvent}) => setWidthItem(nativeEvent.layout.width)}
      />
    </Layout>
  );
};

export default FrequencyTab;

const styles = StyleSheet.create({
  container: {
    height: verticalScale(44),
    flexDirection: 'row',
    overflow: 'hidden',
    alignSelf: 'center',
    borderBottomWidth: verticalScale(1),
    borderBottomColor: '#3E4C59',
  },
  boxAni: {
    height: verticalScale(2),
    position: 'absolute',
    borderRadius: scale(20),
    bottom: 0,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
