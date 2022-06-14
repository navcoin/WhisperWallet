import useWallet from '../../hooks/useWallet';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Button,
  Input,
  Layout,
  TopNavigation,
} from '@tsejerome/ui-kitten-components';
import Container from '../../../components/Container';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NodeOption} from '../../../constants/Type';
import Text from '../../../components/Text';
import {RootStackParamList} from '../../../navigation/type';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TopNavigationComponent from '../../../components/TopNavigation';

const AddStakingNodeScreen = () => {
  const {updateAccounts, ExecWrapperPromise, ExecWrapperSyncPromise} =
    useWallet();

  const {goBack} = useNavigation<NavigationProp<RootStackParamList>>();

  const [error, setError] = useState('');

  const [newNode, setNewNode] = useState<NodeOption>({
    name: '',
    address: '',
  });

  const setNewNodeProperty = (
    type: keyof NodeOption,
    value: string | number,
  ) => {
    const temp = {...newNode};
    temp[type] = value as any;
    setNewNode(temp);
  };

  const addNode = async () => {
    if (!newNode?.name || !newNode?.address) {
      setError('Please input node details.');
      return;
    }
    if (
      !(await ExecWrapperSyncPromise(
        'bitcore.Address.isValid',
        [newNode.address].map(el => JSON.stringify(el)),
      ))
    ) {
      setError('Invalid Address');
      return;
    }
    if (
      !(await ExecWrapperSyncPromise(
        'bitcore.Address("' + newNode.address + '").isPayToPublicKeyHash',
      ))
    ) {
      setError('You need to specify a NAV address from the staking node');
      return;
    }
    await ExecWrapperPromise(
      'wallet.AddStakingAddress',
      [newNode.address].map(el => JSON.stringify(el)),
    );
    await ExecWrapperPromise(
      'wallet.db.AddLabel',
      [newNode.address, newNode.name].map(el => JSON.stringify(el)),
    );
    await updateAccounts();
    goBack();
  };

  useEffect(() => {}, []);

  return (
    <Container useSafeArea>
      <KeyboardAwareScrollView>
        <TopNavigationComponent title={'Add New Staking Node'} />

        <Layout level="2" style={styles.inputCard}>
          <View style={styles.inputGroup}>
            <Text category="headline" style={[styles.inputTitle]}>
              Name:
            </Text>
            <Input
              autoFocus={true}
              style={[styles.inputField]}
              value={newNode.name}
              onChangeText={value => {
                setNewNodeProperty('name', value);
              }}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text category="headline" style={[styles.inputTitle]}>
              Address:
            </Text>
            <Input
              style={[styles.inputField]}
              value={newNode.address}
              onChangeText={value => {
                setNewNodeProperty('address', value);
              }}
            />
          </View>

          <Button status={'primary-whisper'} onPress={() => addNode()}>
            Add
          </Button>
          {error ? (
            <Text style={[styles.errorText]} center>
              {error}
            </Text>
          ) : (
            <></>
          )}
        </Layout>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default AddStakingNodeScreen;

const styles = StyleSheet.create({
  inputCard: {
    borderRadius: 12,
    marginTop: 24,
    marginHorizontal: 24,
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
  errorText: {color: 'red', flex: 1, marginTop: 24},
});
