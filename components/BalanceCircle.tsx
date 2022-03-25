import SegmentCircle from './SegmentCircle';
import Text from './Text';
import {View} from 'react-native';
import CurrencyText from './CurrencyText';
import React, {memo, useEffect, useState} from 'react';
import useLayout from '../hooks/useLayout';
import useWallet from '../hooks/useWallet';
import {Icon, useTheme} from '@ui-kitten/components';
import {Connection_Stats_Enum} from '../constants/Type';

const BalanceCircle = memo(() => {
  const {width} = useLayout();
  const {syncProgress, syncing, balances, connected} = useWallet();
  const theme = useTheme();
  const [balanceSegments, setBalanceSegments] = useState<
    {
      size: number;
      color?: string;
    }[]
  >([
    {
      size: 100,
    },
  ]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    if (balances?.nav) {
      setTotalBalance(
        (balances.nav.confirmed +
          balances.xnav.confirmed +
          balances.staked.confirmed +
          balances.nav.pending +
          balances.xnav.pending +
          balances.staked.pending) /
          1e8,
      );
      setBalanceSegments([
        {
          size: balances.nav.confirmed + balances.nav.pending,
          color: theme['color-nav-pink'],
        },
        {
          size: balances.xnav.confirmed + balances.xnav.pending,
          color: 'orange',
        },
        {
          size: balances.staked.confirmed + balances.staked.pending,
          color: 'yellow',
        },
      ]);
    }
  }, [balances]);

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      }}>
      <SegmentCircle
        radius={width / 2 - 100}
        segments={
          syncing || syncProgress === 0
            ? [
                {
                  size: syncProgress,
                  color: theme['color-nav-pink'],
                },
                {
                  size: 100 - syncProgress,
                },
              ]
            : balanceSegments
        }
        maxArcSize={353}
      />
      {syncing || syncProgress === 0 ? (
        <Text style={{position: 'absolute', textAlign: 'center'}}>
          Synchronizing...{'\n'}
          {syncProgress}%
        </Text>
      ) : (
        <View style={{position: 'absolute'}}>
          <Text style={{textAlign: 'center'}}>Balance:</Text>
          <CurrencyText children={totalBalance} />
        </View>
      )}
    </View>
  );
});

export default BalanceCircle;
