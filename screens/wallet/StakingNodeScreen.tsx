import useWallet from '../../hooks/useWallet';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, TopNavigationAction} from '@tsejerome/ui-kitten-components';
import Container from '../../components/Container';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Balance_Types_Enum, BalanceFragment} from '../../constants/Type';
import Text from '../../components/Text';
import OptionCard from '../../components/OptionCard';
import {RootStackParamList} from '../../navigation/type';
import DialogInput from 'react-native-dialog-input';
import TopNavigationComponent from '../../components/TopNavigation';
import {scale} from 'react-native-size-matters';

const TopRightIcon = (props: {name: 'check' | 'edit'}) => (
  <Icon width={scale(20)} height={scale(20)} {...props} name={props.name} />
);

const renderRightActions = (editMode: boolean, onPress: () => void) => (
  <React.Fragment>
    <TopNavigationAction
      style={{padding: scale(20)}}
      icon={TopRightIcon({name: editMode ? 'check' : 'edit'})}
      onPress={onPress}
    />
  </React.Fragment>
);

const StakingNodeScreen = () => {
  const {accounts, ExecWrapperPromise, updateAccounts} = useWallet();
  const [isEditVisible, showEditDialog] = useState(false);
  const [editingNode, setEditingNode] = useState<string>('');
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();

  const [editMode, setEditMode] = useState(false);

  const saveServers = () => {
    setEditMode(!editMode);
  };

  const summaryText = 'Current list of staking nodes:';
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
          await ExecWrapperPromise('wallet.db.AddLabel', [editingNode, inputText].map(el => JSON.stringify(el)));
          await updateAccounts();
          showEditDialog(false);
        }}
        closeDialog={() => {
          showEditDialog(false);
        }}
      />
      <TopNavigationComponent
        accessoryRight={renderRightActions(editMode, () => saveServers())}
        title={'Setup Staking Nodes'}
      />
      <View>
        <Text style={[styles.summary]}>{summaryText}</Text>
      </View>
      <View style={[styles.serversWrapper]}>
        {/* TODO: On clicking the card shd open the modal to show whole content */}
        {editMode ? (
          <OptionCard
            key={'1'}
            id={'1'}
            index={1}
            item={{text: 'Add new node'}}
            selected={''}
            onPress={() => {
              navigate('AddStakingNodeScreen');
            }}
            icon={'add'}
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
