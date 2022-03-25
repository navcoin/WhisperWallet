import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import {ReanimatedArc} from '@callstack/reanimated-arc';
import {Easing} from 'react-native-reanimated';
import {useTheme} from '@ui-kitten/components';
import {timeout} from '../utils/helpers';

const easing = Easing.inOut(Easing.quad);

const SegmentCircle = ({
  segments,
  minArcSpacing,
  maxArcSize,
  radius,
  animationDuration,
  animated,
  arcWidth,
}: SegmentCircleProps) => {
  const theme = useTheme();
  const [hide, setHide] = useState(false);
  const [currentSegmentCount, setCurrentSegmentCount] = useState(
    segments.length,
  );

  /* Rerendering Management*/
  useEffect(() => {
    if (segments) {
      setCurrentSegmentCount(segments.length);
    }
  }, [segments]);

  const forceRerender = async () => {
    setHide(true);
    await timeout(300);
    setHide(false);
  };

  useEffect(() => {
    forceRerender();
  }, [currentSegmentCount]);

  /* Arcs Calculation*/
  const initialRotation = 210;
  const totalArcs = segments.filter((el: any) => el.size > 0).length;
  const totalSpacing = totalArcs * minArcSpacing;
  const totalSegmentSize = segments
    .filter(el => el.size > 0)
    .map(el => el.size)
    .reduce((partialSum, a) => partialSum + a, 0);
  const totalArcSize = maxArcSize - totalSpacing;

  const margin = 15;
  const svgWidth = (radius + arcWidth) * 2 + 2 * margin;

  /*
   * Default state
   *
   * This if block of code is intentionally added for forcing rerender of the arcs,
   * This resolves the issue that when there are changes in segments.length, the rerender of the arcs failed
   * The possible reason for this to happen is due to caching of the package/react
   */
  if (!segments.length || hide) {
    return <View style={{height: svgWidth}} />;
  }

  const calculateSegmentSize = (size: number) =>
    (size / totalSegmentSize) * totalArcSize;

  if (totalArcs === 0 && segments.length > 0) {
    return (
      <ReanimatedArc
        color={theme['color-nav-pink']}
        diameter={svgWidth}
        width={arcWidth}
        arcSweepAngle={360 - minArcSpacing}
        lineCap="round"
        rotation={initialRotation}
        initialAnimation={false}
        easing={easing}
      />
    );
  }

  return (
    <>
      {segments.map((segment, index) => {
        const arcSweepAngle = calculateSegmentSize(segment.size);
        let rotation = 0 + initialRotation;
        if (index > 0) {
          rotation += minArcSpacing * index;
          for (let i = 0; i < index; i++) {
            rotation += calculateSegmentSize(segments[i].size);
          }
        }
        return (
          <>
            <ReanimatedArc
              index={index}
              color={segment.color || theme['color-patrick-blue-400']}
              diameter={svgWidth}
              width={arcWidth}
              arcSweepAngle={arcSweepAngle}
              lineCap="round"
              rotation={rotation}
              initialAnimation={false}
              easing={easing}
              style={index === 0 ? {} : styles.absolute}
            />
          </>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
});

interface Segment {
  size: number;
  color?: string;
}

interface SegmentCircleProps {
  segments: Segment[];
  arcWidth: number;
  minArcSpacing: number;
  maxArcSize: number;
  radius: number;
  color: string;
  animationDuration: number;
  animated: boolean;
}

SegmentCircle.propTypes = {
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.number.isRequired,
      color: PropTypes.string,
    }),
  ),
  arcWidth: PropTypes.number,
  minArcSpacing: PropTypes.number,
  maxArcSize: PropTypes.number,
  radius: PropTypes.number,
  color: PropTypes.string,
  animationDuration: PropTypes.number,
  animated: PropTypes.bool,
};

SegmentCircle.defaultProps = {
  segments: [],
  arcWidth: 14,
  minArcSpacing: 14,
  radius: 100,
  color: '#ADB1CC',
  animationDuration: 1000,
  animated: true,
  maxArcSize: 360,
};

export default SegmentCircle;
