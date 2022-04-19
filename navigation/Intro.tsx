import React, {memo, useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {StyleService, useStyleSheet, Button} from '@ui-kitten/components';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import Text from '../components/Text';
import Content from '../components/Content';
import Container from '../components/Container';
import {Images} from '../assets/images';
import {RootStackParamList} from './type';
import useWallet from '../hooks/useWallet';

const Intro = memo(props => {
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = useStyleSheet(themedStyles);
  const {walletsList} = useWallet();

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
          Whisper Wallet
        </Text>
        <View style={styles.spacer} />

        {walletsList.length > 0 ? (
          <Button
            children="Open"
            style={styles.wallet}
            status="primary-whisper"
            onPress={() => {
              navigate('OpenWallet');
            }}
          />
        ) : (
          <></>
        )}
        <Button
          children="New"
          status="primary-whisper"
          style={styles.wallet}
          onPress={() => {
            navigate('CreateNewWallet');
          }}
        />
        <Button
          children="Import"
          style={styles.wallet}
          status="primary-whisper"
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
    width: 250,
    height: 250,
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
