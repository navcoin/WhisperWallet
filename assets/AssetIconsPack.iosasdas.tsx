import React from 'react';
import {Image, ImageProps, ImageSourcePropType, StyleSheet} from 'react-native';
import {IconPack, IconProvider} from '@tsejerome/ui-kitten-components';
import {SvgProps} from 'react-native-svg';
import {Icons} from './icons';
import {scale} from 'react-native-size-matters';
import {SFSymbol} from 'react-native-sfsymbols';

const createSFIcon = (name: string): IconProvider<ImageProps> => {
  return {
    toReactElement: props => (
      <SFSymbol
        name={name}
        scale="large"
        color="white"
        size={32}
        resizeMode="center"
        multicolor={false}
        style={{width: 32, height: 32}}
        {...props}
      />
    ),
  };
};

const styles = StyleSheet.create({
  icon: {
    width: scale(24),
    height: scale(24),
  },
});

const createIcon = (source: ImageSourcePropType): IconProvider<ImageProps> => {
  return {
    toReactElement: props => (
      <Image
        style={styles.icon}
        {...props}
        source={source}
        resizeMode="cover"
      />
    ),
  };
};

const AssetIconsPack: IconPack<ImageProps | SvgProps> = {
  name: 'assets',
  icons: {
    leftArrow: createSFIcon('arrow.backward'),
    rightArrow: createSFIcon('chevron.right'),
    arrowRight16: createSFIcon('arrow.right'),
    upArrow: createSFIcon('arrow.up'),
    creditCard: createSFIcon('creditcard'),
    downArrow: createSFIcon('arrow.down'),
    downArr: createSFIcon('arrow.down'),
    rightChevron: createSFIcon('chevron.right'),
    leftChevron: createSFIcon('chevron.left'),
    email: createSFIcon('mail'),
    padLock: createSFIcon('lock'),
    openPadLock: createSFIcon('lock.open'),
    smartphone: createSFIcon('iphone.smartbatterycase.gen2'),
    refresh: createSFIcon('arrow.clockwise'),
    menu: createSFIcon('ellipsis.circle'),
    exchange: createSFIcon('fibrechannel'),
    money: createSFIcon('dollarsign.circle'),
    qr: createSFIcon('qrcode.viewfinder'),
    factory: createSFIcon('bolt.horizontal.circle'),
    nav: createIcon(Icons.nav),
    xnav: createIcon(Icons.xnav),
  },
};
export default AssetIconsPack;
