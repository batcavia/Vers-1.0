import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomeHero } from '../components/HomeHero';
import { LessonCard } from '../components/LessonCard';
import { PrimaryButton } from '../components/PrimaryButton';
import type { Lesson } from '../engine/exerciseBuilder';

type Props = {
  lesson: Lesson;
  onStart: () => void;
  onReviewOnboarding: () => void;
};

export function HomeScreen({ lesson, onStart, onReviewOnboarding }: Props) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HomeHero title={lesson.title} translation={lesson.translation} reference={lesson.focusText.reference} />

        <View style={styles.todayCard}>
          <Text style={styles.kicker}>Vandaag leren</Text>
          <Text style={styles.title}>{lesson.focusText.reference}</Text>
          <Text style={styles.description}>{lesson.focusText.context}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{lesson.translation}</Text>
            <Text style={styles.meta}>{lesson.exercises.length} stappen</Text>
          </View>
        </View>

        <View style={styles.pathSection}>
          <Text style={styles.sectionTitle}>Lespad</Text>
          {lesson.texts.slice(0, 5).map((text, index) => (
            <LessonCard
              key={text.id}
              step={index + 1}
              reference={text.reference}
              theme={text.theme}
              active={text.id === lesson.focusText.id}
            />
          ))}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Bronnen</Text>
          <Text style={styles.noteText}>{lesson.sourceNote}</Text>
          <Text style={styles.noteText}>{lesson.futureSourcesNote}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Start les" onPress={onStart} />
        <Pressable style={styles.reviewButton} onPress={onReviewOnboarding}>
          <Text style={styles.reviewText}>Uitleg opnieuw bekijken</Text>
        </Pressable>
      </View>
    </View>
  );
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
    paddingBottom: 138,
  },
  todayCard: {
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
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 34,
  },
  description: {
    color: '#58675F',
    fontSize: 16,
    lineHeight: 23,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  meta: {
    backgroundColor: '#EEF7F1',
    borderRadius: 999,
    color: '#1E7D68',
    fontSize: 13,
    fontWeight: '900',
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  pathSection: {
    gap: 10,
  },
  sectionTitle: {
    color: '#173F35',
    fontSize: 19,
    fontWeight: '900',
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
    paddingVertical: 4,
  },
  reviewText: {
    color: '#1E7D68',
    fontSize: 15,
    fontWeight: '900',
  },
});
