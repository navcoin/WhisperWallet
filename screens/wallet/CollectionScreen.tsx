import React, {useEffect, useState} from 'react';
import {
  StyleService,
  useStyleSheet,
  useTheme,
} from '@tsejerome/ui-kitten-components';

import Container from '../../components/Container';

import {BalanceFragment, NftItem} from '../../constants/Type';

import {NavigationProp, useNavigation} from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {RootStackParamList} from '../../navigation/type';
import {scale} from 'react-native-size-matters';
import TopNavigationComponent from '../../components/TopNavigation';
import {View, ScrollView} from 'react-native';
import Text from '../../components/Text';
import {useModal} from '../../hooks/useModal';
import {IImageInfo} from 'react-native-image-zoom-viewer/built/image-viewer.type';
import FastImage from 'react-native-fast-image';

interface GalleryNftItem extends NftItem {
  galleryData: IImageInfo;
  type: 'pending' | 'confirmed';
}

const CollectionScreen = (props: any) => {
  const {openModal, closeModal} = useModal();
  const styles = useStyleSheet(themedStyles);
  const [collection, setCollection] = useState<BalanceFragment | undefined>(
    props.route.params.collection,
  );
  const [nfts, setNfts] = useState<GalleryNftItem[]>([]);

  useEffect(() => {
    if (!collection) {
      return;
    }
    const tempCol = {...collection};
    const tempNfts: GalleryNftItem[] = [];
    let canEdit = false;
    if (
      tempCol.items.confirmed &&
      typeof tempCol.items.confirmed === 'object' &&
      typeof tempCol.items.confirmed['0'] === 'string'
    ) {
      canEdit = true;
      console.log('canedittttt');
      for (const [key, value] of Object.entries<string>(
        tempCol.items.confirmed,
      )) {
        tempCol.items.confirmed[key] = JSON.parse(value);
        tempNfts.push({
          ...JSON.parse(value),
          type: 'confirmed',
          galleryData: {
            url: tempCol.items.confirmed[key].attributes.thumbnail_url,
            originUrl: tempCol.items.confirmed[key].image,
          },
        });
      }
    }
    if (
      tempCol.items.pending &&
      typeof tempCol.items.pending === 'object' &&
      typeof tempCol.items.pending['0'] === 'string'
    ) {
      canEdit = true;

      for (const [key, value] of Object.entries<string>(
        tempCol.items.pending,
      )) {
        tempCol.items.pending[key] = JSON.parse(value);
        tempNfts.push({
          ...JSON.parse(value),
          type: 'pending',
          galleryData: {
            url: tempCol.items.confirmed[key].attributes.thumbnail_url,
            originUrl: tempCol.items.confirmed[key].image,
          },
        });
      }
    }
    if (canEdit) {
      setCollection(tempCol);
      setNfts(tempNfts);
    }
    console.log('wtf');
  }, [collection]);

  useEffect(() => {
    console.log(nfts);
    console.log('nfts');
  }, [nfts]);

  const previewImage = (index: number) => {
    openModal(
      <ImageViewer imageUrls={nfts.map(n => n.galleryData)} index={index} />,
    );
  };

  return (
    <Container style={styles.container}>
      <TopNavigationComponent
        title={
          collection?.name || collection?.tokenId?.substring(0, 16) + '...'
        }
      />
      {nfts.length ? (
        <>
          <ScrollView>
            <Text>{JSON.stringify(nfts.length)}</Text>
            {nfts.map((n, index) => (
              <View
                key={index}
                style={{
                  width: 300,
                  height: 300,
                  marginBottom: 20,
                  backgroundColor: 'blue',
                }}>
                <FastImage
                  style={{width: 200, height: 200}}
                  source={{
                    uri: n.image,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <Text>{n.image}</Text>
                <View />
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <View>
          <Text category="title4" center>
            There are no art in this collection 🤨
          </Text>
        </View>
      )}
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
