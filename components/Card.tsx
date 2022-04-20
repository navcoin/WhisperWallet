import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  ImageSourcePropType,
  ScrollView,
} from 'react-native';
import Text from './Text';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import useLayout from '../hooks/useLayout';
import {scale, verticalScale} from 'react-native-size-matters';

interface Product {
  id: number;
  title: string;
  description: string;
  image: ImageSourcePropType;
  color: string;
}
interface CardProps {
  product: Product;
  x: Animated.SharedValue<number>;
}

const Card = ({
  product: {color, title, description, image, id},
  x,
}: CardProps) => {
  const {height, width, top} = useLayout();
  const widthItem = width - scale(80);

  const styleText = useAnimatedStyle(() => {
    const translateX = interpolate(
      x.value,
      [(id - 1) * widthItem, id * widthItem, (id + 1) * widthItem],
      [widthItem / 2, 0, -widthItem / 2],
      Extrapolate.CLAMP,
    );
    const scale = interpolate(
      x.value,
      [(id - 1) * widthItem, id * widthItem, (id + 1) * widthItem],
      [0.61, 1, 0.61],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{translateX}, {scale}],
    };
  });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{width: widthItem, paddingTop: top}}>
      <Animated.View
        style={[
          {
            width: widthItem,
            paddingRight: 16,
          },
        ]}>
        <View style={[styles.image, {backgroundColor: color}]}>
          <Image
            source={image}
            style={{
              width: '90%',
              marginVertical: verticalScale(50),
              maxWidth: verticalScale(200),
              maxHeight: verticalScale(200),
              height: undefined,
              aspectRatio: 1,
            }}
          />
        </View>
      </Animated.View>
      <Animated.View style={[styleText, styles.textView, styles.spacer]}>
        <Text marginTop={48} category="title1">
          {title}
        </Text>
        <Text marginTop={16} category="call-out" status="placeholder">
          {description}
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default Card;
const bottomButtonHeight = scale(32 + 64);
const spaceBetweenButtonAndContent = scale(16);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textView: {
    marginRight: scale(32),
  },
  image: {
    borderRadius: scale(16),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {paddingBottom: spaceBetweenButtonAndContent + bottomButtonHeight},
});
