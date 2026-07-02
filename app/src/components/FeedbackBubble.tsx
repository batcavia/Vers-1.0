import { StyleSheet, Text, View } from 'react-native';

export type FeedbackTone = 'idle' | 'correct' | 'almost' | 'miss';

type Props = {
  tone: FeedbackTone;
  message: string;
};

export function FeedbackBubble({ tone, message }: Props) {
  if (!message) {
    return null;
  }

  return (
    <View style={[styles.bubble, styles[tone]]}>
      <View style={[styles.tail, styles[`${tone}Tail`]]} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    maxWidth: 280,
    shadowColor: '#5E4320',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  tail: {
    position: 'absolute',
    left: -6,
    top: 24,
    width: 12,
    height: 12,
    borderBottomLeftRadius: 3,
    transform: [{ rotate: '45deg' }],
  },
  idle: {
    backgroundColor: '#FFFDF8',
    borderColor: '#E2D3B7',
  },
  idleTail: {
    backgroundColor: '#FFFDF8',
    borderColor: '#E2D3B7',
  },
  correct: {
    backgroundColor: '#DFF7EA',
    borderColor: '#82C9A0',
  },
  correctTail: {
    backgroundColor: '#DFF7EA',
  },
  almost: {
    backgroundColor: '#FFF1D6',
    borderColor: '#E3B65D',
  },
  almostTail: {
    backgroundColor: '#FFF1D6',
  },
  miss: {
    backgroundColor: '#FCE9E1',
    borderColor: '#DA9A83',
  },
  missTail: {
    backgroundColor: '#FCE9E1',
  },
  text: {
    color: '#26342F',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
  },
});
