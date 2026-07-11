'use client';

import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';

import './Counter.css';

function NumberColumn({ mv, number, height }: { mv: any; number: number; height: number }) {
  const y = useTransform(mv, (latest: number) => {
    const placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });
  return (
    <motion.span className="counter-number" style={{ y }}>
      {number}
    </motion.span>
  );
}

function normalizeNearInteger(num: number) {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));
  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value: number, place: number) {
  const scaled = value / place;
  return Math.floor(normalizeNearInteger(scaled));
}

function Digit({
  place,
  value,
  height,
  digitStyle,
}: {
  place: number | '.';
  value: number;
  height: number;
  digitStyle?: React.CSSProperties;
}) {
  const isDecimal = place === '.';
  const valueRoundedToPlace = isDecimal ? 0 : getValueRoundedToPlace(value, place as number);
  const animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    if (!isDecimal) {
      animatedValue.set(valueRoundedToPlace);
    }
  }, [animatedValue, valueRoundedToPlace, isDecimal]);

  if (isDecimal) {
    return (
      <span className="counter-digit" style={{ height, ...digitStyle, width: 'fit-content' }}>
        .
      </span>
    );
  }

  return (
    <span className="counter-digit" style={{ height, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <NumberColumn key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: (number | '.')[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: string | number;
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
}

export default function Counter({
  value,
  fontSize = 100,
  padding = 0,
  places,
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = 'inherit',
  fontWeight = 'inherit',
  containerStyle,
  counterStyle,
  digitStyle,
}: CounterProps) {
  const resolvedPlaces: (number | '.')[] =
    places ??
    [...value.toString()].map((ch, i, a) => {
      if (ch === '.') return '.';
      const dotIndex = a.indexOf('.');
      return 10 ** (dotIndex === -1 ? a.length - i - 1 : i < dotIndex ? dotIndex - i - 1 : -(i - dotIndex));
    });

  const height = fontSize + padding;
  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    gap,
    borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    color: textColor,
    fontWeight,
    direction: 'ltr',
  };

  return (
    <span className="counter-container" style={containerStyle}>
      <span className="counter-counter" style={{ ...defaultCounterStyle, ...counterStyle }}>
        {resolvedPlaces.map((place, i) => (
          <Digit key={i} place={place} value={value} height={height} digitStyle={digitStyle} />
        ))}
      </span>
    </span>
  );
}
