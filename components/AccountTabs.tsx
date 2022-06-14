import Tab from './Tab';
import Content from './Content';
import {RefreshControl, ScrollView, View} from 'react-native';
import {useEffect} from 'react';
import BalanceCard from './BalanceCard';
import Text from './Text';
import React, {useCallback, useState} from 'react';
import {BalanceFragment, Connection_Stats_Enum} from '../constants/Type';
import {useBottomSheet} from '../src/hooks/useBottomSheet';
import BottomSheetMenu from './BottomSheetMenu';
import useWallet from '../src/hooks/useWallet';
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
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const TabNavigator = createMaterialTopTabNavigator();

const AccountsTab = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme['color-basic-700'],
        flex: 1,
        marginLeft: scale(16),
        marginRight: scale(16),
      }}>
      <TabNavigator.Navigator
        tabBarPosition={'top'}
        screenOptions={{
          tabBarLabelStyle: {fontSize: 12},
          tabBarStyle: {backgroundColor: theme['color-basic-700']},
          tabBarIndicatorStyle: {
            backgroundColor: theme['color-primary-100'],
          },
        }}>
        <TabNavigator.Screen
          name="Accounts"
          component={Accounts}
          listeners={({navigation}) => ({
            blur: () => navigation.setParams({screen: undefined}),
          })}
        />
        <TabNavigator.Screen
          name="Tokens"
          component={Tokens}
          listeners={({navigation}) => ({
            blur: () => navigation.setParams({screen: undefined}),
          })}
        />
        <TabNavigator.Screen
          name="NFTs"
          component={NFTs}
          listeners={({navigation}) => ({
            blur: () => navigation.setParams({screen: undefined}),
          })}
        />
      </TabNavigator.Navigator>
    </View>
  );
};

const Accounts = () => {
  const [account, setAccount] = useState<BalanceFragment | undefined>(
    undefined,
  );
  const {accounts, refreshWallet} = useWallet();
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

  const [accountsContent, setAccountContent] = useState(<></>);

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
          {accountsContent}
        </Content>
      </ScrollView>
    </View>
  );
};

const NFTs = () => {
  const [account, setAccount] = useState<BalanceFragment | undefined>(
    undefined,
  );
  const {refreshWallet, nfts} = useWallet();
  const bottomSheet = useBottomSheet();
  const styles = useStyleSheet(themedStyles);
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme();

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

  const [nftsContent, setNftsContent] = useState(<></>);

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
              navigate('CreateNftCollectionScreen');
            }}
            icon={'add'}
            cardType={'outline'}
          />
        </View>
      </>,
    );
  }, [nfts]);

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
        <Content style={{paddingTop: verticalScale(24)}}>{nftsContent}</Content>
      </ScrollView>
    </View>
  );
};

const Tokens = () => {
  const [account, setAccount] = useState<BalanceFragment | undefined>(
    undefined,
  );
  const {refreshWallet, tokens} = useWallet();
  const bottomSheet = useBottomSheet();
  const styles = useStyleSheet(themedStyles);
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();
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
      </ScrollView>
    </View>
  );
};

export default AccountsTab;

const themedStyles = StyleService.create({
  item: {
    marginBottom: verticalScale(16),
  },
});
