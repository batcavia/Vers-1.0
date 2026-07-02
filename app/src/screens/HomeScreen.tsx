import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Mascot } from '../components/Mascot';
import { Lesson } from '../engine/exerciseBuilder';

type Props = {
  lesson: Lesson;
  onStart: () => void;
};

export function HomeScreen({ lesson, onStart }: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.brand}>Vers</Text>
        <Text style={styles.subtitle}>Leer korte teksten laag voor laag, met steeds minder hulp.</Text>
      </View>

      <View style={styles.panel}>
        <Mascot tone="idle" message="Vandaag bouwen we de tekst rustig op." />
        <Text style={styles.kicker}>{lesson.title}</Text>
        <Text style={styles.title}>Progressieve memorisatie</Text>
        <Text style={styles.body}>{lesson.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{lesson.texts.length} demo-teksten</Text>
          <Text style={styles.meta}>{lesson.exercises.length} korte stappen</Text>
        </View>
      </View>

      <Pressable style={styles.primaryButton} onPress={onStart}>
        <Text style={styles.primaryButtonText}>Start les</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 30,
    backgroundColor: '#FFF7EA',
  },
  header: {
    gap: 8,
  },
  brand: {
    color: '#173F35',
    fontSize: 48,
    fontWeight: '900',
  },
  subtitle: {
    color: '#53615A',
    fontSize: 18,
    lineHeight: 26,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7D7B9',
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    padding: 18,
    shadowColor: '#6B4D20',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  kicker: {
    color: '#B06535',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#173F35',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  body: {
    color: '#46534D',
    fontSize: 16,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
  },
  meta: {
    backgroundColor: '#EEF5EE',
    borderRadius: 999,
    color: '#173F35',
    fontSize: 13,
    fontWeight: '800',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#19715F',
    borderRadius: 14,
    minHeight: 58,
    justifyContent: 'center',
    shadowColor: '#19715F',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
