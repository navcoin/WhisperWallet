import {Pressable, RefreshControl, ScrollView, View} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import {BalanceFragment} from '@constants/Type';
import {useBottomSheet, useWallet} from '@hooks';
import {
  StyleService,
  useStyleSheet,
  useTheme,
  Icon,
} from '@tsejerome/ui-kitten-components';
import {FiatRequest} from '@service';
import {scale, verticalScale} from 'react-native-size-matters';

import {
  BalanceCard,
  BottomSheetMenu,
  Content,
  Text,
  LoadingComponent,
} from '@components';
import Fiat from './FiatPrices';

const Tokens = () => {
  const [account, setAccount] = useState<BalanceFragment | undefined>(
    undefined,
  );
  const {data, isError, isFetching, refetch, remove} = FiatRequest();

  const [fiatPrices, setFiatPrices] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getFiatPrices = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    try {
      remove();
      const res = await refetch();
      if (isFetching) {
        setIsLoading(true);
      } else if (!isFetching) {
        setFiatPrices(res.data['nav-coin']);
        setIsLoading(false);
      }
    } catch (e) {}
  }, [isFetching, refetch, remove]);

  useEffect(() => {
    if (isFetching) {
      setIsLoading(true);
    } else if (!isFetching) {
      setFiatPrices(data['nav-coin']);
      setIsLoading(false);
    }
  }, [isFetching, data]);

  const {refreshWallet, tokens} = useWallet();
  const bottomSheet = useBottomSheet();
  const styles = useStyleSheet(themedStyles);
  const theme = useTheme();

  const expandMenuToken = useCallback(
    account_ => {
      bottomSheet.expand(
        <BottomSheetMenu
          title={account_.name}
          options={[
            {
              text: 'View address to receive',
              icon: 'download',
              navigate: {
                screen: 'AddressScreen',
                params: {
                  from: account_,
                },
              },
            },
            {
              text: 'Send to someone',
              icon: 'diagonalArrow3',
              navigate: {
                screen: 'SendToScreen',
                params: {
                  from: account_,
                },
              },
            },
            {
              text: 'Transaction history',
              icon: 'suitcase',
              navigate: {
                screen: 'HistoryScreen',
                params: {
                  filter: account_,
                },
              },
            },
          ]}
        />,
      );
    },
    [bottomSheet],
  );

  const [tokensContent, setTokensContent] = useState(<></>);

  useEffect(() => {
    setTokensContent(
      <>
        {tokens.length == 0 ? (
          <Text marginBottom={scale(24)} center>
            No private tokens found
          </Text>
        ) : (
          tokens.map((el, i) => {
            return (
              <View style={styles.item} key={i}>
                <BalanceCard
                  item={{...el, name: el.name}}
                  index={i}
                  onPress={() => {
                    setAccount(el);
                    expandMenuToken(el);
                  }}
                />
              </View>
            );
          })
        )}
      </>,
    );
  }, [tokens]);

  return (
    <View
      style={{
        backgroundColor: theme['color-basic-700'],
        flex: 1,
        marginTop: scale(-6),
      }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refreshWallet}
            tintColor="#fff"
            titleColor="#fff"
          />
        }>
        <Content style={{paddingTop: verticalScale(24)}}>
          {tokensContent}
        </Content>
        <View
          style={{
            paddingBottom: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 16,
          }}>
          <Text>Exchange rates</Text>

          <Pressable onPress={() => getFiatPrices()}>
            <Icon
              style={{
                width: 15,
                height: 20,
              }}
              pack="eva"
              name="sync-outline"
              fill={theme['color-basic-200']}
            />
          </Pressable>
        </View>
        {fiatPrices ? (
          <View>
            {Object.keys(fiatPrices).map((key, index) => {
              return (
                <View key={index}>
                  <Fiat currency={key} value={fiatPrices[key]} />
                </View>
              );
            })}
          </View>
        ) : (
          <View>
            <LoadingComponent
              isLoading={isLoading}
              message={undefined}
              error={isError}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const themedStyles = StyleService.create({
  item: {
    marginBottom: verticalScale(16),
  },
});

export default Tokens;
