import React, {useEffect, useState} from 'react';
import {
  Icon,
  StyleService,
  useStyleSheet,
} from '@tsejerome/ui-kitten-components';

import Container from '../../components/Container';
import {BalanceFragment, NftItem} from '../../constants/Type';
import ImageViewer from 'react-native-image-zoom-viewer';
import {scale} from 'react-native-size-matters';
import TopNavigationComponent from '../../components/TopNavigation';
import {
  View,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Text from '../../components/Text';
import {IImageInfo} from 'react-native-image-zoom-viewer/built/image-viewer.type';
import FastImage from 'react-native-fast-image';
import {screenWidth} from '../../utils/layout';
import {Modal} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import OptionCard from '../../components/OptionCard';
import {useNavigation} from '@react-navigation/native';

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
  const {width, height} = useWindowDimensions();
  const {navigate} = useNavigation();

  useEffect(() => {
    if (!collection) {
      return;
    }
    const tempCol = JSON.parse(JSON.stringify(collection));
    const tempNfts: GalleryNftItem[] = [];
    let canEdit = false;
    if (
      tempCol.items.confirmed &&
      typeof tempCol.items.confirmed === 'object' &&
      typeof tempCol.items.confirmed[
        Object.keys(tempCol.items.confirmed)[0]
      ] === 'string'
    ) {
      canEdit = true;
      for (const [key, value] of Object.entries<string>(
        tempCol.items.confirmed,
      )) {
        tempCol.items.confirmed[key] = {name: value};
        try {
          tempCol.items.confirmed[key] = JSON.parse(value);
        } catch (e) {}
        tempNfts.push({
          ...tempCol.items.confirmed[key],
          type: 'confirmed',
          id: key,
          galleryData: {
            url:
              tempCol.items.confirmed[key].attributes?.thumbnail_url ||
              'https://www.worldartfoundations.com/wp-content/uploads/2022/04/placeholder-image-300x225.png',
            originUrl:
              tempCol.items.confirmed[key].image ||
              'https://www.worldartfoundations.com/wp-content/uploads/2022/04/placeholder-image-300x225.png',
          },
        });
      }
    }
    if (
      tempCol.items.pending &&
      typeof tempCol.items.pending === 'object' &&
      typeof tempCol.items.pending[Object.keys(tempCol.items.pending)[0]] ===
        'string'
    ) {
      canEdit = true;

      for (const [key, value] of Object.entries<string>(
        tempCol.items.pending,
      )) {
        tempCol.items.pending[key] = {name: value};
        try {
          tempCol.items.pending[key] = JSON.parse(value);
        } catch (e) {}
        tempNfts.push({
          ...tempCol.items.pending[key],
          type: 'pending',
          id: key,
          galleryData: {
            url:
              tempCol.items.pending[key].attributes?.thumbnail_url ||
              'https://www.worldartfoundations.com/wp-content/uploads/2022/04/placeholder-image-300x225.png',
            originUrl:
              tempCol.items.pending[key].image ||
              'https://www.worldartfoundations.com/wp-content/uploads/2022/04/placeholder-image-300x225.png',
          },
        });
      }
    }
    if (canEdit) {
      setCollection(tempCol);
      setNfts(tempNfts);
    }
  }, [collection]);

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
        style={{marginBottom: scale(0)}}
        accessoryRight={
          collection?.mine && (
            <TouchableOpacity
              style={{paddingRight: scale(24)}}
              onPress={() => {
                navigate('MintNftScreen', {
                  from: collection,
                });
              }}>
              <Icon name={'add'} style={{tintColor: '#fff'}} />
            </TouchableOpacity>
          )
        }
      />
      {nfts.length ? (
        <>
          <Modal visible={previewMode} transparent={false}>
            <ImageViewer
              failImageSource={{
                url: 'https://www.worldartfoundations.com/wp-content/uploads/2022/04/placeholder-image-300x225.png',
              }}
              onSwipeDown={() => {
                closeImagePreview();
              }}
              style={{paddingHorizontal: scale(0)}}
              enableSwipeDown
              useNativeDriver
              enablePreload
              backgroundColor="#1f2932FF"
              index={previewIndex}
              saveToLocalByLongPress={false}
              imageUrls={nfts.map(n => n.galleryData)}
              /* This is intentionally here to remove the indicator*/
              loadingRender={() => <></>}
              renderIndicator={() => <></>}
              renderHeader={currentIndex => (
                <View
                  style={{
                    position: 'absolute',
                    top: top,
                    zIndex: 999,
                    width: '100%',
                  }}>
                  <TopNavigationComponent
                    alignment={'center'}
                    title={nfts[currentIndex].name}
                    subtitle={nfts[currentIndex].description}
                    pressBack={() => {
                      closeImagePreview();
                    }}
                    style={{marginBottom: scale(0)}}></TopNavigationComponent>
                </View>
              )}
              renderFooter={currentIndex => {
                return (
                  <View
                    style={{
                      paddingBottom: bottom + top + scale(20),
                      backgroundColor: '#1f2932FF',
                      width: width,
                    }}>
                    {nfts[currentIndex].type !== 'pending' ? (
                      <View style={{padding: scale(24)}}>
                        <OptionCard
                          item={{text: 'Send to someone'}}
                          index={0}
                          id={'sendTo'}
                          key={'sendTo'}
                          icon={'diagonalArrow3'}
                          onPress={() => {
                            navigate('SendToScreen', {
                              from: collection,
                              nftId: parseInt(nfts[currentIndex].id),
                            });
                            closeImagePreview();
                          }}
                          selected={''}
                        />
                        <OptionCard
                          item={{text: 'Create sell order'}}
                          index={0}
                          id={'sellNft'}
                          key={'sellNft'}
                          icon={'shopping'}
                          onPress={() => {
                            navigate('SellNftScreen', {
                              from: collection,
                              nftId: parseInt(nfts[currentIndex].id),
                            });
                            closeImagePreview();
                          }}
                          selected={''}
                        />
                      </View>
                    ) : null}
                  </View>
                );
              }}
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
                      marginTop: scale(10),
                      padding: 0,
                    }}
                    source={{
                      uri:
                        item.image ||
                        'https://www.worldartfoundations.com/wp-content/uploads/2022/04/placeholder-image-300x225.png',
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <View
                    style={{
                      backgroundColor: '#fff',
                      position: 'absolute',
                      top: scale(10),
                      right: scale(0),
                      paddingHorizontal: scale(10),
                      borderRadius: scale(10),
                    }}>
                    <Text category={'caption2'} style={{color: '#000'}}>
                      #{item.id}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            style={{padding: 10}}
          />
        </>
      ) : (
        <View>
          <Text category="" center>
            There are no items in this collection 🤨
          </Text>
        </View>
      )}
    </Container>
  );
};

export default CollectionScreen;

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
    backgroundColor: 'background-basic-color-2',
    flex: 1,
    width: (screenWidth - 24) / 2,
    maxWidth: (screenWidth - 24) / 2,
    margin: scale(10),
    borderRadius: scale(10),
    marginBottom: scale(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
