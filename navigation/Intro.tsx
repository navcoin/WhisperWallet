import React, {memo, useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {StyleService, useStyleSheet} from '@tsejerome/ui-kitten-components';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import Text from '../components/Text';
import Content from '../components/Content';
import Container from '../components/Container';
import Button from '../components/Button';
import {Images} from '../assets/images';
import {RootStackParamList} from './type';
import useNjs from '../hooks/useNjs';
import useKeychain from '../utils/Keychain';
import {layoutStyles, maxComponentWidth} from '../utils/layout';

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
      <Content style={styles.content}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={Images.logo}
            /* @ts-ignore */
            style={styles.icon}
          />

          <View style={styles.spacer} />

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
              style={[styles.wallet]}
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
            style={[styles.wallet]}
            status="control"
            onPress={() => {
              navigate('CreateNewWallet');
            }}
          />
          <Button
            children="Import Wallet"
            style={[styles.wallet]}
            status="control"
            onPress={() => {
              navigate('ImportWallet');
            }}
          />
        </View>
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
    width: verticalScale(200),
    height: verticalScale(200),
    marginTop: verticalScale(48),
    alignSelf: 'center',
  },
  iconArrow: {
    tintColor: 'color-primary-100',
    marginRight: scale(8),
  },
  input: {
    marginVertical: verticalScale(24),
  },
  wallet: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(16),
    width: '100%',
  },
  content: {
    marginHorizontal: scale(40),
  },
  btnImage: {
    justifyContent: 'space-between',
    marginTop: scale(48),
    flex: 1,
  },
  spacer: {
    marginTop: verticalScale(32),
  },
  btnText: {
    marginTop: verticalScale(24),
    textAlign: 'center',
  },
});
