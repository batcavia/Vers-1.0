import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useMemo, useState } from 'react';

import { DoneScreen } from './src/screens/DoneScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { assembleLesson } from './src/lesson/assembler';

type Route = 'home' | 'lesson' | 'done';

export default function App() {
  const [route, setRoute] = useState<Route>('home');
  const [completedCount, setCompletedCount] = useState(0);
  const lesson = useMemo(() => assembleLesson(), []);

  return (
    <SafeAreaView style={styles.shell}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F3EA" />
      {route === 'home' ? (
        <HomeScreen lesson={lesson} onStart={() => setRoute('lesson')} />
      ) : null}
      {route === 'lesson' ? (
        <LessonScreen
          lesson={lesson}
          onDone={() => {
            setCompletedCount((count) => count + 1);
            setRoute('done');
          }}
        />
      ) : null}
      {route === 'done' ? (
        <DoneScreen
          completedCount={completedCount}
          lesson={lesson}
          onAgain={() => setRoute('lesson')}
          onHome={() => setRoute('home')}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: '#F7F3EA',
  },
});
