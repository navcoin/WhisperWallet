import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  useTheme,
  Layout,
  useStyleSheet,
} from '@tsejerome/ui-kitten-components';
import Text from './Text';
import BottomSheetOptions from './BottomSheetOptions';
import { useBottomSheet } from '@hooks';
import { cardSelectStyles } from './styles';

interface InputSelectProps {
  defaultOption?: string;
  text?: string;
  options?: any;
  onSelect: any;
}

const CardSelect = ({
  text,
  defaultOption,
  options,
  onSelect,
}: InputSelectProps) => {
  const theme = useTheme();
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const styles = useStyleSheet(cardSelectStyles);
  const bottomSheet = useBottomSheet();

  useEffect(() => {
    setSelectedOption(defaultOption);
  }, [defaultOption]);

  const showOptions = () =>
    bottomSheet.expand(
      <BottomSheetOptions
        title={text}
        options={options}
        bottomSheetRef={bottomSheet.getRef}
        onSelect={el => {
          setSelectedOption(el.text);
          onSelect(el);
        }}
      />,
    );

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          showOptions();
        }}>
        <Layout level="2" style={styles.card}>
          <View>
            <Text category="headline">{text}</Text>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={styles.text}
              category="headline">
              {selectedOption}
            </Text>
          </View>
        </Layout>
      </TouchableOpacity>
    </>
  );
};

export default CardSelect;
