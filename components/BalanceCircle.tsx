import {View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import useWallet from '../hooks/useWallet';
import {Connection_Stats_Enum} from '../constants/Type';
import CurrencyText from './CurrencyText';
import Text from './Text';
import {scale, verticalScale} from 'react-native-size-matters';
import {AnimatedSegments} from './AnimatedSegments';

const BalanceCircle = memo(() => {
  const {
    syncProgress,
    bootstrapProgress,
    balances,
    connected,
    firstSyncCompleted,
  } = useWallet();
  const [totalBalance, setTotalBalance] = useState(0);
  const [segments, setSegments] = useState([0, 0, 0]);

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
      setSegments([
        balances.nav.confirmed + balances.nav.pending,
        balances.xnav.confirmed + balances.xnav.pending,
        balances.staked.confirmed + balances.staked.pending,
      ]);
    }
  }, [balances]);

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(16),
      }}>
      <AnimatedSegments
        strokeWidth={4}
        width={scale(300)}
        progressVisible={
          connected == Connection_Stats_Enum.Connecting ||
          connected == Connection_Stats_Enum.Bootstrapping ||
          connected == Connection_Stats_Enum.Syncing
        }
        progress={
          connected == Connection_Stats_Enum.Connecting ||
          connected == Connection_Stats_Enum.Bootstrapping
            ? -1
            : syncProgress / 100
        }
        segments={segments}
      />
      {connected == Connection_Stats_Enum.Connecting ? (
        <Text style={{position: 'absolute', textAlign: 'center'}}>
          Connecting...
        </Text>
      ) : !firstSyncCompleted && connected == Connection_Stats_Enum.Syncing ? (
        <Text style={{position: 'absolute', textAlign: 'center'}}>
          {syncProgress}%
        </Text>
      ) : !firstSyncCompleted &&
        connected == Connection_Stats_Enum.Bootstrapping ? (
        <Text style={{position: 'absolute', textAlign: 'center'}}>
          {bootstrapProgress} txs in queue
        </Text>
      ) : (
        <View style={{position: 'absolute'}}>
          <Text style={{textAlign: 'center'}}>Balance:</Text>
          <CurrencyText children={totalBalance.toFixed(8)} />
        </View>
      )}
    </View>
  );
});

export default BalanceCircle;
