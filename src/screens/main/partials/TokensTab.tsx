import {RefreshControl, ScrollView, View} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import {BalanceFragment} from '@constants/Type';
import {useBottomSheet, useWallet} from '@hooks';
import {
  StyleService,
  useStyleSheet,
  useTheme,
} from '@tsejerome/ui-kitten-components';
import {scale, verticalScale} from 'react-native-size-matters';

import {BalanceCard, BottomSheetMenu, Content, Text} from '@components';

const Tokens = () => {
  const [account, setAccount] = useState<BalanceFragment | undefined>(
    undefined,
  );

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
                  isFiatHidden={true}
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
