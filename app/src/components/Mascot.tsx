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
  const glowOpacity = useRef(new Animated.Value(0.18)).current;
  const glow = tone === 'correct' ? '#FFE27A' : tone === 'almost' ? '#FFC46B' : tone === 'miss' ? '#F0B69F' : '#E8D3A8';
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
        Animated.timing(glowOpacity, { toValue: tone === 'correct' ? 0.62 : 0.36, duration: 160, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.18, duration: 300, useNativeDriver: true }),
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
        <View style={styles.shadow} />
        <View style={styles.hoodOuter} />
        <View style={styles.hoodInner} />
        <View style={styles.face}>
          <View style={styles.hairLine} />
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
        <View style={styles.ropeLeft} />
        <View style={styles.ropeRight} />
        <View style={styles.body}>
          <View style={styles.sleeveLeft} />
          <View style={styles.sleeveRight} />
          <View style={styles.ropeBelt} />
          <View style={styles.bookWrap}>
            <Text style={styles.book}>✝</Text>
          </View>
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
    minHeight: 128,
  },
  compactRow: {
    minHeight: 110,
  },
  mascot: {
    width: 100,
    height: 122,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  compactMascot: {
    width: 90,
    height: 108,
  },
  glow: {
    position: 'absolute',
    top: 8,
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  shadow: {
    position: 'absolute',
    bottom: 0,
    width: 78,
    height: 16,
    borderRadius: 999,
    backgroundColor: '#C9B894',
    opacity: 0.38,
  },
  hoodOuter: {
    position: 'absolute',
    top: 12,
    width: 82,
    height: 82,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    backgroundColor: '#6F4729',
    borderRightColor: '#4D2F1A',
    borderRightWidth: 6,
    borderBottomColor: '#4D2F1A',
    borderBottomWidth: 6,
  },
  hoodInner: {
    position: 'absolute',
    top: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#4D2F1A',
  },
  face: {
    position: 'absolute',
    top: 30,
    width: 50,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#F0C5A0',
    alignItems: 'center',
    borderRightColor: '#D59E76',
    borderRightWidth: 4,
  },
  hairLine: {
    width: 30,
    height: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#EFE8DD',
  },
  browRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 5,
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
    bottom: -14,
    width: 40,
    height: 27,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#F4EFE6',
    borderRightColor: '#D8CFC0',
    borderRightWidth: 3,
  },
  ropeLeft: {
    position: 'absolute',
    top: 79,
    left: 38,
    width: 3,
    height: 28,
    backgroundColor: '#D9B36F',
    transform: [{ rotate: '9deg' }],
  },
  ropeRight: {
    position: 'absolute',
    top: 79,
    right: 38,
    width: 3,
    height: 28,
    backgroundColor: '#D9B36F',
    transform: [{ rotate: '-9deg' }],
  },
  body: {
    width: 80,
    height: 48,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    backgroundColor: '#7A4F2F',
    borderRightColor: '#54331D',
    borderRightWidth: 6,
    borderBottomColor: '#54331D',
    borderBottomWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sleeveLeft: {
    position: 'absolute',
    left: -7,
    top: 11,
    width: 20,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#6F4729',
    transform: [{ rotate: '14deg' }],
  },
  sleeveRight: {
    position: 'absolute',
    right: -7,
    top: 11,
    width: 20,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#54331D',
    transform: [{ rotate: '-14deg' }],
  },
  ropeBelt: {
    position: 'absolute',
    top: 18,
    width: 58,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#D9B36F',
  },
  bookWrap: {
    marginTop: 16,
    width: 28,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#2F5D50',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightColor: '#1F4037',
    borderRightWidth: 3,
  },
  book: {
    color: '#FFE7A8',
    fontSize: 12,
    fontWeight: '900',
  },
});
