import React, {useEffect, useState} from 'react';
import {
  Icon,
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
import {View, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import Text from '../../components/Text';
import {useModal} from '../../hooks/useModal';
import {IImageInfo} from 'react-native-image-zoom-viewer/built/image-viewer.type';
import FastImage from 'react-native-fast-image';
import {screenWidth} from '../../utils/layout';
import {Modal} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

interface GalleryNftItem extends NftItem {
  galleryData: IImageInfo;
  type: 'pending' | 'confirmed';
}

const CollectionScreen = (props: any) => {
  const styles = useStyleSheet(themedStyles);
  const [collection, setCollection] = useState<BalanceFragment | undefined>(
    props.route.params.collection,
  );
  const [nfts, setNfts] = useState<GalleryNftItem[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const {bottom, top} = useSafeAreaInsets();
  useEffect(() => {
    if (!collection) {
      return;
    }
    const tempCol = JSON.parse(JSON.stringify(props.route.params.collection));
    const tempNfts: GalleryNftItem[] = [];
    let canEdit = false;
    if (
      tempCol.items.confirmed &&
      typeof tempCol.items.confirmed === 'object' &&
      typeof tempCol.items.confirmed['0'] === 'string'
    ) {
      canEdit = true;
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
  }, [props.route.params.collection]);

  const openImagePreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewMode(true);
  };
  const closeImagePreview = () => {
    setPreviewIndex(0);
    setPreviewMode(false);
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
          <Modal visible={previewMode} transparent={true}>
            <ImageViewer
              onSwipeDown={() => {
                closeImagePreview();
              }}
              enableSwipeDown
              useNativeDriver
              enablePreload
              backgroundColor="#1f2932F0"
              index={previewIndex}
              imageUrls={nfts.map(n => n.galleryData)}
              /* This is intentionally here to remove the indicator*/
              renderIndicator={() => {}}
              // renderHeader={currentIndex => (
              //   <View style={{paddingTop: top, position: 'absolute'}} />
              // )}
              renderFooter={currentIndex => (
                <View
                  style={{
                    paddingBottom: bottom + top + scale(20),
                    marginLeft: scale(20),
                  }}>
                  <Text category="body" left>
                    Name: {nfts[currentIndex].name}
                  </Text>
                  <Text category="body" left>
                    Description: {nfts[currentIndex].description}
                  </Text>
                  <Text category="body" left>
                    Version: {nfts[currentIndex].version}
                  </Text>
                  {nfts[currentIndex].type === 'pending' ? (
                    <Text category="body" left>
                      Status: Pending
                    </Text>
                  ) : null}
                </View>
              )}
            />
          </Modal>
          <FlatList
            data={nfts}
            renderItem={({item, index}) => (
              <View
                style={styles.singleImageContainerStyle}
                opacity={item.type === 'pending' ? 0.7 : 1}>
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    openImagePreview(index);
                  }}>
                  <FastImage
                    style={{
                      width: (screenWidth - 24) / 3,
                      height: (screenWidth - 24) / 3,
                    }}
                    source={{
                      uri: item.image,
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  {item.type === 'pending' ? (
                    <Icon
                      pack="assets"
                      name={'refresh'}
                      style={{
                        position: 'absolute',
                        bottom: scale(6),
                        right: scale(6),
                        tintColor: 'white',
                        width: scale(16),
                        height: scale(16),
                      }}
                    />
                  ) : null}
                </TouchableOpacity>
              </View>
            )}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />
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
  singleImageContainerStyle: {
    flex: 1,
    width: (screenWidth - 24) / 3,
    height: (screenWidth - 24) / 3,
    marginBottom: scale(12),
    flexDirection: 'row',
  },
});
