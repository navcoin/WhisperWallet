import Tab from './Tab';
import Content from './Content';
import {RefreshControl, ScrollView, View} from 'react-native';
import BalanceCard from './BalanceCard';
import Text from './Text';
import React, {useCallback, useState} from 'react';
import {BalanceFragment, Connection_Stats_Enum} from '../constants/Type';
import {useBottomSheet} from '../hooks/useBottomSheet';
import BottomSheetMenu from './BottomSheetMenu';
import useWallet from '../hooks/useWallet';
import {StyleService, useStyleSheet} from '@tsejerome/ui-kitten-components';
import BottomSheetOptions from './BottomSheetOptions';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import {RootStackParamList} from '../navigation/type';

const AccountsTab = (props: {
  onRefresh: () => Promise<void>;
  refreshing: boolean;
}) => {
  const {onRefresh, refreshing} = props;
  const [selectedTab, setSelectedTab] = useState(0);
  const [account, setAccount] = useState<BalanceFragment | undefined>(
    undefined,
  );
  const {accounts, tokens, nfts} = useWallet();
  const bottomSheet = useBottomSheet();
  const styles = useStyleSheet(themedStyles);
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();

  const pickDestination = useCallback(
    account_ => {
      let options = accounts
        .filter(el => el.name != account_?.name)
        .map(el => {
          return {...el, text: el.name};
        });

      bottomSheet.expand(
        <BottomSheetOptions
          title={'Select destination'}
          options={options}
          bottomSheetRef={bottomSheet.getRef}
          onSelect={(el: any) => {
            navigate('Wallet', {
              screen: 'SendToScreen',
              params: {
                from: account_,
                toType: el,
              },
            });
          }}
        />,
      );
    },
    [accounts],
  );

  const expandMenu = useCallback(
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
              text: 'Move to another account',
              icon: 'exchange',
              skipCollapse: true,
              onPress: () => {
                pickDestination(account_);
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
    [bottomSheet, pickDestination],
  );

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
    [bottomSheet, pickDestination],
  );

  return (
    <>
      <Tab
        tabs={['Accounts', 'Tokens', 'NFTs']}
        selectedIndex={selectedTab}
        onChange={setSelectedTab}
        style={{marginHorizontal: scale(16)}}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            titleColor="#fff"
          />
        }>
        <Content style={{paddingTop: verticalScale(24)}}>
          {selectedTab == 0 ? (
            accounts.map((el, i) => {
              return (
                <View style={styles.item} key={i}>
                  <BalanceCard
                    item={{...el, name: el.name + ' account'}}
                    index={i}
                    onPress={() => {
                      setAccount(el);
                      expandMenu(el);
                    }}
                  />
                </View>
              );
            })
          ) : selectedTab == 1 ? (
            <Text marginBottom={16} center>
              {tokens.length == 0
                ? 'No private tokens found'
                : tokens.map((el, i) => {
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
                  })}
            </Text>
          ) : selectedTab == 2 ? (
            <Text center marginBottom={16}>
              {nfts.length == 0
                ? 'No private NFTs found'
                : nfts.map((el, i) => {
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
                  })}{' '}
            </Text>
          ) : (
            <></>
          )}
        </Content>
      </ScrollView>
    </>
  );
};

export default AccountsTab;

const themedStyles = StyleService.create({
  item: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(16),
  },
});
