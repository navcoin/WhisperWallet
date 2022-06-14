import React from 'react';
import {Button, Layout, LayoutProps} from '@tsejerome/ui-kitten-components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useSecurity from '../src/hooks/useSecurity';
import {SecurityAuthenticationTypes} from '../contexts/SecurityContext';
import {BlurView} from '@react-native-community/blur';
import {StyleSheet, View} from 'react-native';
import {scale} from 'react-native-size-matters';

interface ContainerProps extends LayoutProps {
  useSafeArea?: boolean;
  doNotLock?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  style,
  useSafeArea = true,
  ...props
}) => {
  const {top, bottom} = useSafeAreaInsets();
  const {
    lockedScreen,
    setLockedScreen,
    currentAuthenticationType,
    readPassword,
  } = useSecurity();

  return (
    <Layout
      {...props}
      style={[
        {flex: 1},
        useSafeArea && {paddingTop: top, paddingBottom: bottom},
        style,
      ]}>
      {children}
      {lockedScreen && !props.doNotLock && (
        <BlurView
          style={{...StyleSheet.absoluteFillObject}}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="#1f2933">
          <View style={styles.contentContainer}>
            {!(
              currentAuthenticationType ==
                SecurityAuthenticationTypes.MANUAL_4 ||
              currentAuthenticationType == SecurityAuthenticationTypes.MANUAL
            ) && (
              <Button
                style={{paddingHorizontal: scale(20)}}
                children={'Tap to unlock'}
                status="primary-whisper"
                onPress={() => {
                  readPassword()
                    .then(() => {
                      setLockedScreen(false);
                    })
                    .catch(e => {
                      setLockedScreen(true);
                    });
                }}
              />
            )}
          </View>
        </BlurView>
      )}
    </Layout>
  );
};

export default Container;

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingTop: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
