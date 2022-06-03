import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@tsejerome/ui-kitten-components';

import IconArrow from 'react-native-vector-icons/MaterialIcons';
import IconWallet from 'react-native-vector-icons/MaterialCommunityIcons';

import Text from './Text';
import CurrencyText from './CurrencyText';
import AnimatedAppearance from './AnimatedAppearance';
import Identicon from './Identicon';

import {
  Animation_Types_Enum,
  Balance_Types_Enum,
  BalanceFragment,
  Connection_Stats_Enum,
} from '../constants/Type';
import useWallet from '../hooks/useWallet';
import {scale, verticalScale} from 'react-native-size-matters';

interface BalanceProps {
  item: BalanceFragment;
  onPress?(): void;
  index: number;
}

const BalanceCard = ({item, index, onPress}: BalanceProps) => {
  const theme = useTheme();
  const {connected, firstSyncCompleted} = useWallet();

  const {name, amount, pending_amount, type_id, currency, tokenId, mine} = item;

  return (
    <AnimatedAppearance type={Animation_Types_Enum.SlideInRight} index={index}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[
          styles.container,
          {backgroundColor: theme['background-basic-color-2']},
        ]}>
        <View style={styles.content}>
          <View style={styles.walletIcon}>
            {type_id == Balance_Types_Enum.PrivateToken ||
            type_id == Balance_Types_Enum.Nft ? (
              <Identicon value={tokenId} />
            ) : (
              <IconWallet
                name={type_id == Balance_Types_Enum.Staking
                  ? 'chart-gantt'
                  : type_id == Balance_Types_Enum.Nav
                  ? 'hand-coin'
                  : 'hand-coin-outline'}
                size={scale(32)}
                color={
                  type_id == Balance_Types_Enum.Staking
                    ? theme['color-staking']
                    : type_id == Balance_Types_Enum.Nav
                    ? theme['color-nav-pink']
                    : theme['color-xnav']
                }
              />
            )}
          </View>
          <View style={styles.textContent}>
            <View style={{flexDirection: 'row'}}>
              <Text adjustsFontSizeToFit numberOfLines={2} category="headline">
                {name + ' '}
              </Text>
              {mine && (
                <Text
                  style={{color: theme['color-primary-100']}}
                  category={'caption2'}>
                  MINE
                </Text>
              )}
            </View>
            {connected === Connection_Stats_Enum.Connecting &&
            !firstSyncCompleted ? (
              <Text style={{fontSize: scale(13)}}>Connecting...</Text>
            ) : connected === Connection_Stats_Enum.Syncing ? (
              <Text style={{fontSize: scale(13)}}>Synchronizing...</Text>
            ) : (
              <CurrencyText
                adjustsFontSizeToFit
                category="footnote"
                children={(amount + pending_amount).toFixed(8)}
                marginTop={4}
                type={type_id}
                formatType={type_id}
                currency={currency}
              />
            )}
          </View>
        </View>
        <IconArrow
          style={styles.icon}
          name="keyboard-arrow-right"
          size={scale(25)}
          color={theme['icon-basic-color']}
        />
      </TouchableOpacity>
    </AnimatedAppearance>
  );
};

export default BalanceCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(12),
    paddingVertical: scale(10),
    paddingLeft: scale(10),
    paddingRight: scale(21),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
    paddingRight: scale(16),
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  walletIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(48),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  icon: {
    right: scale(18),
  },
});
