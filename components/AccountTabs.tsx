import Tab from './Tab';
import Content from './Content';
import {View} from 'react-native';
import BalanceCard from './BalanceCard';
import Text from './Text';
import React, {useCallback, useEffect, useState} from 'react';
import {Balance_Types_Enum, Destination_Types_Enum} from '../constants/Type';
import {useBottomSheet} from '../hooks/useBottomSheet';
import BottomSheetMenu from './BottomSheetMenu';
import useWallet from '../hooks/useWallet';
import {StyleService, useStyleSheet} from '@ui-kitten/components';
import BottomSheetOptions from './BottomSheetOptions';
import {useNavigation} from '@react-navigation/native';

const AccountsTab = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [account, setAccount] = useState([
    Balance_Types_Enum.Nav,
    Destination_Types_Enum.PublicWallet,
    '',
  ]);
  const {accounts} = useWallet();
  const bottomSheet = useBottomSheet();
  const styles = useStyleSheet(themedStyles);
  const {navigate} = useNavigation();

  const pickDestination = useCallback(() => {
    bottomSheet.expand(
      <BottomSheetOptions
        title={'Select destination'}
        options={[
          {text: Destination_Types_Enum.PublicWallet},
          {text: Destination_Types_Enum.PrivateWallet},
          {text: Destination_Types_Enum.StakingWallet},
        ].filter(el => el.text != account[1])}
        bottomSheetRef={bottomSheet.getRef}
        onSelect={(el: any) => {
          navigate('Wallet', {
            screen: 'SendToScreen',
            params: {
              from: account[0],
              toType: el.text,
            },
          });
        }}
      />,
    );
  }, [account]);

  useEffect(() => {
    if (account[2]) {
      bottomSheet.expand(
        <BottomSheetMenu
          title={account[2]}
          options={[
            {
              text: 'View address to receive',
              icon: 'download',
              navigate: {
                screen: 'AddressScreen',
                params: {
                  from: account[1],
                },
              },
            },
            {
              text: 'Send to someone',
              icon: 'diagonalArrow3',
              navigate: {
                screen: 'SendToScreen',
                params: {
                  from: account[0],
                },
              },
            },
            {
              text: 'Move to other wallet',
              icon: 'exchange',
              skipCollapse: true,
              onPress: () => {
                pickDestination();
              },
            },
            {
              text: 'Transaction history',
              icon: 'suitcase',
              navigate: {
                screen: 'HistoryScreen',
                params: {
                  filter: account[0],
                  publicWallet: account[1],
                },
              },
            },
          ]}
        />,
      );
    }
  }, [bottomSheet, account]);

  return (
    <>
      <Tab
        tabs={['Accounts', 'Tokens', 'NFTs']}
        selectedIndex={selectedTab}
        onChange={setSelectedTab}
        style={{marginHorizontal: 16}}
      />
      <Content style={{paddingTop: 24}}>
        {selectedTab == 0 ? (
          accounts.map((el, i) => {
            return (
              <View style={styles.item} key={i}>
                <BalanceCard
                  item={{...el, name: el.name + ' Wallet'}}
                  index={i}
                  onPress={() => {
                    setAccount([el.type_id, el.destination_id, el.name]);
                  }}
                />
              </View>
            );
          })
        ) : selectedTab == 1 ? (
          <Text marginLeft={36} marginBottom={16}>
            You have no tokens yet.
          </Text>
        ) : selectedTab == 2 ? (
          <Text marginLeft={36} marginBottom={16}>
            You have no NFTs yet.
          </Text>
        ) : (
          <></>
        )}
      </Content>
    </>
  );
};

export default AccountsTab;

const themedStyles = StyleService.create({
  item: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});
