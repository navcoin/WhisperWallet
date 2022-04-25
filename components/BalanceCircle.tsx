import SegmentCircle from './SegmentCircle';
import {View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import useLayout from '../hooks/useLayout';
import useWallet from '../hooks/useWallet';
import {useTheme} from '@tsejerome/ui-kitten-components';
import {Connection_Stats_Enum} from '../constants/Type';
import CurrencyText from './CurrencyText';
import Text from './Text';
import {verticalScale} from 'react-native-size-matters';
import BackgroundTimer from 'react-native-background-timer';

const BalanceCircle = memo(() => {
  const {height} = useLayout();
  const {
    syncProgress,
    bootstrapProgress,
    balances,
    connected,
    firstSyncCompleted,
  } = useWallet();
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
  const [rotation, setRotation] = useState(180);

  useEffect(() => {
    if (
      connected != Connection_Stats_Enum.Connecting &&
      connected != Connection_Stats_Enum.Bootstrapping
    ) {
      BackgroundTimer.stopBackgroundTimer();
      setRotation(180);
    } else {
      BackgroundTimer.stopBackgroundTimer();
      BackgroundTimer.runBackgroundTimer(() => {
        setRotation(prev => {
          return (prev + 2) % 360;
        });
      }, 10);
    }
  }, [connected]);

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
          color: theme['color-xnav'],
        },
        {
          size: balances.staked.confirmed + balances.staked.pending,
          color: theme['color-staking'],
        },
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
      <SegmentCircle
        radius={(height * 0.6) / 2 / 2}
        initialRotation={
          connected != Connection_Stats_Enum.Connecting &&
          connected != Connection_Stats_Enum.Bootstrapping
            ? 180
            : rotation
        }
        background={
          connected == Connection_Stats_Enum.Connecting ||
          connected == Connection_Stats_Enum.Syncing ||
          connected == Connection_Stats_Enum.Bootstrapping
            ? theme['color-basic-800']
            : undefined
        }
        segmentsSource={
          connected == Connection_Stats_Enum.Connecting ||
          connected == Connection_Stats_Enum.Bootstrapping
            ? [
                {
                  size: 5,
                  color: theme['color-nav-pink'],
                },
                {
                  size: 95,
                  color: 'transparent',
                },
              ]
            : connected == Connection_Stats_Enum.Syncing
            ? [
                {
                  size: syncProgress,
                  color: theme['color-nav-pink'],
                },
                {
                  size: 100 - syncProgress,
                  color: 'transparent',
                },
              ]
            : balanceSegments
        }
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
