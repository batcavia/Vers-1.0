import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useMemo, useState } from 'react';

import { ESSENTIALS_BUNDLE } from '../data/bibleBundles';
import { buildLesson } from '../engine/exerciseBuilder';
import type { Lesson } from '../engine/exerciseBuilder';
import { DoneScreen } from '../screens/DoneScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LessonScreen } from '../screens/LessonScreen';

type Route = 'home' | 'lesson' | 'done';

export default function IndexScreen() {
  const [route, setRoute] = useState<Route>('home');
  const [lessonIndex, setLessonIndex] = useState(0);
  const lesson = useMemo<Lesson>(() => buildLesson(ESSENTIALS_BUNDLE, lessonIndex), [lessonIndex]);

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
      {route === 'home' ? <HomeScreen lesson={lesson} onStart={startLesson} /> : null}
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
