import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useMemo, useState } from 'react';

import { ESSENTIALS_BUNDLE } from '../data/bibleBundles';
import { buildLesson } from '../engine/exerciseBuilder';
import type { Lesson } from '../engine/exerciseBuilder';
import { DoneScreen } from '../screens/DoneScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LessonScreen } from '../screens/LessonScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';

type Route = 'onboarding' | 'home' | 'lesson' | 'done';
type CompletionMap = Record<string, number>;

export default function IndexScreen() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [route, setRoute] = useState<Route>('onboarding');
  const [themeIndex, setThemeIndex] = useState(0);
  const [completedCourses, setCompletedCourses] = useState<CompletionMap>({});
  const lesson = useMemo<Lesson>(() => buildLesson(ESSENTIALS_BUNDLE, themeIndex), [themeIndex]);
  const completionCount = completedCourses[lesson.activeTheme.id] ?? 0;

  function finishOnboarding() {
    setHasSeenOnboarding(true);
    setRoute('home');
  }

  function reviewOnboarding() {
    setRoute('onboarding');
  }

  function startLesson(nextThemeIndex?: number) {
    if (typeof nextThemeIndex === 'number') {
      setThemeIndex(nextThemeIndex);
    }
    setRoute('lesson');
  }

  function completeLesson() {
    setCompletedCourses((courses) => ({
      ...courses,
      [lesson.activeTheme.id]: (courses[lesson.activeTheme.id] ?? 0) + 1,
    }));
    setRoute('done');
  }

  function retryCourse() {
    setRoute('lesson');
  }

  return (
    <SafeAreaView style={styles.shell}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8EC" />
      {route === 'onboarding' ? <OnboardingScreen onFinish={finishOnboarding} /> : null}
      {route === 'home' ? (
        <HomeScreen
          lesson={lesson}
          completedCourses={completedCourses}
          onStart={startLesson}
          onReviewOnboarding={reviewOnboarding}
        />
      ) : null}
      {route === 'lesson' ? <LessonScreen lesson={lesson} onDone={completeLesson} /> : null}
      {route === 'done' ? (
        <DoneScreen
          lesson={lesson}
          completionCount={completionCount}
          onRetryCourse={retryCourse}
          onHome={() => setRoute('home')}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: '#FFF8EC',
  },
});
