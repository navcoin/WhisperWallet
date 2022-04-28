import useWallet from '../../hooks/useWallet';
import BigList from 'react-native-big-list';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
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
import TopNavigationComponent from '../../components/TopNavigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import {
  AsyncStoredItems,
  getAsyncStorage,
} from '../../utils/asyncStorageManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useModal} from '../../hooks/useModal';
import ErrorModalContent from '../../components/ErrorModalContent';
import {scale} from 'react-native-size-matters';

const ErrorLogsScreen = (props: any) => {
  const {openModal} = useModal();
  const [errorRecords, setErrorRecords] = useAsyncStorage(
    AsyncStoredItems.GLOBAL_ERROR_RECORDS,
    null,
  );
  // const sss = async () => {
  //   const asd = await getAsyncStorage(AsyncStoredItems.GLOBAL_ERROR_RECORDS);
  //   let b = '';
  //   console.log('starting');
  //   console.log(global_error_records);
  //   console.log('global_error_records');

  //   setEr(b);
  // };
  // useEffect(() => {
  //   sss();
  // }, []);

  return (
    <Container useSafeArea>
      <TopNavigationComponent title={'Error Logs'} />
      <ScrollView style={[styles.container]}>
        {errorRecords === null ? (
          <ActivityIndicator animating />
        ) : errorRecords.length ? (
          errorRecords.map((eachError: string, index: number) => {
            return (
              <OptionCard
                icon={'cancel'}
                key={index + 1}
                id={(index + 1).toString()}
                index={index + 1}
                item={{
                  text: `${eachError}`,
                }}
                selected={''}
                onPress={() => {
                  openModal(
                    <ErrorModalContent
                      focusOneError
                      errorText={eachError}></ErrorModalContent>,
                  );
                }}
                color={'white'}
              />
            );
          })
        ) : (
          <View style={[styles.emptyView]}>
            <Text style={[styles.text]}>
              🍻 There are currently no error logs.
            </Text>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default gestureHandlerRootHOC(ErrorLogsScreen);

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
  container: {
    paddingHorizontal: scale(24),
  },
});
