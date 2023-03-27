// import Content from './Content';
import {RefreshControl, ScrollView, View} from 'react-native';
import {useEffect} from 'react';
import {
  BalanceCard,
  BottomSheetMenu,
  Content,
  BottomSheetOptions,
} from '@components';
import React, {useCallback, useState} from 'react';
import {BalanceFragment} from '@constants/Type';
import {useBottomSheet} from '@hooks/useBottomSheet';
import useWallet from '@hooks/useWallet';
import {
  StyleService,
  useStyleSheet,
  useTheme,
} from '@tsejerome/ui-kitten-components';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import {RootStackParamList} from '@navigation/type';

const AccountTab = () => {
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
            navigate('SendToScreen' as any, {
              from: account_,
              toType: el,
            });
          }}
        />,
      );
    },
    [accounts, bottomSheet, navigate],
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

const themedStyles = StyleService.create({
  item: {
    marginBottom: verticalScale(16),
  },
});
export default AccountTab;
