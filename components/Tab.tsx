import React from 'react';
import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {useTheme, Layout} from '@tsejerome/ui-kitten-components';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import Text from './Text';

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

  React.useEffect(() => {
    transX.value = widthItem * selectedIndex;
  }, [selectedIndex, transX, widthItem]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(transX.value, {
            stiffness: 200,
            damping: 15,
          }),
        },
      ],
      backgroundColor: theme['color-primary-100'],
    };
  });

  return (
    <Layout style={[styles.container, style]}>
      {tabs.map((item, index) => {
        return (
          <TouchableOpacity
            style={styles.btn}
            key={index}
            activeOpacity={0.7}
            onPress={() => onChange(index)}>
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
      <Animated.View
        style={[
          styles.boxAni,
          animatedStyles,
          {width: `${100 / tabs.length}%`},
        ]}
        onLayout={({nativeEvent}) => setWidthItem(nativeEvent.layout.width)}
      />
    </Layout>
  );
};

export default FrequencyTab;

const styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: 'row',
    overflow: 'hidden',
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3E4C59',
  },
  boxAni: {
    height: 2,
    position: 'absolute',
    borderRadius: 20,
    bottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
