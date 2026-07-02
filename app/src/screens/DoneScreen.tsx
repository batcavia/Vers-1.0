import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Mascot } from '../components/Mascot';
import { Lesson } from '../engine/exerciseBuilder';

type Props = {
  lesson: Lesson;
  onAnotherLesson: () => void;
  onHome: () => void;
};

export function DoneScreen({ lesson, onAnotherLesson, onHome }: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Mascot tone="correct" message="Je bouwde de tekst laag voor laag op." />
        <Text style={styles.kicker}>{lesson.title}</Text>
        <Text style={styles.title}>Les afgerond</Text>
        <Text style={styles.body}>
          Je begon met volledige hulp en eindigde met vrije recall. De demo-teksten kunnen later worden vervangen door import of gelicentieerde teksten.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.secondaryButton} onPress={onHome}>
          <Text style={styles.secondaryButtonText}>Home</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={onAnotherLesson}>
          <Text style={styles.primaryButtonText}>Nog een les</Text>
        </Pressable>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 14,
  },
  kicker: {
    color: '#B06535',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: '#173F35',
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 42,
  },
  body: {
    color: '#46534D',
    fontSize: 18,
    lineHeight: 28,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#19715F',
    borderRadius: 14,
    flex: 1,
    minHeight: 56,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D8CBB3',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    minHeight: 56,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#173F35',
    fontSize: 17,
    fontWeight: '900',
  },
});
