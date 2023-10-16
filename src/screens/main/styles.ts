import { StyleService } from '@tsejerome/ui-kitten-components';
import { s } from 'react-native-size-matters';

export const mainScreenTabStyles = StyleService.create({
  container: {
    backgroundColor: 'color-basic-700',
    flex: 1,
    marginLeft: s(16),
    marginRight: s(16),
  },
  fontSize12: {
    fontSize: 12,
  },
  tabBarStyle: { backgroundColor: 'background-basic-color-700' },
  tabBarIndicatorStyle: { backgroundColor: 'color-primary-100' },
});
