import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon, useTheme, useStyleSheet } from '@tsejerome/ui-kitten-components';
import Text from './Text';
import AnimatedAppearance from './AnimatedAppearance';
import Identicon from './Identicon';
import {
  Animation_Types_Enum,
  Balance_Types_Enum,
  BalanceFragment,
  Connection_Stats_Enum,
} from '@constants';
import { scale } from 'react-native-size-matters';
import DisplayCoinAndFiatValue from './DisplayCoinAndFiatValue';
import { useExchangeRate, useWallet } from '@hooks';
import { balanceCardStyles } from './styles';

interface BalanceProps {
  item: BalanceFragment;
  onPress?(): void;
  index: number;
  hideFiat: boolean;
  isFiatHidden: boolean;
}

const BalanceCard = ({
  item,
  index,
  onPress,
  isFiatHidden = false,
}: BalanceProps) => {
  const theme = useTheme();
  const styles = useStyleSheet(balanceCardStyles);
  const { selectedCurrency } = useExchangeRate();

  const { connected, firstSyncCompleted } = useWallet();

  const { name, amount, pending_amount, type_id, currency, tokenId, mine } =
    item;

  const iconName =
    type_id == Balance_Types_Enum.Staking
      ? 'factory'
      : type_id == Balance_Types_Enum.Nav
      ? 'nav'
      : 'xnav';

  const tintColor =
    type_id == Balance_Types_Enum.Staking ? theme['color-staking'] : undefined;

  return (
    <AnimatedAppearance type={Animation_Types_Enum.SlideInRight} index={index}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.container, styles.containerBackgroundColor]}>
        <View style={styles.content}>
          <View style={styles.walletIcon}>
            {type_id == Balance_Types_Enum.PrivateToken ||
            type_id == Balance_Types_Enum.Nft ? (
              <Identicon value={tokenId} />
            ) : (
              <Icon
                pack="assets"
                name={iconName}
                style={{
                  tintColor: tintColor,
                  width: scale(32),
                  height: scale(32),
                }}
              />
            )}
          </View>
          <View style={styles.textContent}>
            <View style={styles.flexRow}>
              <Text adjustsFontSizeToFit numberOfLines={2} category="headline">
                {name + ' '}
              </Text>
              {mine && (
                <Text style={styles.mineTextColor} category={'caption2'}>
                  MINE
                </Text>
              )}
            </View>
            {connected === Connection_Stats_Enum.Connecting &&
            !firstSyncCompleted ? (
              <Text style={{ fontSize: scale(13) }}>Connecting...</Text>
            ) : connected === Connection_Stats_Enum.Syncing ? (
              <Text style={styles.fontSize13}>Synchronizing...</Text>
            ) : (
              <DisplayCoinAndFiatValue
                type={type_id}
                formatType={type_id}
                coinAmount={amount + pending_amount}
                currency={currency}
                hideFiat={isFiatHidden}
                fiatCurrency={selectedCurrency}
              />
            )}
          </View>
        </View>
        <Icon
          pack="assets"
          name="arrowRight16"
          style={[styles.icon, styles.tintColorBasic]}
        />
      </TouchableOpacity>
    </AnimatedAppearance>
  );
};

export default BalanceCard;
