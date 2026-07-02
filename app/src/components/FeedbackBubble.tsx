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
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    maxWidth: 280,
  },
  idle: {
    backgroundColor: '#FFFDF8',
    borderColor: '#E2D3B7',
  },
  correct: {
    backgroundColor: '#E3F4EA',
    borderColor: '#90C4A7',
  },
  almost: {
    backgroundColor: '#FFF1D8',
    borderColor: '#E0B86E',
  },
  miss: {
    backgroundColor: '#FBE8E1',
    borderColor: '#D59A86',
  },
  text: {
    color: '#26342F',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
});
