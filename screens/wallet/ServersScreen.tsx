import useWallet from '../../hooks/useWallet';
import BigList from 'react-native-big-list';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Icon, TopNavigation, TopNavigationAction} from '@ui-kitten/components';
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
import {WalletScreenNames} from '../Wallet';
import useNjs from '../../hooks/useNjs';
import {RootStackParamList} from '../../navigation/type';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import {networkOptions} from '../../constants/Data';

const TopRightIcon = (props: {name: 'check' | 'edit'}) => (
  <Icon width={20} height={20} {...props} name={props.name} />
);

const renderRightActions = (editMode: boolean, onPress: () => void) => (
  <React.Fragment>
    <TopNavigationAction
      style={{padding: 20}}
      icon={TopRightIcon({name: editMode ? 'check' : 'edit'})}
      onPress={onPress}
    />
  </React.Fragment>
);

const Servers = (props: any) => {
  const {walletName, wallet, connected} = useWallet();
  const {njs} = useNjs();

  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();

  const [currentServers, setCurrentServers] = useAsyncStorage(
    'currentServers',
    networkOptions[wallet.network],
  );
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {}, []);

  const summaryText = `Your wallet is currently using ${
    wallet.network
  } network. ${
    editMode
      ? 'If you want to switch to other networks, please create another wallet.'
      : ''
  }`;
  return (
    <Container useSafeArea>
      <TopNavigation
        accessoryRight={renderRightActions(editMode, () =>
          setEditMode(!editMode),
        )}
        title={'Setup Electrum Servers'}
      />
      <View>
        <Text style={[styles.summary]}>{summaryText}</Text>
      </View>
      <View style={[styles.serversWrapper]}>
        {editMode ? (
          <OptionCard
            id={'0'}
            index={0}
            item={{text: 'Add new server'}}
            selected={''}
            onPress={() => {}}
            icon={'add'}
            color={'white'}
            cardType={'outline'}
          />
        ) : null}
        {currentServers.map((eachServer, index) => {
          return (
            <OptionCard
              key={index + 1}
              id={(index + 1).toString()}
              index={index + 1}
              item={{text: JSON.stringify(eachServer)}}
              selected={''}
              onPress={() => {}}
              color={'white'}
            />
          );
        })}
      </View>
    </Container>
  );
};

export default Servers;

const styles = StyleSheet.create({
  summary: {textAlign: 'center', paddingHorizontal: 24},
  serversWrapper: {
    padding: 24,
    flex: 1,
  },
});
