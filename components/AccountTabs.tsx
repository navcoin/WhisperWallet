import Tab from './Tab';
import Content from './Content';
import {RefreshControl, ScrollView, View} from 'react-native';
import {useEffect} from 'react';
import BalanceCard from './BalanceCard';
import Text from './Text';
import React, {useCallback, useState} from 'react';
import {BalanceFragment, Connection_Stats_Enum} from '../constants/Type';
import {useBottomSheet} from '../hooks/useBottomSheet';
import BottomSheetMenu from './BottomSheetMenu';
import useWallet from '../hooks/useWallet';
import {
  StyleService,
  useStyleSheet,
  useTheme,
} from '@tsejerome/ui-kitten-components';
import BottomSheetOptions from './BottomSheetOptions';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import {RootStackParamList} from '../navigation/type';
import OptionCard from './OptionCard';

const AccountsTab = (props: {
  onRefresh: () => Promise<void>;
  refreshing?: boolean;
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
  const theme = useTheme();

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
            navigate('SendToScreen', {
              from: account_,
              toType: el,
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
    [bottomSheet],
  );

  const expandMenuNft = useCallback(
    account_ => {
      bottomSheet.expand(
        <BottomSheetMenu
          title={account_.name + ' Collection'}
          ignoreSuffix={true}
          options={[
            {
              text: 'Open collection',
              icon: 'image',
              navigate: {
                screen: 'CollectionScreen',
                params: {
                  collection: account_,
                },
              },
            },
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

  const [accountsContent, setAccountContent] = useState(<></>);
  const [tokensContent, setTokensContent] = useState(<></>);
  const [nftsContent, setNftsContent] = useState(<></>);

  useEffect(() => {
    setAccountContent(
      <>
        {accounts.map((el, i) => {
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
        })}
      </>,
    );
  }, [accounts]);

  useEffect(() => {
    setNftsContent(
      <>
        {nfts.length == 0 ? (
          <Text center marginBottom={scale(24)}>
            No private NFTs found
          </Text>
        ) : (
          nfts.map((el, i) => {
            return (
              <View style={styles.item} key={i}>
                <BalanceCard
                  item={{...el, name: el.name}}
                  key={i}
                  index={i}
                  onPress={() => {
                    setAccount(el);
                    expandMenuNft(el);
                  }}
                />
              </View>
            );
          })
        )}
        <View style={styles.item}>
          <OptionCard
            color={theme['color-basic-1200']}
            key={'add'}
            index={nfts.length + 1}
            item={{text: 'Create collection'}}
            selected={''}
            onPress={() => {
              navigate('Wallet', {
                screen: 'CreateNftCollectionScreen',
              });
            }}
            icon={'add'}
            cardType={'outline'}
          />
        </View>
      </>,
    );
  }, [nfts]);

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
            refreshing={false}
            onRefresh={onRefresh}
            tintColor="#fff"
            titleColor="#fff"
          />
        }>
        <Content style={{paddingTop: verticalScale(24)}}>
          {selectedTab == 0 ? (
            accountsContent
          ) : selectedTab == 1 ? (
            tokensContent
          ) : selectedTab == 2 ? (
            nftsContent
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
