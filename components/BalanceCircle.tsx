import SegmentCircle from './SegmentCircle';
import {View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import useLayout from '../hooks/useLayout';
import useWallet from '../hooks/useWallet';
import {useTheme, Text} from '@ui-kitten/components';
import {Connection_Stats_Enum} from '../constants/Type';
import CurrencyText from './CurrencyText';

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
  const [rotation, setRotation] = useState(180);
  const [timer, setTimer] = useState<any>(undefined);

  useEffect(() => {
    if (connected != Connection_Stats_Enum.Connecting || syncProgress > 0) {
      setRotation(180);
      clearInterval(timer);
    } else {
      setTimer(
        setInterval(() => {
          setRotation(prev => {
            return prev + 2;
          });
        }, 10),
      );
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
        initialRotation={rotation}
        radius={width / 2 - 100}
        background={
          connected == Connection_Stats_Enum.Connecting ||
          syncing ||
          syncProgress === 0
            ? theme['color-basic-800']
            : undefined
        }
        segmentsSource={
          connected == Connection_Stats_Enum.Connecting || syncProgress === 0
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
            : syncing
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
      ) : syncing || syncProgress === 0 ? (
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
