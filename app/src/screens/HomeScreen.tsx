import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Lesson } from '../lesson/assembler';

type Props = {
  lesson: Lesson;
  onStart: () => void;
};

export function HomeScreen({ lesson, onStart }: Props) {
  const minutes = Math.round(lesson.estimatedSeconds / 60);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.brand}>Vers</Text>
        <Text style={styles.subtitle}>Korte Bijbellessen in je eigen tempo</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.kicker}>Vandaag</Text>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.body}>
          {lesson.verses.length} verzen uit de Statenvertaling. Gemiddeld ongeveer {minutes} minuten,
          zonder harde timer.
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>Doel: {lesson.targetSeconds}s</Text>
          <Text style={styles.meta}>Band: {lesson.softMinSeconds}-{lesson.softMaxSeconds}s</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    gap: 8,
  },
  brand: {
    color: '#173F35',
    fontSize: 48,
    fontWeight: '800',
  },
  subtitle: {
    color: '#53615A',
    fontSize: 18,
    lineHeight: 26,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4DAC8',
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 20,
  },
  kicker: {
    color: '#A05A2C',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#173F35',
    fontSize: 28,
    fontWeight: '800',
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
    backgroundColor: '#EEF2ED',
    borderRadius: 6,
    color: '#173F35',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#173F35',
    borderRadius: 8,
    minHeight: 54,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});
