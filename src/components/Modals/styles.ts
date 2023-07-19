import { StyleSheet } from 'react-native';
import { Mirage } from '@constants';
import { s } from 'react-native-size-matters';

export const modalStyles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    padding: 20,
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  absolute: {
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  backgroundColor: {
    backgroundColor: Mirage,
  },
});

export const deleteWalletModalStyles = StyleSheet.create({
  item: {
    marginBottom: s(40),
  },
  buttonGroup: {
    marginTop: s(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    marginBottom: s(20),
    flex: 1,
    maxWidth: '45%',
  },
  containerPadding: {
    paddingHorizontal: s(30),
  },
});

export const errorModalStyles = StyleSheet.create({
  item: {
    paddingHorizontal: s(16),
    marginBottom: s(16),
  },
  buttonGroup: {
    marginTop: s(20),
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginBottom: s(20),
    width: s(300),
  },
});

export const loadingModalStyles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export const skipMnemonicStyles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
  item: {
    paddingHorizontal: s(16),
    marginTop: s(32),
  },
  buttonGroup: {
    marginTop: s(20),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    marginBottom: s(20),
    width: '47%',
  },
});
