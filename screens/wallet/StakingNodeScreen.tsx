import useWallet from '../../hooks/useWallet';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, TopNavigation, TopNavigationAction} from '@ui-kitten/components';
import Container from '../../components/Container';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Balance_Types_Enum, BalanceFragment} from '../../constants/Type';
import Text from '../../components/Text';
import OptionCard from '../../components/OptionCard';
import useNjs from '../../hooks/useNjs';
import {RootStackParamList, ScreenProps} from '../../navigation/type';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import {networkOptions} from '../../constants/Data';
import DialogInput from 'react-native-dialog-input';

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

const StakingNodeScreen = () => {
  const {accounts, wallet, updateAccounts} = useWallet();
  const [isEditVisible, showEditDialog] = useState(false);
  const [editingNode, setEditingNode] = useState<string>('');
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();

  const [editMode, setEditMode] = useState(false);

  const saveServers = () => {
    setEditMode(!editMode);
  };

  const summaryText = `Current list of staking nodes:`;
  return (
    <Container useSafeArea>
      <DialogInput
        isDialogVisible={isEditVisible}
        title={'Rename Staking Node'}
        message={
          'You can set a label for the staking node with address ' + editingNode
        }
        hintInput={'Name'}
        submitInput={async (inputText: string) => {
          await wallet.db.AddLabel(editingNode, inputText);
          await updateAccounts();
          showEditDialog(false);
        }}
        closeDialog={() => {
          showEditDialog(false);
        }}
      />
      <TopNavigation
        accessoryRight={renderRightActions(editMode, () => saveServers())}
        title={'Setup Staking Nodes'}
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
            item={{text: 'Add new node'}}
            selected={''}
            onPress={() => {
              navigate('Wallet', {
                screen: 'AddStakingNodeScreen',
              });
            }}
            icon={'add'}
            color={'white'}
            cardType={'outline'}
          />
        ) : null}
        {accounts
          .filter(el => el.type_id == Balance_Types_Enum.Staking)
          .map((eachNode: BalanceFragment, index: number) => {
            return (
              <OptionCard
                key={index + 1}
                id={(index + 1).toString()}
                index={index + 1}
                item={{
                  text: `Name: ${eachNode.name}\nAddress: ${eachNode.address}`,
                }}
                selected={''}
                onPress={() => {}}
                iconRight={editMode ? 'edit' : undefined}
                iconRightOnPress={() => {
                  setEditingNode(eachNode.address || '');
                  showEditDialog(true);
                }}
                color={'white'}
              />
            );
          })}
      </View>
    </Container>
  );
};

export default StakingNodeScreen;

const styles = StyleSheet.create({
  summary: {textAlign: 'center', paddingHorizontal: 24},
  serversWrapper: {
    padding: 24,
    flex: 1,
  },
});
