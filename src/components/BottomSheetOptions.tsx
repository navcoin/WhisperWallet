import Text from './Text';
import OptionCard from './OptionCard';
import { View } from 'react-native';
import React from 'react';
import { useStyleSheet } from '@tsejerome/ui-kitten-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomSheet } from '@hooks';
import { bottomSheetOptionStyles } from './styles';

const BottomSheetOptions = (props: any) => {
  const styles = useStyleSheet(bottomSheetOptionStyles);
  const { collapse } = useBottomSheet();

  const { bottom: safeBottomArea } = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingBottom: safeBottomArea || 60,
        ...styles.contentContainer,
      }}>
      <Text category={'title4'} center style={styles.marginBottom32}>
        {props.title}
      </Text>

      {props.options &&
        props.options
          .filter(el => !!el)
          .map((el: any) => (
            <OptionCard
              item={{ text: el.text }}
              index={0}
              id={el.text}
              key={el.text}
              icon={el.icon}
              identicon={el.identicon}
              onPress={() => {
                props.onSelect(el);
                collapse();
              }}
              selected={''}
            />
          ))}
    </View>
  );
};

export default BottomSheetOptions;
