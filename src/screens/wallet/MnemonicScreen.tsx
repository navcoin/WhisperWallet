import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Mnemonic, TopNavigationComponent } from '@components';
import { ScreenProps } from '@navigation/type';

const MnemonicScreen: React.FC<ScreenProps<'MnemonicScreen'>> = (
  props: any,
) => {
  return (
    <Container>
      <TopNavigationComponent title={'Mnemonic'} />
      <View style={styles.contentWrapper}>
        {props.route?.params?.mnemonic && (
          <Mnemonic mnemonic={props.route.params.mnemonic} />
        )}
      </View>
    </Container>
  );
};

export default MnemonicScreen;

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
