import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleService, useStyleSheet} from '@tsejerome/ui-kitten-components';
import {
  BottomSheetContextValue,
  BottomSheetContext,
} from './BottomSheetContext';

export const BottomSheetProvider = (props: any) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [content, setContent] = useState(null);

  const styles = useStyleSheet(themedStyles);

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  useEffect(() => {
    if (content) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.collapse();
    }
  }, [content]);

  const bottomSheetContext: BottomSheetContextValue = useMemo(
    () => ({
      expand: c => {
        setContent(c);
      },
      collapse: () => {
        setContent(null);
      },
      getRef: bottomSheetRef?.current,
    }),
    [bottomSheetRef],
  );

  return (
    <BottomSheetContext.Provider value={bottomSheetContext}>
      {props.children}

      {content && (
        <BottomSheet
          index={0}
          snapPoints={animatedSnapPoints}
          handleHeight={animatedHandleHeight}
          contentHeight={animatedContentHeight}
          ref={bottomSheetRef}
          enablePanDownToClose={true}
          handleStyle={styles.handleStyle}
          animateOnMount={true}
          backdropComponent={props => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              close={() => bottomSheetRef.current?.close()}
            />
          )}>
          <BottomSheetView onLayout={handleContentLayout}>
            {content ? content : <></>}
          </BottomSheetView>
        </BottomSheet>
      )}
    </BottomSheetContext.Provider>
  );
};

/*const BottomSheetProvider = (props: any) => {
  const [content, setBottomContent] = useState(<></>);

  const styles = useStyleSheet(themedStyles);

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    return;
  }, []);

  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);

  const setContent = (c: ReactElement) => {
    setBottomContent(c);
  };

  return (
    <>
      {props.children}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        index={bottomSheetIndex}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        handleStyle={styles.handleStyle}
        animateOnMount={true}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            close={() => bottomSheetRef.current?.close()}
          />
        )}>
        <BottomSheetView onLayout={handleContentLayout}>
          {content}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};*/

export default BottomSheetProvider;

const themedStyles = StyleService.create({
  handleStyle: {
    backgroundColor: 'background-basic-color-3',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});
