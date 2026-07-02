import { StyleSheet, Text, View } from 'react-native';

import { Mascot } from '../components/Mascot';
import { PrimaryButton } from '../components/PrimaryButton';
import type { Lesson } from '../engine/exerciseBuilder';

type Props = {
  lesson: Lesson;
  completionCount: number;
  onRetryCourse: () => void;
  onHome: () => void;
};

export function DoneScreen({ lesson, completionCount, onRetryCourse, onHome }: Props) {
  const hasRepeated = completionCount > 1;

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Mascot tone="correct" message="Mooi afgerond. Je kunt deze cursus altijd opnieuw doen." />
          <Text style={styles.kicker}>{lesson.activeTheme.title}</Text>
          <Text style={styles.title}>Cursus afgerond</Text>
          <Text style={styles.body}>
            Je oefende {lesson.activeTheme.levelCount} niveaus met steeds minder hulp. De teksten blijven beschikbaar om rustig opnieuw te leren.
          </Text>

          <View style={styles.badgeCard}>
            <View style={styles.badgeSeal}>
              <Text style={styles.badgeIcon}>✦</Text>
            </View>
            <View style={styles.badgeCopy}>
              <Text style={styles.badgeKicker}>Badge verdiend</Text>
              <Text style={styles.badgeTitle}>{lesson.activeTheme.badgeTitle}</Text>
              <Text style={styles.badgeText}>
                {hasRepeated ? `Je hebt deze cursus ${completionCount} keer afgerond.` : 'Eerste afronding van deze cursus.'}
              </Text>
            </View>
          </View>

          <View style={styles.sourceCard}>
            <Text style={styles.sourceTitle}>{lesson.translation}</Text>
            <Text style={styles.sourceText}>{lesson.futureSourcesNote}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Terug naar cursussen" variant="secondary" onPress={onHome} />
        <PrimaryButton label="Cursus opnieuw doen" onPress={onRetryCourse} />
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
  badgeCard: {
    alignItems: 'center',
    backgroundColor: '#FFF4D7',
    borderColor: '#F0C66A',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
  },
  badgeSeal: {
    alignItems: 'center',
    backgroundColor: '#F4C04F',
    borderBottomColor: '#C98C26',
    borderBottomWidth: 5,
    borderRadius: 28,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  badgeIcon: {
    color: '#5C3B00',
    fontSize: 26,
    fontWeight: '900',
  },
  badgeCopy: {
    flex: 1,
    gap: 3,
  },
  badgeKicker: {
    color: '#9A5B16',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  badgeTitle: {
    color: '#173F35',
    fontSize: 22,
    fontWeight: '900',
  },
  badgeText: {
    color: '#6B5D48',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
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
