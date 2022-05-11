import {ReactNode} from 'react';
import {GestureResponderHandlers, Animated} from 'react-native';
import {SwipeButtonCommonProps} from './SwipeButton';
export interface SwipeButtonCircleProps extends SwipeButtonCommonProps {
  /**
   * GestureHandlers for when swiping the button
   */
  panHandlers: GestureResponderHandlers;
  /**
   * Opacity of the element
   */
  opacity?: number;
  /**
   * Element that should be displaied inside the button
   */
  Icon: ReactNode;
  /**
   * Determinates the value of the button
   */
  translateX: Animated.Value;
  /**
   * Background color for the circle
   */
  circleBackgroundColor?: string;
}
declare const SwipeButtonCircle: ({
  Icon,
  opacity,
  panHandlers,
  translateX,
  height,
  borderRadius,
  circleBackgroundColor,
}: SwipeButtonCircleProps) => JSX.Element;
export default SwipeButtonCircle;
