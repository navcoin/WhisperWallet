import React, {useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from 'react-native';
import {ReanimatedArc} from '@callstack/reanimated-arc';
import {Easing} from 'react-native-reanimated';
import {useTheme} from '@ui-kitten/components';

const easing = Easing.inOut(Easing.quad);

const SegmentCircle = ({
  segments,
  minArcSpacing,
  maxArcSize,
  radius,
  style,
  animationDuration,
  animated,
  arcWidth,
}: SegmentCircleProps) => {
  const theme = useTheme();
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [currentSegmentCount, setCurrentSegmentCount] = useState(
    segments.length,
  );

  useEffect(() => {
    if (segments) {
      setCurrentSegmentCount(segments.length);
    }
  }, [segments]);

  useEffect(() => {
    forceUpdate();
  }, [currentSegmentCount]);

  const initialRotation = 0;
  const totalArcs = segments.filter((el: any) => el.size > 0).length;
  const totalSpacing = totalArcs * minArcSpacing;
  const totalSegmentSize = segments
    .filter(el => el.size > 0)
    .map(el => el.size)
    .reduce((partialSum, a) => partialSum + a, 0);
  const totalArcSize = maxArcSize - totalSpacing;

  const margin = 15;
  const svgWidth = (radius + arcWidth) * 2 + 2 * margin;

  if (!segments.length) {
    return <></>;
  }

  const calculateSegmentSize = (size: number) =>
    (size / totalSegmentSize) * totalArcSize;
  return (
    <>
      <View>
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
                style={index === 0 ? {paddingBottom: 20} : styles.absolute}
              />
              <Text style={{color: 'white'}}>
                {JSON.stringify({
                  index,
                  rotation,
                  arcSweepAngle,
                  color: segment.color,
                })}
              </Text>
            </>
          );
        })}
      </View>
      <Text style={{color: 'white'}}>{JSON.stringify(segments)}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
});

interface SegmentCircleProps {
  segments: {
    size: number;
    color?: string;
  }[];
  arcWidth: number;
  minArcSpacing: number;
  maxArcSize: number;
  radius: number;
  color: string;
  style: object;
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
  style: PropTypes.object,
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
