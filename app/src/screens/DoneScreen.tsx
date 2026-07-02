import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Lesson } from '../lesson/assembler';

type Props = {
  completedCount: number;
  lesson: Lesson;
  onAgain: () => void;
  onHome: () => void;
};

export function DoneScreen({ completedCount, lesson, onAgain, onHome }: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.kicker}>Klaar</Text>
        <Text style={styles.title}>Je hebt de les afgerond.</Text>
        <Text style={styles.body}>
          Goed gedaan. Je oefende {lesson.verses.length} verzen zonder druk van een aftellende klok.
        </Text>
        <Text style={styles.count}>Voltooide lessen deze sessie: {completedCount}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.secondaryButton} onPress={onHome}>
          <Text style={styles.secondaryButtonText}>Home</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={onAgain}>
          <Text style={styles.primaryButtonText}>Nog eens</Text>
        </Pressable>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 14,
  },
  kicker: {
    color: '#A05A2C',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#173F35',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  body: {
    color: '#46534D',
    fontSize: 19,
    lineHeight: 29,
  },
  count: {
    color: '#173F35',
    fontSize: 16,
    fontWeight: '800',
    paddingTop: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#173F35',
    borderRadius: 8,
    flex: 1,
    minHeight: 54,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CFC3B1',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 54,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#173F35',
    fontSize: 17,
    fontWeight: '800',
  },
});
