import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {
  useTheme,
  Layout,
  useStyleSheet,
  StyleService,
} from '@tsejerome/ui-kitten-components';

import Text from './Text';
import BottomSheetOptions from './BottomSheetOptions';
import {useBottomSheet} from '../hooks/useBottomSheet';
import {scale, verticalScale} from 'react-native-size-matters';

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
  const styles = useStyleSheet(themedStyles);
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
          <View style={styles.row}>
            <Text style={{marginRight: scale(6)}} category="headline">
              {text}
            </Text>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{flex: 1}}
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

const themedStyles = StyleService.create({
  card: {
    borderRadius: scale(12),
    borderWidth: scale(1),
    borderColor: 'color-basic-1500',
    marginTop: verticalScale(24),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(12),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(24),
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
