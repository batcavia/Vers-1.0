import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import { AnswerOption } from '../components/AnswerOption';
import { BibleTextCard } from '../components/BibleTextCard';
import { CelebrationBurst } from '../components/CelebrationBurst';
import type { FeedbackTone } from '../components/FeedbackBubble';
import { LevelPill } from '../components/LevelPill';
import { Mascot } from '../components/Mascot';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressDots } from '../components/ProgressDots';
import { normalizeAnswer } from '../engine/answerCheck';
import type { ChoiceBlank, Exercise, Lesson } from '../engine/exerciseBuilder';

type Props = {
  lesson: Lesson;
  onDone: () => void;
};

type FeedbackState = {
  tone: FeedbackTone;
  message: string;
};

const CORRECT_MESSAGES = [
  'Mooi onthouden.',
  'Dat zat stevig.',
  'Goed. De volgende plek krijgt minder hulp.',
  'Je haalt hem al beter op uit je geheugen.',
];

const ALMOST_MESSAGES = [
  'Bijna. Kijk nog even naar deze plek.',
  'De kern had je. Kies rustig opnieuw.',
  'Let op de volgorde van deze woorden.',
];

const MISS_MESSAGES = [
  'Geen probleem. We blijven bij deze plek.',
  'Rustig opnieuw. Eerst met meer steun.',
  'Dit hoort bij leren. Je bouwt de tekst laag voor laag op.',
];

export function LessonScreen({ lesson, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [activeBlankIndex, setActiveBlankIndex] = useState(0);
  const [checkedBlankIds, setCheckedBlankIds] = useState<Record<string, boolean>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [celebrationKey, setCelebrationKey] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>({ tone: 'idle', message: 'Kies een plek. We vinken ze een voor een af.' });
  const exercise = lesson.exercises[index];
  const isLast = index === lesson.exercises.length - 1;
  const activeBlank = exercise.blanks?.[activeBlankIndex];

  useEffect(() => {
    setActiveBlankIndex(0);
    setCheckedBlankIds({});
    setSelectedOption(null);
    setSubmitted(false);
    setFeedback({ tone: 'idle', message: introForExercise(exercise) });
  }, [exercise]);

  function choose(option: string) {
    if (submitted) {
      return;
    }
    setSelectedOption(option);
  }

  function handlePrimaryAction() {
    if (exercise.level === 'N0' || exercise.level === 'N4' || exercise.level === 'N6') {
      goNext();
      return;
    }

    if (!activeBlank) {
      goNext();
      return;
    }

    if (submitted) {
      advanceBlankOrExercise();
      return;
    }

    const isCorrect = normalizeAnswer(selectedOption ?? '') === normalizeAnswer(activeBlank.answer);
    if (isCorrect) {
      setCheckedBlankIds((current) => ({ ...current, [activeBlank.id]: true }));
      setCelebrationKey((key) => key + 1);
      setFeedback({ tone: 'correct', message: pick(CORRECT_MESSAGES, activeBlankIndex) });
    } else {
      setFeedback({ tone: selectedOption ? 'almost' : 'miss', message: selectedOption ? pick(ALMOST_MESSAGES, activeBlankIndex) : pick(MISS_MESSAGES, activeBlankIndex) });
    }
    setSubmitted(true);
  }

  function advanceBlankOrExercise() {
    const blanks = exercise.blanks ?? [];
    if (activeBlankIndex < blanks.length - 1) {
      setActiveBlankIndex((current) => current + 1);
      setSelectedOption(null);
      setSubmitted(false);
      setFeedback({ tone: 'idle', message: `Plek ${activeBlankIndex + 2} staat klaar.` });
      return;
    }
    goNext();
  }

  function goNext() {
    if (isLast) {
      onDone();
      return;
    }
    setIndex((current) => current + 1);
  }

  const canCheck = Boolean(selectedOption) || submitted || exercise.level === 'N0' || exercise.level === 'N4' || exercise.level === 'N6';

  return (
    <View style={styles.screen}>
      <CelebrationBurst active={celebrationKey > 0} key={celebrationKey} />
      <View style={styles.topPanel}>
        <ProgressDots current={index} total={lesson.exercises.length} />
        <View style={styles.levelRow}>
          <LevelPill level={exercise.level} />
          <Text style={styles.reference}>{exercise.reference}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Mascot tone={feedback.tone} message={feedback.message} />
        <View style={styles.card}>
          <Text style={styles.title}>{exercise.title}</Text>
          <Text style={styles.instruction}>{exercise.instruction}</Text>
          {renderExerciseBody(exercise, activeBlank, activeBlankIndex, checkedBlankIds, selectedOption, submitted, choose)}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton disabled={!canCheck} label={buttonLabel(exercise, submitted, isLast, activeBlankIndex)} onPress={handlePrimaryAction} />
      </View>
    </View>
  );
}

function renderExerciseBody(
  exercise: Exercise,
  activeBlank: ChoiceBlank | undefined,
  activeBlankIndex: number,
  checkedBlankIds: Record<string, boolean>,
  selectedOption: string | null,
  submitted: boolean,
  choose: (option: string) => void,
) {
  if (exercise.level === 'N0') {
    return (
      <View style={styles.stack}>
        {exercise.chainTexts?.map((text) => (
          <BibleTextCard key={text.id} reference={text.reference} text={text.text} context={text.context} theme={text.theme} />
        ))}
      </View>
    );
  }

  if (exercise.level === 'N1' || exercise.level === 'N2') {
    if (!activeBlank) {
      return null;
    }

    return (
      <View style={styles.stack}>
        <View style={styles.checkRow}>
          {(exercise.blanks ?? []).map((blank, index) => (
            <View
              key={blank.id}
              style={[
                styles.checkDot,
                checkedBlankIds[blank.id] ? styles.checkedDot : null,
                index === activeBlankIndex ? styles.activeDot : null,
              ]}
            >
              <Text style={[styles.checkDotText, checkedBlankIds[blank.id] ? styles.checkedDotText : null]}>
                {checkedBlankIds[blank.id] ? '✓' : index + 1}
              </Text>
            </View>
          ))}
        </View>
        <BibleTextCard reference={activeBlank.reference} text={activeBlank.promptText} theme={activeBlank.theme} variant="prompt" />
        <Text style={styles.placeLabel}>Plek {activeBlankIndex + 1} afvinken</Text>
        <View style={styles.optionsGrid}>
          {activeBlank.options.map((option) => {
            const selected = selectedOption === option;
            const isAnswer = normalizeAnswer(option) === normalizeAnswer(activeBlank.answer);
            const correctness = submitted && (selected || isAnswer) ? isAnswer : undefined;
            return (
              <AnswerOption
                key={option}
                label={option}
                selected={selected}
                correct={correctness}
                disabled={submitted}
                onPress={() => choose(option)}
              />
            );
          })}
        </View>
      </View>
    );
  }

  if (exercise.level === 'N4') {
    return (
      <View style={styles.stack}>
        <BibleTextCard reference={exercise.reference} text={exercise.firstLetters ?? ''} variant="ghost" />
        <Text style={styles.helperText}>Zeg de teksten hardop of in gedachten. Je hoeft niets over te typen.</Text>
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      {exercise.chainTexts?.map((text) => (
        <BibleTextCard key={text.id} reference={text.reference} text={text.text} theme={text.theme} variant="ghost" />
      ))}
    </View>
  );
}

function buttonLabel(exercise: Exercise, submitted: boolean, isLast: boolean, activeBlankIndex: number): string {
  if (exercise.level === 'N0') {
    return 'Ik heb ze gelezen';
  }
  if (exercise.level === 'N4') {
    return 'Verder';
  }
  if (exercise.level === 'N6') {
    return isLast ? 'Afronden' : 'Verder';
  }
  if (submitted) {
    return 'Volgende plek';
  }
  return `Controleer plek ${activeBlankIndex + 1}`;
}

function introForExercise(exercise: Exercise): string {
  if (exercise.level === 'N0') {
    return 'Eerst lezen we de teksten binnen dit thema.';
  }
  if (exercise.level === 'N1') {
    return 'We beginnen met plek 1 per tekst.';
  }
  if (exercise.level === 'N2') {
    return 'Nu vink je meer plekken af, een voor een.';
  }
  if (exercise.level === 'N4') {
    return 'Alleen eerste letters blijven over. Geen typen nodig.';
  }
  return 'Bekijk alvast hoe de teksten straks als ketting samenkomen.';
}

function pick(messages: string[], index: number): string {
  return messages[index % messages.length];
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF8EC',
  },
  topPanel: {
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  levelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reference: {
    color: '#6A5B43',
    fontSize: 15,
    fontWeight: '900',
  },
  content: {
    flexGrow: 1,
    gap: 14,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 110,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E7D7B9',
    padding: 18,
    gap: 14,
    shadowColor: '#6B4D20',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    color: '#173F35',
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 33,
  },
  instruction: {
    color: '#59645E',
    fontSize: 16,
    lineHeight: 23,
  },
  stack: {
    gap: 14,
  },
  checkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  checkDot: {
    alignItems: 'center',
    backgroundColor: '#F1E3CA',
    borderColor: '#D7C39C',
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  activeDot: {
    borderColor: '#1E7D68',
    borderWidth: 2,
  },
  checkedDot: {
    backgroundColor: '#1E7D68',
    borderColor: '#1E7D68',
  },
  checkDotText: {
    color: '#7A5A32',
    fontSize: 13,
    fontWeight: '900',
  },
  checkedDotText: {
    color: '#FFFFFF',
  },
  placeLabel: {
    color: '#8A542B',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  optionsGrid: {
    gap: 10,
  },
  helperText: {
    backgroundColor: '#F7EAD3',
    borderRadius: 16,
    color: '#6B5D48',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
    padding: 14,
  },
  footer: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 22,
  },
});
