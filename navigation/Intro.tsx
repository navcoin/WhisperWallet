import React, {memo, useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {StyleService, useStyleSheet, Button} from '@ui-kitten/components';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import Text from '../components/Text';
import Content from '../components/Content';
import Container from '../components/Container';
import {Images} from '../assets/images';
import {RootStackParamList} from './type';
import useNjs from '../hooks/useNjs';
import useKeychain from '../utils/Keychain';

const Intro = memo(props => {
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = useStyleSheet(themedStyles);
  const [walletList, setWalletList] = useState<any>([]);
  const {njs} = useNjs();
  const {read} = useKeychain();

  useEffect(() => {
    refreshWalletList();
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      refreshWalletList();
    });

    return willFocusSubscription;
  });

  const refreshWalletList = () => {
    njs.wallet.WalletFile.ListWallets().then(list => {
      setWalletList(list);
    });
  };

  return (
    <Container style={styles.container}>
      <Image
        source={Images.logo}
        /* @ts-ignore */
        style={styles.icon}
      />

      <View style={styles.spacer} />

      <Content style={styles.content}>
        <Text
          category="header"
          marginTop={16}
          marginRight={0}
          marginBottom={8}
          center>
          Privacy in the palm of your hands.
        </Text>
        <View style={styles.spacer} />

        {walletList.length > 0 ? (
          <Button
            children="Open Wallet"
            style={styles.wallet}
            status="control"
            onPress={() => {
              navigate('OpenWallet');
            }}
          />
        ) : (
          <></>
        )}
        <Button
          children="New Wallet"
          style={styles.wallet}
          status="control"
          onPress={() => {
            navigate('CreateNewWallet');
          }}
        />
        <Button
          children="Import Wallet"
          style={styles.wallet}
          status="control"
          onPress={() => {
            navigate('ImportWallet');
          }}
        />
      </Content>
    </Container>
  );
});

export default Intro;

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: 200,
    height: 200,
    marginTop: 48,
  },
  iconArrow: {
    tintColor: 'color-primary-100',
    marginRight: 8,
  },
  input: {
    marginVertical: 24,
  },
  wallet: {
    marginTop: 8,
    marginBottom: 16,
  },
  content: {
    marginHorizontal: 40,
  },
  btnImage: {
    justifyContent: 'space-between',
    marginTop: 48,
    flex: 1,
  },
  spacer: {
    marginTop: 32,
  },
  btnText: {
    marginTop: 24,
    textAlign: 'center',
  },
});
