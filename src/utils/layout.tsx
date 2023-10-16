import { StyleService } from '@tsejerome/ui-kitten-components/theme';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

/* This value is the maxWidth of small components like Input and Buttons in big screensize like iPad*/
const maxComponentWidth = 400;

const layoutStyles = StyleService.create({
  responsiveRowComponentWidth: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  responsiveColumnComponentWidth: {
    width: '100%',
    flexDirection: 'column',
    alignSelf: 'center',
  },
});

export {
  width as screenWidth,
  height as screenHeight,
  layoutStyles,
  maxComponentWidth,
};
