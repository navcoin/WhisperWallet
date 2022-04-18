import React, {memo, useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {StyleService, useStyleSheet} from '@tsejerome/ui-kitten-components';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import Text from '../components/Text';
import Content from '../components/Content';
import Container from '../components/Container';
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
            marginTop={scale(16)}
            marginRight={scale(0)}
            marginBottom={scale(8)}
            center>
            Privacy in the palm of your hands.
          </Text>
          <View style={styles.spacer} />

          {walletList.length > 0 ? (
            <Button
              children="Open Wallet"
              style={[layoutStyles.responsiveRowComponentWidth, styles.wallet]}
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
            style={[layoutStyles.responsiveRowComponentWidth, styles.wallet]}
            status="control"
            onPress={() => {
              navigate('CreateNewWallet');
            }}
          />
          <Button
            children="Import Wallet"
            style={[layoutStyles.responsiveRowComponentWidth, styles.wallet]}
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
    width: scale(200),
    height: scale(200),
    marginTop: scale(48),
    alignSelf: 'center',
  },
  iconArrow: {
    tintColor: 'color-primary-100',
    marginRight: scale(8),
  },
  input: {
    marginVertical: scale(24),
  },
  wallet: {
    marginTop: scale(8),
    marginBottom: scale(16),
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
    marginTop: scale(32),
  },
  btnText: {
    marginTop: scale(24),
    textAlign: 'center',
  },
});
