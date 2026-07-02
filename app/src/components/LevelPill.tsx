import { StyleSheet, Text, View } from 'react-native';

const LEVEL_LABELS = {
  N0: 'Lezen',
  N1: '1 woord',
  N2: 'Meer gaten',
  N3: 'Typen',
  N4: 'Letters',
  N5: 'Recall',
  N6: 'Ketting',
};

type Props = {
  level: keyof typeof LEVEL_LABELS;
};

export function LevelPill({ level }: Props) {
  return (
    <View style={styles.pill}>
      <Text style={styles.level}>{level}</Text>
      <Text style={styles.label}>{LEVEL_LABELS[level]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#1E7D68',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  level: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  label: {
    color: '#DFF7EE',
    fontSize: 13,
    fontWeight: '800',
  },
});
