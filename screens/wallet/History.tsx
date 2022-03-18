import useWallet from '../../hooks/useWallet';
import BigList from 'react-native-big-list';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Layout, TopNavigation, useTheme} from '@ui-kitten/components';
import Container from '../../components/Container';
import useLayout from '../../hooks/useLayout';
import Transaction from '../../components/Transaction';
import {useNavigation} from '@react-navigation/native';

const History = (props: any) => {
  const {history} = useWallet();
  const {navigate} = useNavigation();

  const renderItem = ({item, index}) => (
    <Transaction
      item={item}
      index={index}
      onPress={() => {
        navigate('Wallet', {screen: 'ViewTx', params: {item}});
      }}
    />
  );
  return (
    <Container useSafeArea>
      <TopNavigation title={'Wallet History'} />

      <BigList
        data={history.filter((el: any) => el.type == props.route.params.filter)}
        renderItem={renderItem}
        itemHeight={90}
      />
    </Container>
  );
};

export default History;

const styles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 8,
  },
});
