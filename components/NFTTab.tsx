import Content from './Content';
import {RefreshControl, ScrollView, View} from 'react-native';
import {useEffect} from 'react';
import BalanceCard from './BalanceCard';
import Text from './Text';
import React, {useCallback, useState} from 'react';
import {BalanceFragment} from '../constants/Type';
import {useBottomSheet} from '../src/hooks/useBottomSheet';
import BottomSheetMenu from './BottomSheetMenu';
import useWallet from '../src/hooks/useWallet';
import {
  useStyleSheet,
  StyleService,
  useTheme,
} from '@tsejerome/ui-kitten-components';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import {RootStackParamList} from '../navigation/type';
import OptionCard from './OptionCard';

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

const themedStyles = StyleService.create({
  item: {
    marginBottom: verticalScale(16),
  },
});
export default NFTs;
