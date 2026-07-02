import { Animated, StyleSheet, View } from 'react-native';
import { useEffect, useRef } from 'react';

import { FeedbackBubble, FeedbackTone } from './FeedbackBubble';

type Props = {
  tone: FeedbackTone;
  message: string;
};

export function Mascot({ tone, message }: Props) {
  const bounce = useRef(new Animated.Value(1)).current;
  const glow = tone === 'correct' ? '#F8C84B' : tone === 'almost' ? '#F1A85A' : tone === 'miss' ? '#DFA18D' : '#F4D98B';

  useEffect(() => {
    if (tone === 'idle') {
      return;
    }

    Animated.sequence([
      Animated.spring(bounce, { toValue: 1.08, useNativeDriver: true }),
      Animated.spring(bounce, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [bounce, tone]);

  return (
    <View style={styles.row}>
      <Animated.View style={[styles.mascot, { transform: [{ scale: bounce }] }]}>
        <View style={[styles.glow, { backgroundColor: glow }]} />
        <View style={styles.bulb} />
        <View style={styles.faceRow}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>
        <View style={styles.base} />
      </Animated.View>
      <FeedbackBubble tone={tone} message={message} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 86,
  },
  mascot: {
    width: 66,
    height: 74,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  glow: {
    position: 'absolute',
    top: 4,
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.28,
  },
  bulb: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFE7A8',
    borderColor: '#D7A935',
    borderWidth: 2,
  },
  faceRow: {
    position: 'absolute',
    top: 26,
    flexDirection: 'row',
    gap: 10,
  },
  eye: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#5B4421',
  },
  base: {
    width: 30,
    height: 18,
    borderRadius: 6,
    backgroundColor: '#19715F',
    marginTop: -2,
  },
});
