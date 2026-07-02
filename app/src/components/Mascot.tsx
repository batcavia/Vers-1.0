import { Animated, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef } from 'react';

import { FeedbackBubble } from './FeedbackBubble';
import type { FeedbackTone } from './FeedbackBubble';

type Props = {
  tone: FeedbackTone;
  message: string;
  compact?: boolean;
};

export function Mascot({ tone, message, compact = false }: Props) {
  const bounce = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.35)).current;
  const glow = tone === 'correct' ? '#FFE27A' : tone === 'almost' ? '#FFC46B' : tone === 'miss' ? '#F0B69F' : '#FFE7A8';

  useEffect(() => {
    if (tone === 'idle') {
      return;
    }

    Animated.parallel([
      Animated.sequence([
        Animated.spring(bounce, { toValue: tone === 'correct' ? 1.13 : 1.05, useNativeDriver: true }),
        Animated.spring(bounce, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: tone === 'correct' ? 0.72 : 0.5, duration: 160, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.35, duration: 260, useNativeDriver: true }),
      ]),
    ]).start();
  }, [bounce, glowOpacity, tone]);

  return (
    <View style={[styles.row, compact ? styles.compactRow : null]}>
      <Animated.View style={[styles.mascot, compact ? styles.compactMascot : null, { transform: [{ scale: bounce }] }]}>
        <Animated.View style={[styles.glow, { backgroundColor: glow, opacity: glowOpacity }]} />
        <View style={styles.rayTop} />
        <View style={styles.rayLeft} />
        <View style={styles.rayRight} />
        <View style={styles.bulb}>
          <View style={styles.faceRow}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
          <View style={[styles.mouth, tone === 'miss' ? styles.softMouth : null]} />
        </View>
        <View style={styles.neck} />
        <View style={styles.base}>
          <Text style={styles.baseText}>Vers</Text>
        </View>
      </Animated.View>
      <FeedbackBubble tone={tone} message={message} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 104,
  },
  compactRow: {
    minHeight: 92,
  },
  mascot: {
    width: 86,
    height: 96,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  compactMascot: {
    width: 78,
    height: 88,
  },
  glow: {
    position: 'absolute',
    top: 3,
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  rayTop: {
    position: 'absolute',
    top: 0,
    width: 7,
    height: 16,
    borderRadius: 5,
    backgroundColor: '#FFE27A',
  },
  rayLeft: {
    position: 'absolute',
    top: 20,
    left: 8,
    width: 14,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#FFE27A',
    transform: [{ rotate: '-28deg' }],
  },
  rayRight: {
    position: 'absolute',
    top: 20,
    right: 8,
    width: 14,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#FFE27A',
    transform: [{ rotate: '28deg' }],
  },
  bulb: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFE8A6',
    borderColor: '#C99224',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceRow: {
    flexDirection: 'row',
    gap: 13,
    marginTop: 4,
  },
  eye: {
    width: 6,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#533C19',
  },
  mouth: {
    width: 18,
    height: 8,
    borderBottomColor: '#533C19',
    borderBottomWidth: 2,
    borderRadius: 10,
    marginTop: 5,
  },
  softMouth: {
    width: 14,
  },
  neck: {
    width: 28,
    height: 10,
    backgroundColor: '#F6C96D',
    borderLeftColor: '#C99224',
    borderRightColor: '#C99224',
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  base: {
    width: 52,
    height: 24,
    borderRadius: 10,
    backgroundColor: '#1E7D68',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#12614F',
    borderBottomWidth: 4,
  },
  baseText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
});
