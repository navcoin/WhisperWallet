import { StyleSheet } from 'react-native';
import { StyleService } from '@tsejerome/ui-kitten-components';
import { s, vs, ms } from 'react-native-size-matters';
import { Mirage, White, Red } from '@constants';
import { screenWidth } from '@utils';

export const addressScreenStyles = StyleService.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: { backgroundColor: 'background-basic-color-2' },
  marginTop32: { marginTop: vs(32) },
  height40: { height: vs(40) },
  container: {
    borderRadius: 12,
    paddingVertical: vs(32),
    paddingLeft: s(32),
    paddingRight: s(32),
    marginLeft: s(32),
    marginRight: s(32),
  },
  qrCode: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(32),
  },
});

export const addServerScreenStyles = StyleSheet.create({
  inputCard: {
    borderRadius: s(12),
    marginTop: vs(24),
    marginHorizontal: s(12),
    paddingVertical: vs(24),
    paddingHorizontal: s(16),
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(20),
  },
  inputField: {
    flex: 1,
    flexWrap: 'wrap',
  },
  inputTitle: {
    marginRight: s(16),
  },
  errorText: { color: 'red', flex: 1, marginTop: vs(24) },
});


export const addStakingNodeStyles = StyleSheet.create({
  inputCard: {
    borderRadius: 12,
    marginTop: 24,
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
  errorText: { color: 'red', flex: 1, marginTop: 24 },
});

export const askPinScreenStyles = StyleService.create({
  instructionText: {
    textAlign: 'center',
    paddingHorizontal: s(32),
  },
  warningIcon: { opacity: 1, marginBottom: s(32) },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  backgroundMirage: {
    backgroundColor: Mirage,
  },
  boldFontFamily: {
    fontFamily: 'Overpass-Bold',
  },
  wallet: {
    marginTop: vs(8),
    marginBottom: vs(16),
    width: ms(250, 0.5),
  },
});

export const collectionScreenStyles = StyleService.create({
  headerWrapper: {
    position: 'absolute',
    zIndex: 999,
    width: '100%',
  },
  iconTintColor: { tintColor: White },
  fastImage: {
    width: (screenWidth - 24) / 3,
    height: (screenWidth - 24) / 3,
    padding: 0,
  },
  colorRed: { color: Red },
  sectionWrapper: {
    position: 'absolute',
    top: s(10),
    right: s(0),
    flexDirection: 'row',
  },
  captionWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: s(10),
    borderRadius: s(10),
  },
  colorWhite: { color: White },
  typePending: {
    backgroundColor: '#fff',
    paddingHorizontal: s(10),
    borderRadius: s(10),
  },
  flatListStyle: { padding: 10 },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  topTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(12),
  },
  iconGrp: {
    flexDirection: 'row',
  },
  icon: {
    width: s(18),
    height: s(18),
    tintColor: '$icon-basic-color',
  },
  singleImageContainerStyle: {
    backgroundColor: 'background-basic-color-2',
    flex: 1,
    width: (screenWidth - 24) / 2,
    maxWidth: (screenWidth - 24) / 2,
    margin: s(10),
    borderRadius: s(10),
    marginBottom: s(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const createNftCollectionStyles = StyleSheet.create({
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
  errorText: { color: 'red', flex: 1, marginTop: 24 },
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

export const errorLogsScreenStyles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 8,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  emptyView: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  container: {
    paddingHorizontal: s(24),
  },
});

export const historyScreenStyles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 8,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  emptyView: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardWrapper: {
    width: 300,
    maxWidth: 300,
    alignSelf: 'center',
    marginTop: 50,
  },
});

export const mainWalletStyles = StyleService.create({
  connectedView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAlign: {
    alignSelf: 'center',
  },
  divider: {
    width: s(8),
    borderRadius: s(4),
    marginLeft: s(8),
    height: s(8),

    alignSelf: 'center',
  },
  settingClickWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(12),
    right: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  topTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(12),
    marginTop: s(6),
    marginBottom: s(18),
  },
  iconGrp: {
    padding: s(12),
    flexDirection: 'row',
  },
  iconContainer: {
    backgroundColor: '#ff0000',
    padding: 12,
  },
  icon: {
    width: s(18),
    height: s(18),
    tintColor: '$icon-basic-color',
  },
});

export const mintNftStyles = StyleSheet.create({
  textResource: { flex: 1, flexWrap: 'wrap' },
  marginRight16: { marginRight: 16 },
  marginBottom24: { marginBottom: 24 },
  paddingBottom16: {
    paddingBottom: 16,
  },
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
  errorText: { color: 'red', flex: 1, marginTop: 24 },
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


export const scanQrStyles = StyleService.create({
  flexWrap: { flex: 1, flexWrap: 'wrap' },
  marginRight16: { marginRight: 16 },
  flexCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  paddingBottom16: {
    paddingBottom: 16,
  },
  markerStyles: { borderColor: 'color-staking' },
  qrError: { paddingTop: s(24), color: 'red' },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  topTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(12),
    zIndex: 9999,
  },
  iconGrp: {
    flexDirection: 'row',
  },
  iconContainer: {
    backgroundColor: '#ff0000',
    padding: 12,
  },
  icon: {
    width: s(18),
    height: s(18),
    tintColor: '$icon-basic-color',
  },
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
  errorText: { color: 'red', flex: 1, marginTop: 24 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    flex: 1,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export const sellNftStyles = StyleSheet.create({
  flexWrap: { flex: 1, flexWrap: 'wrap' },
  marginRight16: { marginRight: 16 },
  marginTop24: { marginTop: 24 },
  marginBottom24: { marginBottom: s(24) },
  paddingBottom16: {
    paddingBottom: 16,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  xnavText: { marginBottom: 2, marginLeft: -10 },
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
  errorText: { color: 'red', flex: 1, marginTop: 24 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 16,
    marginBotton: 24,
    flex: 1,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export const sendToScreenStyles = StyleService.create({
  showDialog: { marginHorizontal: s(12), flexDirection: 'row' },
  flexOne: { flex: 1 },
  addIcon: {
    tintColor: 'white',
    width: s(24),
    height: s(24),
    marginRight: s(24),
  },
  flexEnd: { justifyContent: 'flex-end' },
  contentContainerStyle: {
    paddingTop: vs(24),
    paddingHorizontal: s(24),
  },
  card: {
    borderRadius: s(12),
    borderWidth: s(1),
    borderColor: 'color-basic-1500',
    marginTop: vs(24),
    paddingTop: vs(14),
    paddingBottom: vs(12),
    paddingHorizontal: s(16),
    marginBottom: vs(24),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: vs(4),
  },
  note: {
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    borderRadius: s(24),
  },
  text: {
    color: 'color-basic-1100',
  },
  bottom: {
    paddingTop: vs(8),
    paddingHorizontal: s(24),
  },
  flex1: {
    flex: 1,
    border: 'none',
  },
});

export const serversScreenStyles = StyleSheet.create({
  summary: { textAlign: 'center', paddingHorizontal: 24 },
  serversWrapper: {
    padding: 24,
    flex: 1,
  },
});

export const settingScreenStyles = StyleSheet.create({
  contentWrapper: {
    paddingHorizontal: s(20),
    marginBottom: vs(20),
  },
});

export const stakingNodeStyles = StyleSheet.create({
  summary: { textAlign: 'center', paddingHorizontal: 24 },
  serversWrapper: {
    padding: 24,
    flex: 1,
  },
});