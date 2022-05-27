import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleService, useStyleSheet} from '@tsejerome/ui-kitten-components';
import {
  BottomSheetContextValue,
  BottomSheetContext,
} from './BottomSheetContext';
import {Platform} from 'react-native';

export const BottomSheetProvider = (props: any) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [content, setContent] = useState(null);
  const [contentPan, setContentPan] = useState(true);

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
        setContentPan(
          Platform.OS == 'android' &&
            !JSON.stringify(c).includes('Swipe to confirm')
            ? true
            : false,
        );
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
          enableContentPanningGesture={contentPan}
          handleStyle={styles.handleStyle}
          backgroundStyle={styles.backgroundStyle}
          animateOnMount={true}
          backdropComponent={props => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              close={() => {
                bottomSheetRef.current?.close();
              }}
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

export default BottomSheetProvider;

const themedStyles = StyleService.create({
  handleStyle: {
    backgroundColor: 'background-basic-color-3',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  backgroundStyle: {
    backgroundColor: 'background-basic-color-3',
  },
});
