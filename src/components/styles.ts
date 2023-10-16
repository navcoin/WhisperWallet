import { StyleSheet } from 'react-native';
import { StyleService } from '@tsejerome/ui-kitten-components';
import { s, vs } from 'react-native-size-matters';

export const alertStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'background-basic-color-1',
    padding: 24,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export const animatedStepStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: s(64),
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dot: {
    width: s(16),
    height: s(16),
    borderRadius: s(8),
  },
  line: {
    height: 2,
    flex: 1,
  },
});

export const balanceCardStyles = StyleService.create({
  tintColorBasic: {
    tintColor: 'icon-basic-color',
  },
  fontSize13: {
    fontSize: s(13),
  },
  mineTextColor: {
    color: 'color-primary-100',
  },
  flexRow: { flexDirection: 'row' },
  containerBackgroundColor: {
    backgroundColor: 'background-basic-color-2',
  },
  container: {
    borderRadius: s(12),
    paddingVertical: s(10),
    paddingLeft: s(10),
    paddingRight: s(21),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
    paddingRight: s(16),
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  walletIcon: {
    width: s(48),
    height: s(48),
    borderRadius: s(48),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(16),
  },
  icon: {
    width: s(16),
    height: s(16),
    right: s(16),
  },
});

export const balanceCircleStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  currencyTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  posAbsolute: {
    position: 'absolute',
  },
});

export const bottomSheetMenuStyles = StyleService.create({
  item: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  container: {
    flex: 1,
  },
  button: { padding: 100 },
  contentContainer: {
    backgroundColor: 'background-basic-color-3',
    flex: 1,
    paddingTop: 8,
    padding: 20,
  },
  marginBottom32: { marginBottom: 32 },
});

export const bottomSheetOptionStyles = StyleService.create({
  item: {
    paddingHorizontal: s(16),
    marginBottom: vs(16),
  },
  container: {
    flex: 1,
  },
  button: { padding: s(100) },
  contentContainer: {
    backgroundColor: 'background-basic-color-3',
    flex: 1,
    padding: s(20),
    paddingTop: vs(8),
  },
  marginBottom32: { marginBottom: 32 },
});

export const bottomSheetViewStyles = StyleService.create({
  item: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  container: {
    flex: 1,
  },
  button: { padding: 100 },
  contentContainer: {
    backgroundColor: 'background-basic-color-3',
    flex: 1,
    paddingTop: 8,
    padding: 20,
  },
});

export const destinationStyles = StyleService.create({
  marginTopLeft: { marginTop: s(11), marginLeft: s(17) },
  qrIcon: {
    tintColor: 'white',
    width: s(24),
    height: s(24),
    marginRight: s(8),
    marginLeft: s(16),
  },
  iconView: {
    width: s(48),
    height: s(48),
    borderRadius: s(24),
    borderWidth: s(3),
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    top: vs(-36),
    borderColor: 'background-basic-color-1',
    backgroundColor: 'color-salmon-100',
  },
  icon: {
    width: s(16),
    height: s(16),
    tintColor: 'color-basic-100',
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
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  flex1: {
    flex: 1,
    border: 'none',
  },
});

export const inputSelectStyles = StyleService.create({
  borderBottomColor: { borderBottomColor: 'color-basic-800' },
  flexColumn: { flexDirection: 'column' },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    width: 12,
    height: 12,
    marginLeft: 6,
  },
});

export const mnemonicStyles = StyleSheet.create({
  infoText: { marginHorizontal: s(24) },
  optionCardWrapper: { width: s(200), marginTop: s(24) },
  boxWordGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(16),
  },
  boxWord: {
    borderRadius: s(16),
    paddingBottom: vs(20),
    width: s(120),
  },
  mainWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  innerWrapper: {
    maxWidth: s(380),
    flex: 1,
    margin: 'auto',
    justifySelf: 'center',
    alignItems: 'center',
  },
});


export const optionCardStyles = StyleSheet.create({
  container: {
    borderRadius: s(12),
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    marginBottom: vs(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: s(1),
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifySelf: 'stretch',
    flexWrap: 'nowrap',
    flex: 1,
  },
  icon: {
    width: s(24),
    height: s(24),
  },
  content: {
    flex: 1,
  },
  iconWrapper: {
    borderRadius: s(48),
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(12),
  },
  leftIconWrapper: {
    marginRight: s(16),
  },
  rightIconWrapper: {
    marginLeft: s(16),
  },
  rightIconTouchables: {
    justifyContent: 'center',
  },
});

export const sendTransactionStyles = StyleService.create({
  textFlex: { flex: 1, flexWrap: 'wrap' },
  marginBottom24: { marginBottom: 24 },
  marginRight16: { marginRight: 16 },
  paddingBottom16: { paddingBottom: 16 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'color-basic-1500',
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

export const frequencyTabStyles = StyleSheet.create({
  container: {
    height: vs(44),
    flexDirection: 'row',
    overflow: 'hidden',
    alignSelf: 'center',
    borderBottomWidth: vs(1),
    borderBottomColor: '#3E4C59',
  },
  boxAni: {
    height: vs(2),
    position: 'absolute',
    borderRadius: s(20),
    bottom: 0,
    borderTopLeftRadius: s(12),
    borderTopRightRadius: s(12),
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export const transactionStyles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    paddingVertical: 12,
    paddingLeft: 10,
    paddingRight: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconView: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginRight: 24,
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export const swipeButtonStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  underlayContainer: {
    position: 'absolute',
    backgroundColor: '#152228',
  },
});

export const cardSelectStyles = StyleService.create({
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
  column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  text: {
    marginLeft: s(17),
    marginTop: s(11),
    flex: 1,
  },
});

export const cardStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textView: {
    marginRight: s(32),
  },
  image: {
    borderRadius: s(16),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContent: {
    width: '90%',
    marginVertical: vs(50),
    maxWidth: vs(200),
    maxHeight: vs(200),
    height: undefined,
    aspectRatio: 1,
  },
});

export const toastStyles = StyleSheet.create({
  container: {
    marginTop: 20,
    borderLeftWidth: 8,
  },
});