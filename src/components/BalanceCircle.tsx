import { View } from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { useWallet, useExchangeRate, useTraceUpdates } from '@hooks';
import { Connection_Stats_Enum } from '../constants/Type';
import CurrencyText from './CurrencyText';
import Text from './Text';
import { scale } from 'react-native-size-matters';
import AnimatedSegments from './AnimatedSegments';
import { ToFiat } from '@utils';
import { balanceCircleStyles as styles } from './styles';

const BalanceCircle = memo(() => {
  const { hideFiat, selectedCurrency, HIDE_CURRENCY, currencyRate } =
    useExchangeRate();
  const [currency, setCurrency] = useState(selectedCurrency);
  const [fiatContent, setFiatContent] = useState(<></>);
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

  useEffect(() => {
    setFiatContent(
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
      </>,
    );
  }, [currency, hideFiat, currencyRate, totalBalance]);

  useTraceUpdates('BalanceCircle', {
    connected,
    syncProgress,
    segments,
    firstSyncCompleted,
    bootstrapProgress,
    totalBalance,
    balances,
    selectedCurrency,
  });

  return (
    <View style={styles.container}>
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
        <Text style={[styles.posAbsolute, styles.textAlignCenter]}>
          Connecting...
        </Text>
      ) : !firstSyncCompleted && connected == Connection_Stats_Enum.Syncing ? (
        <Text style={[styles.posAbsolute, styles.textAlignCenter]}>
          {syncProgress}%
        </Text>
      ) : !firstSyncCompleted &&
        connected == Connection_Stats_Enum.Bootstrapping ? (
        <Text style={[styles.posAbsolute, styles.textAlignCenter]}>
          {bootstrapProgress} txs in queue
        </Text>
      ) : (
        <View style={[styles.posAbsolute]}>
          <Text style={[styles.textAlignCenter]}>Balance:</Text>
          <View style={styles.currencyTextContainer}>
            <CurrencyText
              adjustsFontSizeToFit
              category="caption1"
              children={totalBalance.toFixed(8)}
            />
            {selectedCurrency === HIDE_CURRENCY ? <></> : <>{fiatContent}</>}
          </View>
        </View>
      )}
    </View>
  );
});

export default BalanceCircle;
