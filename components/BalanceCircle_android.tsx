import {View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import useWallet from '../hooks/useWallet';
import {Connection_Stats_Enum} from '../constants/Type';
import CurrencyText from './CurrencyText';
import Text from './Text';
import {scale, verticalScale} from 'react-native-size-matters';
import {AnimatedSegments} from './AnimatedSegments';
import useTraceUpdates from '../hooks/useTraceUpdates';

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

  useTraceUpdates('BalanceCircle', {connected, syncProgress, segments, firstSyncCompleted, bootstrapProgress, totalBalance, balances})

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(16),
      }}>
      {connected == Connection_Stats_Enum.Connecting ? (
        <Text style={{ textAlign: 'center'}}>
          Connecting...
        </Text>
      ) : !firstSyncCompleted && connected == Connection_Stats_Enum.Syncing ? (
        <Text style={{textAlign: 'center'}}>
          {syncProgress}%
        </Text>
      ) : !firstSyncCompleted &&
        connected == Connection_Stats_Enum.Bootstrapping ? (
        <Text style={{textAlign: 'center'}}>
          {bootstrapProgress} txs in queue
        </Text>
      ) : (
        <View>
          <CurrencyText children={totalBalance.toFixed(8)} />
        </View>
      )}
    </View>
  );
});

export default BalanceCircle;
