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
  const bow = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.22)).current;
  const glow = tone === 'correct' ? '#FFE27A' : tone === 'almost' ? '#FFC46B' : tone === 'miss' ? '#F0B69F' : '#FFE7A8';
  const rotate = bow.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] });

  useEffect(() => {
    if (tone === 'idle') {
      return;
    }

    Animated.parallel([
      Animated.sequence([
        Animated.spring(bounce, { toValue: tone === 'correct' ? 1.12 : 1.04, useNativeDriver: true }),
        Animated.spring(bounce, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(bow, { toValue: tone === 'correct' ? 1 : -0.4, duration: 160, useNativeDriver: true }),
        Animated.spring(bow, { toValue: 0, friction: 4, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: tone === 'correct' ? 0.68 : 0.42, duration: 160, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.22, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, [bounce, bow, glowOpacity, tone]);

  return (
    <View style={[styles.row, compact ? styles.compactRow : null]}>
      <Animated.View
        style={[
          styles.mascot,
          compact ? styles.compactMascot : null,
          { transform: [{ perspective: 700 }, { rotate }, { scale: bounce }] },
        ]}
      >
        <Animated.View style={[styles.glow, { backgroundColor: glow, opacity: glowOpacity }]} />
        <View style={styles.halo} />
        <View style={styles.shadow} />
        <View style={styles.hoodBack} />
        <View style={styles.face}>
          <View style={styles.browRow}>
            <View style={styles.brow} />
            <View style={styles.brow} />
          </View>
          <View style={styles.eyeRow}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
          <View style={styles.nose} />
          <View style={[styles.mouth, tone === 'miss' ? styles.softMouth : null]} />
          <View style={styles.beard} />
        </View>
        <View style={styles.body}>
          <View style={styles.collar} />
          <Text style={styles.book}>✦</Text>
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
    minHeight: 118,
  },
  compactRow: {
    minHeight: 102,
  },
  mascot: {
    width: 94,
    height: 110,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  compactMascot: {
    width: 84,
    height: 98,
  },
  glow: {
    position: 'absolute',
    top: 6,
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  halo: {
    position: 'absolute',
    top: 4,
    width: 46,
    height: 14,
    borderRadius: 999,
    borderColor: '#F6C96D',
    borderWidth: 3,
    transform: [{ rotateX: '55deg' }],
  },
  shadow: {
    position: 'absolute',
    bottom: 0,
    width: 72,
    height: 16,
    borderRadius: 999,
    backgroundColor: '#C9B894',
    opacity: 0.38,
  },
  hoodBack: {
    position: 'absolute',
    top: 20,
    width: 70,
    height: 74,
    borderRadius: 28,
    backgroundColor: '#8B633F',
    borderRightColor: '#664629',
    borderRightWidth: 5,
    borderBottomColor: '#664629',
    borderBottomWidth: 5,
  },
  face: {
    position: 'absolute',
    top: 30,
    width: 54,
    height: 58,
    borderRadius: 25,
    backgroundColor: '#F1C9A6',
    alignItems: 'center',
    borderRightColor: '#D7A883',
    borderRightWidth: 4,
  },
  browRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  brow: {
    width: 11,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#F7EFE6',
  },
  eyeRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 2,
  },
  eye: {
    width: 5,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#4F351F',
  },
  nose: {
    width: 6,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D9A783',
    marginTop: 1,
  },
  mouth: {
    width: 15,
    height: 7,
    borderBottomColor: '#69472B',
    borderBottomWidth: 2,
    borderRadius: 10,
    marginTop: 1,
  },
  softMouth: {
    width: 11,
  },
  beard: {
    position: 'absolute',
    bottom: -11,
    width: 38,
    height: 23,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#F4EFE6',
    borderRightColor: '#D8CFC0',
    borderRightWidth: 3,
  },
  body: {
    width: 72,
    height: 42,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    backgroundColor: '#7A5435',
    borderRightColor: '#5B3B23',
    borderRightWidth: 5,
    borderBottomColor: '#5B3B23',
    borderBottomWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collar: {
    position: 'absolute',
    top: 5,
    width: 30,
    height: 12,
    borderRadius: 12,
    backgroundColor: '#E8D4B8',
  },
  book: {
    color: '#FFE7A8',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
  },
});
