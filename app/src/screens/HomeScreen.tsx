import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomeHero } from '../components/HomeHero';
import { PrimaryButton } from '../components/PrimaryButton';
import type { Lesson } from '../engine/exerciseBuilder';

type Props = {
  lesson: Lesson;
  onStart: (themeIndex?: number) => void;
  onReviewOnboarding: () => void;
};

export function HomeScreen({ lesson, onStart, onReviewOnboarding }: Props) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HomeHero title="Kies je thema" translation={lesson.translation} reference={lesson.activeTheme.title} />

        <View style={styles.introCard}>
          <Text style={styles.kicker}>Vandaag leren</Text>
          <Text style={styles.title}>Welke teksten wil je oefenen?</Text>
          <Text style={styles.description}>
            Kies een thema. In de les oefen je meerdere Bijbelteksten tegelijk en vink je missende woorden plek voor plek af.
          </Text>
        </View>

        <View style={styles.themeSection}>
          <Text style={styles.sectionTitle}>Thema's</Text>
          {lesson.themes.map((theme, index) => (
            <View key={theme.id} style={[styles.themeCard, theme.id === lesson.activeTheme.id ? styles.activeTheme : null]}>
              <View style={styles.themeHeader}>
                <View style={styles.themeNumber}>
                  <Text style={styles.themeNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.themeCopy}>
                  <Text style={styles.themeTitle}>{theme.title}</Text>
                  <Text style={styles.themeDescription}>{theme.description}</Text>
                </View>
              </View>
              <View style={styles.referenceWrap}>
                {theme.textIds.map((id) => {
                  const text = lesson.allTexts.find((item) => item.id === id);
                  return text ? (
                    <Text key={id} style={styles.referencePill}>{text.reference}</Text>
                  ) : null;
                })}
              </View>
              <PrimaryButton label="Start dit thema" onPress={() => onStart(index)} />
            </View>
          ))}
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
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 34,
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
  themeNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  themeCopy: {
    flex: 1,
    gap: 4,
  },
  themeTitle: {
    color: '#173F35',
    fontSize: 21,
    fontWeight: '900',
  },
  themeDescription: {
    color: '#5F6B64',
    fontSize: 15,
    lineHeight: 21,
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
