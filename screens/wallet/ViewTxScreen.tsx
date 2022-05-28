import React from 'react';
import {View} from 'react-native';
import TopNavigationComponent from '../../components/TopNavigation';
import Container from '../../components/Container';
import InputSelect from '../../components/InputSelect';
import Clipboard from '@react-native-community/clipboard';

const ViewTxScreen = (props: any) => {
  return (
    <Container useSafeArea>
      <TopNavigationComponent title={'Transaction Details'} />

      <View>
        <InputSelect
          flexColumn={true}
          title="Hash"
          value={props.route.params.item.hash}
          onPress={() => {
            Clipboard.setString(props.route.params.item.hash);
          }}
          hideArrow
        />
        {!props.route.params.item.confirmed ? (
          <InputSelect flexColumn={true} title="Confirmed" value={'No'} />
        ) : (
          <InputSelect
            flexColumn={true}
            title="Block Height"
            value={props.route.params.item.height}
          />
        )}
        <InputSelect
          flexColumn={true}
          title="Amount"
          value={
            props.route.params.item.amount /
            (props.route.params.item.type == 'nft' ? 1 : 1e8)
          }
        />
        <InputSelect flexColumn={true} title="Type" value={props.route.params.item.type} />
        {props.route.params.item.type == 'token' && (
          <>
            <InputSelect
              flexColumn={true}
              title="Token Name"
              value={props.route.params.item.token_name}
            />
            <InputSelect
              flexColumn={true}
              title="Token Code"
              value={props.route.params.item.token_code}
            />
          </>
        )}
        {props.route.params.item.type == 'nft' && (
          <>
            <InputSelect
              flexColumn={true}
              title="Collection Name"
              value={props.route.params.item.token_name}
            />
            <InputSelect
              flexColumn={true}
              title="Nft Id"
              value={props.route.params.item.nft_id}
            />
          </>
        )}
        {props.route.params.item.amount > 0 &&
          props.route.params.item.memos?.out?.length > 0 && (
            <InputSelect
              flexColumn={true}
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
