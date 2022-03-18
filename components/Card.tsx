import React from 'react';
import {Image, View, StyleSheet, ImageSourcePropType} from 'react-native';
import Text from './Text';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import useLayout from '../hooks/useLayout';

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
  const widthItem = width - 80;

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
    <View style={{width: widthItem, paddingTop: top}}>
      <Animated.View
        style={[
          {
            width: widthItem,
            height: height / 2.2,
            paddingRight: 16,
          },
        ]}>
        <View style={[styles.image, {backgroundColor: color}]}>
          <Image
            source={image}
            style={{
              width: '90%',
              maxWidth: 300,
              maxHeight: 300,
              height: undefined,
              aspectRatio: 1,
            }}
          />
        </View>
      </Animated.View>
      <Animated.View style={[styleText, styles.textView]}>
        <Text marginTop={48} category="title1">
          {title}
        </Text>
        <Text marginTop={16} category="call-out" status="placeholder">
          {description}
        </Text>
      </Animated.View>
    </View>
  );
};

export default Card;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textView: {
    marginRight: 32,
  },
  image: {
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
