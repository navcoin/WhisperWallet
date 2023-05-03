import {View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {useWallet, useExchangeRate} from '@hooks';
import {Connection_Stats_Enum} from '../constants/Type';
import CurrencyText from './CurrencyText';
import Text from './Text';
import {scale, verticalScale} from 'react-native-size-matters';
import {AnimatedSegments} from './AnimatedSegments';
import useTraceUpdates from '../src/hooks/useTraceUpdates';
import {ToFiat} from '@utils';

const BalanceCircle = memo(() => {
  const {hideFiat, selectedCurrency, HIDE_CURRENCY} = useExchangeRate();
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

  useTraceUpdates('BalanceCircle', {
    connected,
    syncProgress,
    segments,
    firstSyncCompleted,
    bootstrapProgress,
    totalBalance,
    balances,
  });

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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CurrencyText
              adjustsFontSizeToFit
              category="caption1"
              children={totalBalance.toFixed(8)}
            />
            {selectedCurrency === HIDE_CURRENCY ? (
              <></>
            ) : (
              <>
                <Text adjustsFontSizeToFit marginHorizontal={3} category="body">
                  /
                </Text>
                <ToFiat
                  adjustsFontSizeToFit
                  category="caption1"
                  totalAmount={totalBalance}
                  hideFiat={hideFiat}
                />
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
});

export default BalanceCircle;
