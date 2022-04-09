import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@ui-kitten/components';

import Text from './Text';
import CurrencyText from './CurrencyText';
import AnimatedAppearance from './AnimatedAppearance';

import dayjs from '../utils/dayjs';
import {Category_Types_Enum, TransactionFragment} from '../constants/Type';
import {Images} from '../assets/images';

interface TransactionProps {
  item: TransactionFragment;
  onPress?(): void;
  index?: number;
}

const Transaction = ({item, index, onPress}: TransactionProps) => {
  const theme = useTheme();
  const {name, note, amount, timestamp, type} = item;
  const memos = item.memos || {in: [], out: []};
  let category = {};

  if (type == 'nav' || type == 'cold_staking') {
    category = {icon: {path: Images.navLogo}};
  } else if (type == 'xnav') {
    category = {icon: {path: Images.xNavLogo}};
  }
  console.log(item);

  return (
    <AnimatedAppearance index={index}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.container,
          {backgroundColor: theme['background-basic-color-2']},
        ]}
        onPress={onPress}>
        <View
          style={[
            styles.iconView,
            {backgroundColor: theme['color-basic-1300']},
          ]}>
          {!!category?.icon?.path && (
            <Image source={category?.icon?.path} style={[styles.icon]} />
          )}
        </View>
        <View style={styles.content}>
          <Text category="headline" status="white" numberOfLines={1}>
            {(amount || 0) > 0
              ? 'Incoming ' +
                (memos.out.length > 1 ? memos.out.join(', ') : memos.out)
              : 'Outgoing'}
          </Text>
          <Text category="footnote" status="placeholder" marginTop={4}>
            {dayjs.unix(timestamp).format('DD MMMM YYYY HH:mm')}
          </Text>
        </View>
        <CurrencyText
          category="headline"
          status={(amount || 0) > 0 ? 'success' : 'danger'}
          currency={type == 'xnav' ? 'xNAV' : 'NAV'}>
          {(amount || 0) / 1e8}
        </CurrencyText>
      </TouchableOpacity>
    </AnimatedAppearance>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    paddingVertical: 12,
    paddingLeft: 10,
    paddingRight: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconView: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginRight: 24,
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});
