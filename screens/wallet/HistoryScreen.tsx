import useWallet from '../../hooks/useWallet';
import BigList from 'react-native-big-list';
import React, {useEffect, useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TopNavigation} from '@ui-kitten/components';
import Container from '../../components/Container';
import Transaction from '../../components/Transaction';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  Connection_Stats_Enum,
  Connection_Stats_Text,
} from '../../constants/Type';
import Text from '../../components/Text';
import OptionCard from '../../components/OptionCard';
import useLayout from '../../hooks/useLayout';
import {RootStackParamList} from '../../navigation/type';

const HistoryScreen = (props: any) => {
  const {width, height} = useLayout();
  const {history, connected} = useWallet();

  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();
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
        navigate('Wallet', {screen: 'ViewTxScreen', params: {item}});
      }}
    />
  );

  const goToAddressCoin = () => {
    if (props && props.navigation) {
      navigate('Wallet', {
        screen: 'AddressScreen',
        params: {from: props.route.params.publicWallet},
      });
    }
  };

  const condition = el => {
    const fA = props.route.params.filter[1];

    return (
      el &&
      el.type === props.route.params.filter[0] &&
      (!fA ||
        (fA &&
          (el.addresses_in?.staking?.indexOf(fA) > -1 ||
            el.addresses_in?.spending?.indexOf(fA) > -1 ||
            el.addresses_out?.staking?.indexOf(fA) > -1 ||
            el.addresses_out?.spending?.indexOf(fA) > -1)))
    );
  };

  return (
    <Container useSafeArea>
      <TopNavigation title={'Wallet History'} />
      {loadingStatusText === Connection_Stats_Text.Connected &&
      history.filter((el: any) => condition(el)).length ? (
        <BigList
          data={history.filter((el: any) => condition(el))}
          renderItem={renderItem}
          itemHeight={90}
        />
      ) : null}
      {loadingStatusText === Connection_Stats_Text.Connected &&
      history.filter((el: any) => condition(el)).length === 0 ? (
        <View style={[styles.emptyView]}>
          <Text style={[styles.text]}>There are no transactions yet!</Text>
          <View style={[styles.cardWrapper]}>
            <OptionCard
              key={1}
              id={'1'}
              index={1}
              item={{text: 'Show receiving address'}}
              selected={'walletName'}
              onPress={() => {
                goToAddressCoin();
              }}
              icon={'download'}
              color={'white'}
            />
          </View>
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

export default HistoryScreen;

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
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardWrapper: {
    maxWidth: 300,
    alignSelf: 'center',
    marginTop: 50,
  },
});
