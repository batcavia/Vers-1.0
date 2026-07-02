import { StyleSheet, Text, View } from 'react-native';

type Props = {
  reference: string;
  text: string;
  context?: string;
  theme?: string;
  variant?: 'full' | 'prompt' | 'ghost';
};

export function BibleTextCard({ reference, text, context, theme, variant = 'full' }: Props) {
  return (
    <View style={[styles.card, variant === 'ghost' ? styles.ghost : null]}>
      <View style={styles.topRow}>
        <Text style={styles.reference}>{reference}</Text>
        {theme ? <Text style={styles.theme}>{theme}</Text> : null}
      </View>
      {context ? <Text style={styles.context}>{context}</Text> : null}
      <Text style={[styles.text, variant === 'prompt' ? styles.promptText : null]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFDF8',
    borderColor: '#E8D7B7',
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    padding: 18,
  },
  ghost: {
    backgroundColor: '#F8EFD9',
    borderStyle: 'dashed',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  reference: {
    color: '#8A542B',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  theme: {
    backgroundColor: '#E6F4EC',
    borderRadius: 999,
    color: '#1E7D68',
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  context: {
    color: '#6D624F',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  text: {
    color: '#203A33',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 35,
  },
  promptText: {
    fontSize: 25,
    lineHeight: 37,
  },
});
