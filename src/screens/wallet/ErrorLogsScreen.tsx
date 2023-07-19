import React from 'react';
import { View, ScrollView } from 'react-native';
import {
  Container,
  OptionCard,
  Text,
  TopNavigationComponent,
  ErrorModalContent,
} from '@components';
import { useAsyncStorage, useModal } from '@hooks';
import { AsyncStoredItems } from '@utils';
import { errorLogsScreenStyles as styles } from './styles';

const ErrorLogsScreen = (props: any) => {
  const { openModal } = useModal();
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
