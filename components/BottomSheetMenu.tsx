import Text from './Text';
import OptionCard from './OptionCard';
import {View} from 'react-native';
import React, {memo, useMemo, useState} from 'react';
import {StyleService, useStyleSheet} from '@ui-kitten/components';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList, WalletParamList} from '../navigation/type';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBottomSheet} from '../hooks/useBottomSheet';

const BottomSheetMenu = (props: any) => {
  const styles = useStyleSheet(themedStyles);
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();
  const {collapse} = useBottomSheet();
  const {bottom: safeBottomArea} = useSafeAreaInsets();

  return (
    <View
      style={{paddingBottom: safeBottomArea || 6, ...styles.contentContainer}}>
      <Text category={'title4'} center style={{marginBottom: 32}}>
        {props.title} {props.ignoreSuffix ? '' : 'Wallet'}
      </Text>

      {props.options &&
        props.options.map((el: any) => (
          <OptionCard
            item={{text: el.text}}
            index={0}
            id={el.text}
            key={el.text}
            icon={el.icon}
            color={'white'}
            onPress={() => {
              if (el.onPress) {
                el.onPress();
              } else if (el.navigate) {
                navigate('Wallet', el.navigate);
              }
              if (!el.skipCollapse) {
                collapse();
              }
            }}
            selected={''}
          />
        ))}
    </View>
  );
};

export default memo(BottomSheetMenu);

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
