import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';

import Svg, {G, Text, Path, Rect} from 'react-native-svg';
import {Spring} from 'react-spring';
import {drawArc, polarToCartesian, scaleValue} from '../utils/helpers';

const SegmentCircle = ({
  segments,
  arcSpacing,
  totalArcSize,
  color,
  radius,
  style,
  animationDuration,
  animated,
  arcWidth,
}) => {
  const [arcs, setArcs] = useState([]);

  const totalArcs = segments.filter((el: any) => el.size > 0).length;

  const totalSpaces = totalArcs - 1;
  const totalSpacing = totalSpaces * arcSpacing;

  const arcsStart = 90 - totalArcSize / 2;

  const margin = 15;
  const svgWidth = (radius + arcWidth) * 2 + 2 * margin;
  const svgHeight = (radius + arcWidth) * 2 + 2 * margin;

  const totalFilledValue =
    segments.reduce((acc: any, actual: any) => acc + actual.size, 0) || 1;

  const createArcs = useCallback(() => {
    const prevArcs: any = arcs;
    const newArcs: any = [];
    let prevEnd = arcsStart;

    for (let index in segments) {
      let goal = segments[index];

      if (goal.size == 0) {
        continue;
      }

      const arcSize =
        (totalArcSize - totalSpacing) * (goal.size / totalFilledValue) || 1;

      const newArc = {
        centerX: radius + arcWidth + margin,
        centerY: radius + arcWidth + margin,
        start: prevEnd,
        end: prevEnd + arcSize,
        color: goal.color || color,
        prevEnd: 0,
      };

      prevEnd += arcSize;

      if (parseInt(index) !== 0) {
        newArc.start += arcSpacing * parseInt(index);
        newArc.end += arcSpacing * parseInt(index);
      }

      if (segments.length == prevArcs.length) {
        newArc.prevEnd = prevArcs[index].end;
      } else {
        newArc.prevEnd = newArc.end;
      }

      newArcs.push(newArc);
    }

    if (newArcs.length == 0) {
      const arcSize = 359;

      const newArc = {
        centerX: radius + arcWidth + margin,
        centerY: radius + arcWidth + margin,
        start: prevEnd,
        end: prevEnd + arcSize,
        prevEnd: prevEnd + arcSize,
        color: segments[0].color || color,
      };

      newArcs.push(newArc);
    }

    setArcs(newArcs);
  }, [segments, arcSpacing, arcWidth, arcsStart, radius]);

  useEffect(() => {
    createArcs();
  }, [segments, createArcs]);

  if (arcs.length === 0) {
    return <></>;
  }

  return (
    <Svg width={svgWidth} height={svgHeight} style={style} style={{flex: 1}}>
      {arcs.map((arc, index) => (
        <G key={index.toString()}>
          <Path
            fill="none"
            stroke={arc.color}
            strokeWidth={arcWidth}
            strokeLinecap="round"
            d={drawArc(arc.centerX, arc.centerY, radius, arc.start, arc.end)}
          />
        </G>
      ))}
    </Svg>
  );
};

SegmentCircle.propTypes = {
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.number.isRequired,
      color: PropTypes.string,
    }),
  ),
  arcWidth: PropTypes.number,
  arcSpacing: PropTypes.number,
  totalArcSize: PropTypes.number,
  radius: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.object,
  animationDuration: PropTypes.number,
  animated: PropTypes.bool,
};

SegmentCircle.defaultProps = {
  segments: [],
  arcWidth: 7,
  arcSpacing: 7,
  totalArcSize: 280,
  radius: 100,
  color: '#ADB1CC',
  animationDuration: 1000,
  animated: true,
};

export default SegmentCircle;
