import useWallet from '../../hooks/useWallet';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Button,
  Icon,
  IndexPath,
  Input,
  Layout,
  Select,
  SelectItem,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import Container from '../../components/Container';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ServerOption} from '../../constants/Type';
import Text from '../../components/Text';
import OptionCard from '../../components/OptionCard';
import BottomSheetView from '../../components/BottomSheetView';
import useNjs from '../../hooks/useNjs';
import {RootStackParamList, ScreenProps} from '../../navigation/type';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import {networkOptions, protosOptions} from '../../constants/Data';
import {useBottomSheet} from '../../hooks/useBottomSheet';
import {BottomSheetProvider} from '../../contexts/BottomSheetProvider';
import {validateIp, validatePort} from '../../utils/server';

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

const ServersScreenContent = (props: ScreenProps<'ServersScreen'>) => {
  const {walletName, wallet} = useWallet();
  const {njs} = useNjs();

  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();

  const [currentServers, setCurrentServers] = useAsyncStorage(
    'currentServers',
    networkOptions[wallet.network],
  );
  const [editMode, setEditMode] = useState(false);
  // const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [error, setError] = useState('');

  const bottomSheet = useBottomSheet();
  const {setOnCollapse} = useBottomSheet();
  const [newServer, setNewServer] = useState<ServerOption>({
    type: wallet.network,
  });

  const findMatchedIdx = () => {
    if (newServer.proto) {
      const matchedIdx = protosOptions.findIndex(
        proto => proto === newServer.proto,
      );
      if (matchedIdx > 0) {
        return new IndexPath(matchedIdx);
      }
    }
    return new IndexPath(0);
  };

  const setNewServerProperty = (
    type: keyof ServerOption,
    value: string | number,
  ) => {
    const temp = {...newServer};
    temp[type] = value as any;
    setNewServer(temp);
  };
  const addServer = () => {
    if (
      !newServer?.host ||
      !newServer?.port ||
      !newServer?.proto ||
      !newServer?.type
    ) {
      setError('Please input  server details.');
      return;
    }
    if (newServer.host && !validateIp(newServer.host)) {
      setError('Invalid Server');
      return;
    }
    if (newServer.port && !validatePort(newServer.port)) {
      setError('Invalid Port');
      return;
    }
  };

  const saveServers = () => {
    setEditMode(!editMode);
  };

  const removeServer = (serverIndexToBeRemoved: number) => {
    const newServers = currentServers.filter(
      (server: ServerOption, index: number) => index !== serverIndexToBeRemoved,
    );
    setCurrentServers(newServers);
  };

  useEffect(() => {
    // if (!isBottomSheetOpen) {
    //   return;
    // }
  }, [bottomSheet, wallet.network, error, newServer]);
  const setIsBottomSheetOpen = useCallback(
    () =>
      bottomSheet.expand(
        <BottomSheetView>
          <TopNavigation title="Add New Server" />
          <Layout level="2" style={styles.inputCard}>
            <View style={styles.inputGroup}>
              <Text category="headline" style={[styles.inputTitle]}>
                Host:
              </Text>
              <Input
                autoFocus={true}
                style={[styles.inputField]}
                onChangeText={value => {
                  setNewServerProperty('host', value);
                }}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text category="headline" style={[styles.inputTitle]}>
                Port:
              </Text>
              <Input
                style={[styles.inputField]}
                onChangeText={value => {
                  setNewServerProperty('host', Number.parseInt(value));
                }}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text category="headline" style={[styles.inputTitle]}>
                Proto:
              </Text>
              <Select
                style={[styles.inputField]}
                selectedIndex={findMatchedIdx()}
                value={protosOptions[findMatchedIdx().row]}
                onSelect={index => {
                  const i = index as IndexPath;
                  if (i) {
                    setNewServerProperty('proto', protosOptions[i.row]);
                  }
                }}>
                {protosOptions.map(proto => {
                  return <SelectItem title={proto} />;
                })}
              </Select>
            </View>
            <View style={styles.inputGroup}>
              <Text category="headline" style={[styles.inputTitle]}>
                Network:
              </Text>
              <Text category="headline">{wallet.network}</Text>
            </View>
            <Button onPress={() => addServer()}>Add</Button>
            {error ? (
              <Text style={[styles.errorText]} center>
                {error}
              </Text>
            ) : (
              <></>
            )}
          </Layout>
        </BottomSheetView>,
      ),
    [
      addServer,
      bottomSheet,
      error,
      findMatchedIdx,
      setNewServerProperty,
      wallet.network,
      newServer,
    ],
  );

  useEffect(() => {}, []);

  const summaryText = `${walletName} is currently using ${
    wallet.network
  } network. ${
    editMode
      ? 'If you want to switch to other networks, please create another wallet.'
      : ''
  }`;
  return (
    <Container useSafeArea>
      <TopNavigation
        accessoryRight={renderRightActions(editMode, () => saveServers())}
        title={'Setup Electrum Servers'}
      />
      <View>
        <Text style={[styles.summary]}>{summaryText}</Text>
      </View>
      <View style={[styles.serversWrapper]}>
        {editMode ? (
          <OptionCard
            key={'1'}
            id={'1'}
            index={1}
            item={{text: 'Add new server'}}
            selected={''}
            onPress={() => setIsBottomSheetOpen(true)}
            icon={'add'}
            color={'white'}
            cardType={'outline'}
          />
        ) : null}
        {currentServers.map((eachServer: ServerOption, index: number) => {
          return (
            <OptionCard
              key={index + 1}
              id={(index + 1).toString()}
              index={index + 1}
              item={{
                text: `Host: ${eachServer.host}\nPort: ${eachServer.port}; <b>Protocol</b>: ${eachServer.proto}`,
              }}
              selected={''}
              onPress={() => {}}
              iconRight={editMode ? 'download' : undefined}
              iconRightOnPress={() => {
                removeServer(index);
              }}
              color={'white'}
            />
          );
        })}
      </View>
    </Container>
  );
};

const ServersScreen = (props: ScreenProps<'ServersScreen'>) => {
  return (
    <BottomSheetProvider>
      <ServersScreenContent {...props} />
    </BottomSheetProvider>
  );
};

export default ServersScreen;

const styles = StyleSheet.create({
  summary: {textAlign: 'center', paddingHorizontal: 24},
  serversWrapper: {
    padding: 24,
    flex: 1,
  },
  inputCard: {
    borderRadius: 12,
    marginTop: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputField: {
    flex: 1,
    flexWrap: 'wrap',
  },
  inputTitle: {
    marginRight: 16,
  },
  errorText: {color: 'red', flex: 1},
});
