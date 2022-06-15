import useWallet from '../../hooks/useWallet';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Button,
  Input,
  Layout,
  TopNavigation,
} from '@tsejerome/ui-kitten-components';
import Container from '../../components/Container';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Destination_Types_Enum, NftItemOption} from '../../constants/Type';
import Text from '../../components/Text';
import {RootStackParamList} from '../../navigation/type';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TopNavigationComponent from '../../components/TopNavigation';
import useSecurity from '../../hooks/useSecurity';
import BottomSheetView from '../../components/BottomSheetView';
import {SwipeButton} from '../../components/SwipeButton';
import {useBottomSheet} from '../../hooks/useBottomSheet';
import {useModal} from '../../hooks/useModal';
import LoadingModalContent from '../../components/Modals/LoadingModalContent';

const MintNftScreen = (props: any) => {
  const {MintNft, ExecWrapperPromise, sendTransaction, parsedAddresses} =
    useWallet();
  const {readPassword} = useSecurity();

  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();
  const {collapse} = useBottomSheet();
  const {openModal, closeModal} = useModal();
  const bottomSheet = useBottomSheet();

  const nftCollection = props.route.params.from;

  const [error, setError] = useState('');
  const [loading, setLoading] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (loading) {
      openModal(<LoadingModalContent loading={!!loading} text={loading} />);
      return;
    }
    closeModal();
  }, [loading]);

  const [collection, setCollection] = useState<NftItemOption>({
    name: '',
    resource: '',
  });

  const [assignedId, setAssignedId] = useState<number>(-1);
  const [destination, setDestination] = useState<string>('');
  const [fullyMinted, setFullyMinted] = useState<boolean>(false);

  useEffect(() => {
    setDestination(
      parsedAddresses.filter(
        el => el.type_id == Destination_Types_Enum.PrivateWallet,
      )[0]?.address,
    );

    ExecWrapperPromise(
      'wallet.GetNftInfo',
      [nftCollection.tokenId, -1].map(el => JSON.stringify(el)),
    ).then(nftInfo => {
      if (nftInfo.length == 0) {
        setAssignedId(0);
        return;
      }
      let tempAssignedId = -1;
      let found = false;
      for (let item of nftInfo) {
        if (item.id > tempAssignedId + 1) {
          found = true;
          tempAssignedId += 1;
          break;
        }
        tempAssignedId = item.id;
      }
      if (!found && tempAssignedId + 1 < nftCollection.supply) {
        found = true;
        tempAssignedId += 1;
      } else if (!found) {
        setFullyMinted(true);
      }
      if (found) setAssignedId(tempAssignedId);
    });
  }, []);

  const setCollectionProperty = (
    type: keyof NftItemOption,
    value: string | number,
  ) => {
    const temp = {...collection};
    temp[type] = value as any;
    setCollection(temp);
  };

  const mintNftItem = async () => {
    if (!collection?.name || !collection?.resource) {
      setError('Please fill the item details.');
      return;
    }

    if (
      ['png', 'jpg', 'jpeg', 'gif'].indexOf(
        collection?.resource.split('.').pop(),
      ) == -1
    ) {
      setError('Supported formats are: png, jpg, jpeg and gif');
      return;
    }

    if (assignedId == -1) {
      setError('Please wait for ID assignment');
    }

    readPassword()
      .then(async spendingPassword => {
        setLoading('Creating transaction...');
        MintNft(
          nftCollection.tokenId,
          assignedId,
          destination,
          JSON.stringify({
            ...collection,
            image: collection.resource,
            resource: undefined,
            attributes: {thumbnail_url: collection.resource},
          }),
          spendingPassword,
        )
          .then(tx => {
            setLoading(false);
            bottomSheet.expand(
              <BottomSheetView>
                <TopNavigation title="Confirm NFT mint" />
                <Layout level="2" style={styles.card}>
                  <View style={styles.row}>
                    <Text category="headline" style={{marginRight: 16}}>
                      Name:
                    </Text>
                    <Text
                      category="headline"
                      style={{flex: 1, flexWrap: 'wrap'}}>
                      {collection['name']}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text category="headline" style={{marginRight: 16}}>
                      Image URL:
                    </Text>
                    <Text
                      category="headline"
                      style={{flex: 1, flexWrap: 'wrap'}}>
                      {collection['resource']}
                    </Text>
                  </View>
                </Layout>

                <Layout level="2" style={{...styles.card, marginBottom: 24}}>
                  <View style={styles.row}>
                    <Text category="headline" style={{marginRight: 16}}>
                      Fee:
                    </Text>
                    <Text category="headline">
                      {(tx.fee / 1e8).toFixed(8)}
                      {' xNAV'}
                    </Text>
                  </View>
                </Layout>

                <SwipeButton
                  goBackToStart={true}
                  onComplete={() => {
                    setLoading('Broadcasting...');
                    sendTransaction(tx.tx).then(res => {
                      if (res.error) {
                        bottomSheet.expand(
                          <BottomSheetView>
                            <Text center style={{paddingBottom: 16}}>
                              Unable to send transaction
                            </Text>
                            <Text center style={{paddingBottom: 16}}>
                              {res.error.split('[')[0]}
                            </Text>
                          </BottomSheetView>,
                        );
                        setLoading(false);
                      } else {
                        setLoading(false);
                        collapse();
                        navigate('MainWalletScreen');
                      }
                    });
                  }}
                  title="Swipe to confirm"
                />
              </BottomSheetView>,
            );
          })
          .catch(e => {
            console.log(e.stack);
            bottomSheet.expand(
              <BottomSheetView>
                <Text center style={{paddingBottom: 16}}>
                  Unable to create transaction
                </Text>
                <Text center style={{paddingBottom: 16}}>
                  {e.message}
                </Text>
              </BottomSheetView>,
            );
            setLoading(false);
          });
      })
      .catch(e => {
        setLoading(false);

        bottomSheet.expand(
          <BottomSheetView>
            <Text center style={{paddingBottom: 16}}>
              Unable to create transaction
            </Text>
            <Text center style={{paddingBottom: 16}}>
              {e.message}
            </Text>
          </BottomSheetView>,
        );
      });
  };

  return (
    <Container useSafeArea>
      <KeyboardAwareScrollView>
        <TopNavigationComponent title={'Mint a NFT'} />

        <Layout level="2" style={styles.inputCard}>
          <View style={styles.inputGroup}>
            <Text category="headline" style={[styles.inputTitle]}>
              Name:
            </Text>
            <Input
              autoFocus={true}
              style={[styles.inputField]}
              value={collection['name']}
              onChangeText={value => {
                setCollectionProperty('name', value);
              }}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text category="headline" style={[styles.inputTitle]}>
              Image URL:
            </Text>
            <Input
              style={[styles.inputField]}
              value={collection['resource']}
              onChangeText={value => {
                setCollectionProperty('resource', value);
              }}
            />
          </View>
          <Button
            status={'primary-whisper'}
            onPress={() => {
              if (assignedId != -1) mintNftItem();
            }}>
            {fullyMinted
              ? 'The collection is already fully minted'
              : assignedId == -1
              ? 'Assigning item ID...'
              : 'Create item #' + assignedId}
          </Button>
          {error ? (
            <Text style={[styles.errorText]} center>
              {error}
            </Text>
          ) : (
            <></>
          )}
        </Layout>
      </KeyboardAwareScrollView>
    </Container>
  );
};
export default MintNftScreen;

const styles = StyleSheet.create({
  inputCard: {
    borderRadius: 12,
    marginHorizontal: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputField: {
    flex: 1,
    flexWrap: 'wrap',
  },
  inputTitle: {
    marginRight: 16,
  },
  errorText: {color: 'red', flex: 1, marginTop: 24},
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
