import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import {
  Button,
  Icon,
  TopNavigationAction,
} from '@tsejerome/ui-kitten-components';
import { Container, OptionCard, TopNavigationComponent } from '@components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/type';
import { useAsyncStorage, useWallet } from '@hooks';
import { networkOptions, NetworkOption, ServerOption } from '@constants';
import { scale } from 'react-native-size-matters';
import { serversScreenStyles as styles } from './styles';

const TopRightIcon = (props: { name: 'check' | 'edit' }) => (
  <Icon width={scale(20)} height={scale(20)} {...props} name={props.name} />
);

const renderRightActions = (editMode: boolean, onPress: () => void) => (
  <React.Fragment>
    <TopNavigationAction
      style={{ padding: scale(20) }}
      icon={TopRightIcon({ name: editMode ? 'check' : 'edit' })}
      onPress={onPress}
    />
  </React.Fragment>
);

const ServersScreen = () => {
  const { walletName, network } = useWallet();

  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();

  const [currentServers, setCurrentServers] = useAsyncStorage(
    'currentServers',
    networkOptions[network],
  );
  const [editMode, setEditMode] = useState(false);

  const saveServers = () => {
    setEditMode(!editMode);
  };

  const removeServer = (serverIndexToBeRemoved: number) => {
    const newServers = currentServers.filter(
      (server: ServerOption, index: number) => index !== serverIndexToBeRemoved,
    );
    setCurrentServers(newServers);
  };

  const restoreServers = () => {
    Alert.alert('', 'Are you sure you want to restore to default servers?', [
      {
        text: 'Yes',
        onPress: () => {
          network as NetworkOption;
          setCurrentServers(networkOptions[network]);
        },
      },
      {
        text: 'No',
      },
    ]);
  };

  return (
    <Container useSafeArea>
      <TopNavigationComponent
        accessoryRight={renderRightActions(editMode, () => saveServers())}
        title={'Setup Electrum servers'}
      />

      <View style={[styles.serversWrapper]}>
        {editMode ? (
          <OptionCard
            key={'1'}
            id={'1'}
            index={1}
            item={{ text: 'Add new server' }}
            selected={''}
            onPress={() => {
              navigate('AddServerScreen', {
                params: {
                  addServer: (
                    newServer: ServerOption,
                    cb: () => void,
                  ): void => {
                    const temp = [...currentServers];
                    temp.push(newServer);
                    setCurrentServers(temp);
                    cb();
                  },
                },
              });
            }}
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
                text: `Host: ${eachServer.host}\nPort: ${eachServer.port}; Protocol: ${eachServer.proto}`,
              }}
              selected={''}
              onPress={() => {}}
              iconRight={editMode ? 'bin' : undefined}
              iconRightOnPress={() => {
                removeServer(index);
              }}
              color={'white'}
            />
          );
        })}
        {editMode ? (
          <Button status={'primary-whisper'} onPress={() => restoreServers()}>
            Restore default servers
          </Button>
        ) : null}
      </View>
    </Container>
  );
};

export default ServersScreen;
