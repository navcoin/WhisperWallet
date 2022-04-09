import React from 'react';
import {View, Text} from 'react-native';
import {TopNavigation} from '@ui-kitten/components';
import Container from '../../components/Container';
import InputSelect from '../../components/InputSelect';
import Clipboard from '@react-native-community/clipboard';

const ViewTxScreen = (props: any) => {
  return (
    <Container useSafeArea>
      <TopNavigation title={'Transaction Details'} />

      <View>
        <InputSelect
          title="Hash"
          value={props.route.params.item.hash}
          onPress={() => {
            Clipboard.setString(props.route.params.item.hash);
          }}
          hideArrow
        />
        {!props.route.params.item.confirmed ? (
          <InputSelect title="Confirmed" value={'No'} />
        ) : (
          <InputSelect
            title="Block Height"
            value={props.route.params.item.height}
          />
        )}
        <InputSelect
          title="Amount"
          value={props.route.params.item.amount / 1e8}
        />
        <InputSelect title="Type" value={props.route.params.item.type} />
        {props.route.params.item.type == 'token' && (
          <>
            <InputSelect
              title="Token Name"
              value={props.route.params.item.token_name}
            />
            <InputSelect
              title="Token Code"
              value={props.route.params.item.token_code}
            />
          </>
        )}
        {props.route.params.item.amount > 0 &&
          props.route.params.item.memos?.out?.length > 0 && (
            <InputSelect
              title="Memo"
              value={
                props.route.params.item.memos?.out?.length > 1
                  ? props.route.params.item.memos.out.join(', ')
                  : props.route.params.item.memos.out
              }
            />
          )}
      </View>
    </Container>
  );
};

export default ViewTxScreen;
