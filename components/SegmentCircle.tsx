import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {useTheme} from '@ui-kitten/components';
import {timeout} from '../utils/helpers';

const SegmentCircle = ({
  segmentsSource,
  minArcSpacing,
  maxArcSize,
  radius,
  animationDuration,
  animated,
  arcWidth,
}: SegmentCircleProps) => {
  const theme = useTheme();
  const [segments, setSegments] = useState<Segment[]>([]);

  useEffect(() => {
    if (segmentsSource.length) {
      setSegments(segmentsSource.filter(el => el.size > 0));
    }
  }, [segmentsSource]);

  /* Arcs Calculation*/
  const initialRotation = 210;
  const totalArcs = segments.filter((el: any) => el.size > 0).length;
  const totalSpacing = totalArcs > 1 ? totalArcs * minArcSpacing : 0;
  const totalSegmentSize = segments
    .filter(el => el.size > 0)
    .map(el => el.size)
    .reduce((partialSum, a) => partialSum + a, 0);
  const totalArcSize = maxArcSize - totalSpacing;

  const margin = 15;
  const svgWidth = (radius + arcWidth) * 2 + 2 * margin;

  if (!segments.length) {
    return <View style={{height: svgWidth}} />;
  }

  const calculateSegmentSize = (size: number) =>
    (size / totalSegmentSize) * totalArcSize;

  const onlyOneSegmentHasSize = (): Segment | null => {
    if (totalArcs === 1) {
      return segments.filter(el => el.size > 0)[0];
    }
    return null;
  };

  if (totalArcs === 0 && segments.length > 0) {
    return (
      <AnimatedCircularProgress
        tintColor={
          onlyOneSegmentHasSize()?.color || theme['color-patrick-blue-400']
        }
        size={svgWidth}
        width={arcWidth}
        arcSweepAngle={360}
        lineCap="butt"
        rotation={initialRotation}
        fill={100}
        backgroundColor="transparent"
      />
    );
  }

  return (
    <>
      {segments.map((segment, index) => {
        const arcSweepAngle = calculateSegmentSize(segment.size);
        let rotation = 0 + initialRotation + minArcSpacing * index;
        for (let i = 0; i < index; i++) {
          rotation += calculateSegmentSize(segments[i].size);
        }
        return (
          <AnimatedCircularProgress
            index={index}
            tintColor={segment.color || theme['color-patrick-blue-400']}
            size={svgWidth}
            width={arcWidth}
            lineCap={'round'}
            rotation={rotation}
            fill={(arcSweepAngle / 360) * 100}
            duration={1200}
            onAnimationComplete={() => console.log('onAnimationComplete')}
            backgroundColor="transparent"
            style={index === 0 ? {} : styles.absolute}
          />
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
  segmentsSource: Segment[];
  arcWidth: number;
  minArcSpacing: number;
  maxArcSize: number;
  radius: number;
  color: string;
  animationDuration: number;
  animated: boolean;
}

SegmentCircle.propTypes = {
  segmentsSource: PropTypes.arrayOf(
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
  segmentsSource: [],
  arcWidth: 10,
  minArcSpacing: 14,
  radius: 100,
  color: '#ADB1CC',
  animationDuration: 1000,
  animated: true,
  maxArcSize: 360,
};

export default SegmentCircle;
