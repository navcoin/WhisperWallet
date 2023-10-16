import React from 'react';
import { Image, View, ImageSourcePropType, ScrollView } from 'react-native';
import Text from './Text';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useLayout } from '@hooks';
import { scale } from 'react-native-size-matters';
import { cardStyles as styles } from './styles';
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

const bottomButtonHeight = scale(32 + 64);
const spaceBetweenButtonAndContent = scale(16);

const Card = ({
  product: { color, title, description, image, id },
  x,
}: CardProps) => {
  const { height, width, top } = useLayout();
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
      transform: [{ translateX }, { scale }],
    };
  });

  const animatedViewStyles = {
    width: widthItem,
    paddingRight: 16,
  };
  const spacer = {
    paddingBottom: spaceBetweenButtonAndContent + bottomButtonHeight,
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{ width: widthItem, paddingTop: top }}>
      <Animated.View style={[animatedViewStyles]}>
        <View style={[styles.image, { backgroundColor: color }]}>
          <Image source={image} style={styles.imageContent} />
        </View>
      </Animated.View>
      <Animated.View style={[styleText, styles.textView, spacer]}>
        <Text marginTop={48} category="title1" center>
          {title}
        </Text>
        <Text marginTop={16} category="call-out" status="placeholder" center>
          {description}
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default Card;
