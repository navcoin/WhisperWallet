import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Container from '../../components/Container';
import Text from '../../components/Text';
import OptionCard from '../../components/OptionCard';
import TopNavigationComponent from '../../components/TopNavigation';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import {AsyncStoredItems} from '../../utils/asyncStorageManager';
import {useModal} from '../../hooks/useModal';
import ErrorModalContent from '../../components/Modals/ErrorModalContent';
import {scale} from 'react-native-size-matters';

const ErrorLogsScreen = (props: any) => {
  const {openModal} = useModal();
  const [errorRecords, setErrorRecords] = useAsyncStorage(
    AsyncStoredItems.GLOBAL_ERROR_RECORDS,
    null,
  );

  return (
    <Container useSafeArea>
      <TopNavigationComponent title={'Error Logs'} />
      <ScrollView style={[styles.container]}>
        {errorRecords?.length ? (
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
                    <ErrorModalContent focusOneError errorText={eachError} />,
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

export default ErrorLogsScreen;

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
