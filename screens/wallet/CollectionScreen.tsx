import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {
  Icon,
  Layout,
  StyleService,
  useStyleSheet,
  useTheme,
} from '@tsejerome/ui-kitten-components';

import Container from '../../components/Container';
import useWallet from '../../hooks/useWallet';
import Text from '../../components/Text';

import {BalanceFragment, Connection_Stats_Enum} from '../../constants/Type';

import {NavigationProp, useNavigation} from '@react-navigation/native';

import BalanceCircle from '../../components/BalanceCircle';

import {BottomSheetProvider} from '../../contexts/BottomSheetProvider';
import AccountsTab from '../../components/AccountTabs';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {CollectionScreenProps, RootStackParamList} from '../../navigation/type';
import {scale} from 'react-native-size-matters';
import {TouchableWithoutFeedback} from '@tsejerome/ui-kitten-components/devsupport';
import TopNavigationComponent from '../../components/TopNavigation';

const CollectionScreen = (props: any) => {
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const styles = useStyleSheet(themedStyles);
  const [collection, setCollection] = useState<BalanceFragment | undefined>(
    props.route.params.collection,
  );

  useEffect(() => {
    console.log(collection?.items.confirmed);
  }, [collection]);

  return (
    <Container style={styles.container}>
      <TopNavigationComponent
        title={
          collection?.name
        }
      />

    </Container>
  );
};

export default gestureHandlerRootHOC(CollectionScreen);

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  topTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
  },
  iconGrp: {
    flexDirection: 'row',
  },
  icon: {
    width: scale(18),
    height: scale(18),
    tintColor: '$icon-basic-color',
  },
});
