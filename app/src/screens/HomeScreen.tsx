import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomeHero } from '../components/HomeHero';
import { PrimaryButton } from '../components/PrimaryButton';
import type { Lesson, LessonTheme } from '../engine/exerciseBuilder';

type Props = {
  lesson: Lesson;
  completedCourses: Record<string, number>;
  onStart: (themeIndex?: number) => void;
  onReviewOnboarding: () => void;
};

export function HomeScreen({ lesson, completedCourses, onStart, onReviewOnboarding }: Props) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HomeHero title="Vandaag leren" translation={lesson.translation} reference="Kies je cursus" />

        <View style={styles.introCard}>
          <Text style={styles.kicker}>Cursusmenu</Text>
          <Text style={styles.title}>Wat wil je leren?</Text>
          <Text style={styles.description}>
            Kies een cursus met Bijbelteksten, thema's of Bijbelkennis. Elke cursus heeft korte niveaus en kan na afronding opnieuw geoefend worden.
          </Text>
        </View>

        <View style={styles.themeSection}>
          <Text style={styles.sectionTitle}>Cursussen</Text>
          {lesson.themes.map((theme, index) => {
            const completionCount = completedCourses[theme.id] ?? 0;
            const isCompleted = completionCount > 0;
            const labels = getCourseLabels(theme, lesson);

            return (
              <View key={theme.id} style={[styles.themeCard, theme.id === lesson.activeTheme.id ? styles.activeTheme : null]}>
                <View style={styles.themeHeader}>
                  <View style={[styles.themeNumber, isCompleted ? styles.completedNumber : null]}>
                    <Text style={styles.themeNumberText}>{isCompleted ? '✓' : index + 1}</Text>
                  </View>
                  <View style={styles.themeCopy}>
                    <View style={styles.titleRow}>
                      <Text style={styles.themeTitle}>{theme.title}</Text>
                      {isCompleted ? <Text style={styles.earnedPill}>Badge</Text> : null}
                    </View>
                    <Text style={styles.themeDescription}>{theme.description}</Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.levelPill}>{theme.levelCount} niveaus</Text>
                  <Text style={styles.badgePill}>{theme.badgeTitle}</Text>
                  {completionCount > 1 ? <Text style={styles.repeatPill}>{completionCount}x gedaan</Text> : null}
                </View>

                <View style={styles.referenceWrap}>
                  {labels.map((label) => (
                    <Text key={`${theme.id}-${label}`} style={styles.referencePill}>{label}</Text>
                  ))}
                </View>

                <PrimaryButton label={isCompleted ? 'Opnieuw oefenen' : 'Start cursus'} onPress={() => onStart(index)} />
              </View>
            );
          })}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Bronnen</Text>
          <Text style={styles.noteText}>{lesson.sourceNote}</Text>
          <Text style={styles.noteText}>{lesson.futureSourcesNote}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.reviewButton} onPress={onReviewOnboarding}>
          <Text style={styles.reviewText}>Uitleg opnieuw bekijken</Text>
        </Pressable>
      </View>
    </View>
  );
}

function getCourseLabels(theme: LessonTheme, lesson: Lesson): string[] {
  if (theme.bookNames) {
    return [...theme.bookNames.slice(0, 4), '...'];
  }

  return (theme.textIds ?? [])
    .map((id) => lesson.allTexts.find((item) => item.id === id)?.reference)
    .filter((label): label is string => Boolean(label));
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF8EC',
  },
  content: {
    gap: 18,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 96,
  },
  introCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6D8BF',
    borderRadius: 24,
    borderWidth: 1,
    gap: 10,
    padding: 18,
    shadowColor: '#6B4D20',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  kicker: {
    color: '#B25E2A',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: '#173F35',
    fontSize: 31,
    fontWeight: '900',
    lineHeight: 36,
  },
  description: {
    color: '#58675F',
    fontSize: 16,
    lineHeight: 23,
  },
  themeSection: {
    gap: 12,
  },
  sectionTitle: {
    color: '#173F35',
    fontSize: 19,
    fontWeight: '900',
  },
  themeCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6D8BF',
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 16,
    shadowColor: '#6B4D20',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  activeTheme: {
    borderColor: '#1E7D68',
    backgroundColor: '#F4FBF7',
  },
  themeHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  themeNumber: {
    alignItems: 'center',
    backgroundColor: '#7A5435',
    borderBottomColor: '#5B3B23',
    borderBottomWidth: 4,
    borderRadius: 18,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  completedNumber: {
    backgroundColor: '#1E7D68',
    borderBottomColor: '#146453',
  },
  themeNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  themeCopy: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeTitle: {
    color: '#173F35',
    flexShrink: 1,
    fontSize: 21,
    fontWeight: '900',
  },
  themeDescription: {
    color: '#5F6B64',
    fontSize: 15,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  levelPill: {
    backgroundColor: '#E8F5EF',
    borderRadius: 999,
    color: '#146453',
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  badgePill: {
    backgroundColor: '#F7EAD3',
    borderRadius: 999,
    color: '#7A5435',
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  earnedPill: {
    backgroundColor: '#F4C04F',
    borderRadius: 999,
    color: '#5C3B00',
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 9,
    paddingVertical: 5,
    textTransform: 'uppercase',
  },
  repeatPill: {
    backgroundColor: '#FCECDD',
    borderRadius: 999,
    color: '#A54F1E',
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  referenceWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  referencePill: {
    backgroundColor: '#F2E6CE',
    borderRadius: 999,
    color: '#744B27',
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  noteCard: {
    backgroundColor: '#F7EAD3',
    borderRadius: 18,
    gap: 7,
    padding: 15,
  },
  noteTitle: {
    color: '#6B4A20',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  noteText: {
    color: '#6B5D48',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    gap: 10,
  },
  reviewButton: {
    alignItems: 'center',
    backgroundColor: '#FFF8EC',
    borderRadius: 999,
    paddingVertical: 10,
  },
  reviewText: {
    color: '#1E7D68',
    fontSize: 15,
    fontWeight: '900',
  },
});
