import useWallet from '../../hooks/useWallet';
import BigList from 'react-native-big-list';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TopNavigation} from '@ui-kitten/components';
import Container from '../../components/Container';
import Transaction from '../../components/Transaction';
import {useNavigation} from '@react-navigation/native';
import {
  Connection_Stats_Enum,
  Connection_Stats_Text,
} from '../../constants/Type';
import Text from '../../components/Text';

const History = (props: any) => {
  const {history, connected} = useWallet();
  const {navigate} = useNavigation();
  const [loadingStatusText, setLoadingStatus] =
    useState<Connection_Stats_Text>();

  useEffect(() => {
    switch (connected) {
      case Connection_Stats_Enum.Connected: {
        setLoadingStatus(Connection_Stats_Text.Connected);
        break;
      }
      case Connection_Stats_Enum.Connecting: {
        setLoadingStatus(Connection_Stats_Text.Connecting);
        break;
      }
      case Connection_Stats_Enum.Disconnected: {
        setLoadingStatus(Connection_Stats_Text.Disconnected);
        break;
      }
      case Connection_Stats_Enum.NoServers: {
        setLoadingStatus(Connection_Stats_Text.NoServers);
        break;
      }
      case Connection_Stats_Enum.Syncing: {
        setLoadingStatus(Connection_Stats_Text.Syncing);
        break;
      }
      default:
        break;
    }
  }, [connected]);

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
      {loadingStatusText === Connection_Stats_Text.Connected &&
      history.filter((el: any) => el.type === props.route.params.filter)
        .length ? (
        <BigList
          data={history.filter(
            (el: any) => el.type === props.route.params.filter,
          )}
          renderItem={renderItem}
          itemHeight={90}
        />
      ) : null}
      {loadingStatusText === Connection_Stats_Text.Connected &&
      history.filter((el: any) => el.type === props.route.params.filter)
        .length === 0 ? (
        <View style={[styles.emptyView]}>
          <Text style={[styles.text]}>
            There are no transaction record yet!
          </Text>
        </View>
      ) : null}
      {loadingStatusText !== Connection_Stats_Text.Connected ? (
        <View style={[styles.emptyView]}>
          <Text style={[styles.text]}>{loadingStatusText}</Text>
        </View>
      ) : null}
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
  text: {
    color: 'white',
    textAlign: 'center',
  },
  emptyView: {
    height: 100,
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
