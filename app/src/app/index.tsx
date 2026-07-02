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

export default function IndexScreen() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [route, setRoute] = useState<Route>('onboarding');
  const [lessonIndex, setLessonIndex] = useState(0);
  const lesson = useMemo<Lesson>(() => buildLesson(ESSENTIALS_BUNDLE, lessonIndex), [lessonIndex]);

  function finishOnboarding() {
    if (hasSeenOnboarding) {
      setRoute('home');
      return;
    }

    setHasSeenOnboarding(true);
    setRoute('lesson');
  }

  function reviewOnboarding() {
    setRoute('onboarding');
  }

  function startLesson() {
    setRoute('lesson');
  }

  function startAnotherLesson() {
    setLessonIndex((index) => index + 1);
    setRoute('lesson');
  }

  return (
    <SafeAreaView style={styles.shell}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8EC" />
      {route === 'onboarding' ? <OnboardingScreen onFinish={finishOnboarding} /> : null}
      {route === 'home' ? (
        <HomeScreen lesson={lesson} onStart={startLesson} onReviewOnboarding={reviewOnboarding} />
      ) : null}
      {route === 'lesson' ? <LessonScreen lesson={lesson} onDone={() => setRoute('done')} /> : null}
      {route === 'done' ? (
        <DoneScreen lesson={lesson} onAnotherLesson={startAnotherLesson} onHome={() => setRoute('home')} />
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
