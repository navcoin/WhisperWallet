/// <reference types="react" />
import { TextProps, StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';
import { SwipeButtonCommonProps } from './SwipeButton';
export interface SwipeButtonTextProps extends Omit<SwipeButtonCommonProps, 'borderRadius'> {
    /**
     * The text that will be displaied in the container
     */
    title: string;
    /**
     * Additional props for the title text
     */
    titleProps?: TextProps;
    /**
     * Additional styling for the title text
     */
    titleStyle?: StyleProp<TextStyle>;
    /**
     * Additional props for the title container
     */
    titleContainerProps?: ViewProps;
    /**
     * Additional styling for the title container
     */
    titleContainerStyle?: StyleProp<ViewStyle>;
}
declare const SwipeButtonText: ({ title, titleStyle, titleContainerProps, titleContainerStyle, titleProps, height, }: SwipeButtonTextProps) => JSX.Element;
export default SwipeButtonText;
