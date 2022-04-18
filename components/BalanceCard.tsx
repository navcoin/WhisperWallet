import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon, useTheme} from '@tsejerome/ui-kitten-components';

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
import {scale} from 'react-native-size-matters';

interface BalanceProps {
  item: BalanceFragment;
  onPress?(): void;
  index: number;
}

const BalanceCard = ({item, index, onPress}: BalanceProps) => {
  const theme = useTheme();
  const {connected, firstSyncCompleted} = useWallet();

  const {name, amount, pending_amount, type_id, currency, tokenId} = item;

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
              <Icon
                pack="assets"
                name={
                  type_id == Balance_Types_Enum.Staking
                    ? 'factory'
                    : type_id == Balance_Types_Enum.Nav
                    ? 'nav'
                    : 'xnav'
                }
                style={{
                  tintColor:
                    type_id == Balance_Types_Enum.Staking
                      ? theme['color-staking']
                      : 'none',
                  width: 32,
                  height: 32,
                }}
              />
            )}
          </View>
          <View>
            <Text category="headline">{name}</Text>
            {connected === Connection_Stats_Enum.Connecting &&
            !firstSyncCompleted ? (
              <Text style={{fontSize: 13}}>Connecting...</Text>
            ) : connected === Connection_Stats_Enum.Syncing ? (
              <Text style={{fontSize: 13}}>Synchronizing...</Text>
            ) : (
              <CurrencyText
                category="footnote"
                children={amount + pending_amount}
                marginTop={4}
                type={type_id}
                formatType={type_id}
                currency={currency}
              />
            )}
          </View>
        </View>
        <Icon
          pack="assets"
          name="arrowRight16"
          style={[styles.icon, {tintColor: theme['icon-basic-color']}]}
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
    width: scale(16),
    height: scale(16),
    right: scale(16),
  },
});
