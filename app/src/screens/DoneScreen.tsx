import { StyleSheet, Text, View } from 'react-native';

import { Mascot } from '../components/Mascot';
import { PrimaryButton } from '../components/PrimaryButton';
import type { Lesson } from '../engine/exerciseBuilder';

type Props = {
  lesson: Lesson;
  onAnotherLesson: () => void;
  onHome: () => void;
};

export function DoneScreen({ lesson, onAnotherLesson, onHome }: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Mascot tone="correct" message="Je hebt de tekst van lezen naar recall gebracht." />
          <Text style={styles.kicker}>{lesson.focusText.reference}</Text>
          <Text style={styles.title}>Les afgerond</Text>
          <Text style={styles.body}>
            Je oefende met steeds minder hulp. Herhalen maakt de tekst straks sneller beschikbaar in je geheugen.
          </Text>
          <View style={styles.sourceCard}>
            <Text style={styles.sourceTitle}>{lesson.translation}</Text>
            <Text style={styles.sourceText}>{lesson.futureSourcesNote}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Home" variant="secondary" onPress={onHome} />
        <PrimaryButton label="Nog een les" onPress={onAnotherLesson} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: '#FFF8EC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6D8BF',
    borderRadius: 28,
    borderWidth: 1,
    gap: 14,
    padding: 20,
    shadowColor: '#6B4D20',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  kicker: {
    color: '#B25E2A',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: '#173F35',
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 43,
  },
  body: {
    color: '#46534D',
    fontSize: 18,
    lineHeight: 28,
  },
  sourceCard: {
    backgroundColor: '#F7EAD3',
    borderRadius: 16,
    gap: 5,
    padding: 13,
  },
  sourceTitle: {
    color: '#6B4A20',
    fontSize: 14,
    fontWeight: '900',
  },
  sourceText: {
    color: '#6B5D48',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
});
