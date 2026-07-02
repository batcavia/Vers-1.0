import { StyleSheet, Text, View } from 'react-native';

type Props = {
  step: number;
  reference: string;
  theme: string;
  active?: boolean;
};

export function LessonCard({ step, reference, theme, active = false }: Props) {
  return (
    <View style={[styles.card, active ? styles.activeCard : null]}>
      <View style={[styles.node, active ? styles.activeNode : null]}>
        <Text style={styles.nodeText}>{step}</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.reference}>{reference}</Text>
        <Text style={styles.theme}>{theme}</Text>
      </View>
      {active ? <Text style={styles.activeLabel}>Vandaag</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E6D8BF',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  activeCard: {
    borderColor: '#1E7D68',
    backgroundColor: '#F2FBF6',
  },
  node: {
    alignItems: 'center',
    backgroundColor: '#E7DCC8',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  activeNode: {
    backgroundColor: '#1E7D68',
  },
  nodeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  reference: {
    color: '#203A33',
    fontSize: 16,
    fontWeight: '900',
  },
  theme: {
    color: '#6D624F',
    fontSize: 14,
    fontWeight: '700',
  },
  activeLabel: {
    color: '#1E7D68',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
