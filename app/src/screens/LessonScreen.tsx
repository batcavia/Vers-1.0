import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { Lesson } from '../lesson/assembler';

type Props = {
  lesson: Lesson;
  onDone: () => void;
};

export function LessonScreen({ lesson, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const step = lesson.steps[index];
  const isLast = index === lesson.steps.length - 1;

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.progress}>
          {index + 1} / {lesson.steps.length}
        </Text>
        <Text style={styles.kind}>{labelForKind(step.kind)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={step.kind === 'read' ? styles.verse : styles.body}>{step.body}</Text>
        {step.verse ? <Text style={styles.theme}>{step.verse.theme}</Text> : null}
      </ScrollView>

      <View style={styles.actions}>
        <Pressable
          disabled={index === 0}
          style={[styles.secondaryButton, index === 0 ? styles.disabledButton : null]}
          onPress={() => setIndex((current) => Math.max(0, current - 1))}
        >
          <Text style={styles.secondaryButtonText}>Terug</Text>
        </Pressable>
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            if (isLast) {
              onDone();
              return;
            }
            setIndex((current) => current + 1);
          }}
        >
          <Text style={styles.primaryButtonText}>{isLast ? 'Afronden' : 'Verder'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function labelForKind(kind: string): string {
  if (kind === 'read') {
    return 'Lees';
  }
  if (kind === 'recall') {
    return 'Onthoud';
  }
  return 'Reflecteer';
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progress: {
    color: '#53615A',
    fontSize: 16,
    fontWeight: '700',
  },
  kind: {
    backgroundColor: '#EADFCB',
    borderRadius: 6,
    color: '#173F35',
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 18,
    paddingVertical: 24,
  },
  title: {
    color: '#173F35',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  verse: {
    color: '#26342F',
    fontSize: 23,
    lineHeight: 34,
  },
  body: {
    color: '#46534D',
    fontSize: 21,
    lineHeight: 31,
  },
  theme: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#E4DAC8',
    borderRadius: 6,
    borderWidth: 1,
    color: '#A05A2C',
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 8,
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
  disabledButton: {
    opacity: 0.45,
  },
});
