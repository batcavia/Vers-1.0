import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';

import { AnswerOption } from '../components/AnswerOption';
import { BibleTextCard } from '../components/BibleTextCard';
import { CelebrationBurst } from '../components/CelebrationBurst';
import type { FeedbackTone } from '../components/FeedbackBubble';
import { LevelPill } from '../components/LevelPill';
import { Mascot } from '../components/Mascot';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressDots } from '../components/ProgressDots';
import { checkRecall, checkTypedWords, normalizeAnswer } from '../engine/answerCheck';
import type { RecallCheck } from '../engine/answerCheck';
import type { ChoiceBlank, Exercise, Lesson } from '../engine/exerciseBuilder';

type Props = {
  lesson: Lesson;
  onDone: () => void;
};

type FeedbackState = {
  tone: FeedbackTone;
  message: string;
  check?: RecallCheck;
};

const CORRECT_MESSAGES = [
  'Mooi onthouden.',
  'Dat zat stevig.',
  'Goed. De volgende stap krijgt minder hulp.',
  'Je haalt hem al beter op uit je geheugen.',
];

const ALMOST_MESSAGES = [
  'Bijna. Een woord zat nog niet goed.',
  'De kern had je. We oefenen hem nog een keer.',
  'Let op de volgorde van deze woorden.',
];

const MISS_MESSAGES = [
  'Geen probleem. We geven iets meer hulp.',
  'Rustig opnieuw. Eerst met meer steun.',
  'Dit hoort bij leren. Je bouwt de tekst laag voor laag op.',
];

export function LessonScreen({ lesson, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [typedAnswer, setTypedAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [celebrationKey, setCelebrationKey] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>({ tone: 'idle', message: 'Eerst stevig kijken. Daarna halen we steeds meer hulp weg.' });
  const exercise = lesson.exercises[index];
  const isLast = index === lesson.exercises.length - 1;

  useEffect(() => {
    setSelectedChoices({});
    setTypedAnswer('');
    setSubmitted(false);
    setFeedback({ tone: 'idle', message: introForExercise(exercise) });
  }, [exercise]);

  function choose(blank: ChoiceBlank, option: string) {
    if (submitted) {
      return;
    }
    setSelectedChoices((current) => ({ ...current, [blank.id]: option }));
  }

  function handlePrimaryAction() {
    if (exercise.level === 'N0' || exercise.level === 'N6') {
      goNext();
      return;
    }

    if (submitted) {
      goNext();
      return;
    }

    const nextFeedback = checkExercise(exercise, selectedChoices, typedAnswer, index);
    if (nextFeedback.tone === 'correct') {
      setCelebrationKey((key) => key + 1);
    }
    setFeedback(nextFeedback);
    setSubmitted(true);
  }

  function goNext() {
    if (isLast) {
      onDone();
      return;
    }
    setIndex((current) => current + 1);
  }

  const canCheck = canSubmit(exercise, selectedChoices, typedAnswer);

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
          {renderExerciseBody(exercise, selectedChoices, submitted, typedAnswer, setTypedAnswer, choose, feedback.check)}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          disabled={!canCheck && !submitted && exercise.level !== 'N0' && exercise.level !== 'N6'}
          label={buttonLabel(exercise, submitted, isLast)}
          onPress={handlePrimaryAction}
        />
      </View>
    </View>
  );
}

function renderExerciseBody(
  exercise: Exercise,
  selectedChoices: Record<string, string>,
  submitted: boolean,
  typedAnswer: string,
  setTypedAnswer: (value: string) => void,
  choose: (blank: ChoiceBlank, option: string) => void,
  check?: RecallCheck,
) {
  if (exercise.level === 'N0') {
    return (
      <BibleTextCard
        reference={exercise.reference}
        text={exercise.text}
        context={exercise.context}
        theme={exercise.theme}
      />
    );
  }

  if (exercise.level === 'N1' || exercise.level === 'N2') {
    return (
      <View style={styles.stack}>
        <BibleTextCard reference={exercise.reference} text={exercise.promptText ?? ''} theme={exercise.theme} variant="prompt" />
        {exercise.blanks?.map((blank, blankIndex) => (
          <View key={blank.id} style={styles.blankBlock}>
            <Text style={styles.blankLabel}>Gat {blankIndex + 1}</Text>
            <View style={styles.optionsGrid}>
              {blank.options.map((option) => {
                const selected = selectedChoices[blank.id] === option;
                const isAnswer = normalizeAnswer(option) === normalizeAnswer(blank.answer);
                const correctness = submitted && (selected || isAnswer) ? isAnswer : undefined;
                return (
                  <AnswerOption
                    key={option}
                    label={option}
                    selected={selected}
                    correct={correctness}
                    disabled={submitted}
                    onPress={() => choose(blank, option)}
                  />
                );
              })}
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (exercise.level === 'N3') {
    return (
      <View style={styles.stack}>
        <BibleTextCard reference={exercise.reference} text={exercise.promptText ?? ''} theme={exercise.theme} variant="prompt" />
        <TextInput
          value={typedAnswer}
          editable={!submitted}
          style={styles.input}
          placeholder="Typ de ontbrekende woorden"
          placeholderTextColor="#9B8D77"
          autoCapitalize="none"
          onChangeText={setTypedAnswer}
        />
        {check ? <RecallDetails check={check} expected={exercise.hiddenWords?.join(' ') ?? ''} /> : null}
      </View>
    );
  }

  if (exercise.level === 'N4') {
    return (
      <View style={styles.stack}>
        <BibleTextCard reference={exercise.reference} text={exercise.firstLetters ?? ''} theme={exercise.theme} variant="ghost" />
        <TextInput
          value={typedAnswer}
          editable={!submitted}
          style={[styles.input, styles.largeInput]}
          placeholder="Typ de volledige tekst"
          placeholderTextColor="#9B8D77"
          multiline
          autoCapitalize="none"
          onChangeText={setTypedAnswer}
        />
        {check ? <RecallDetails check={check} expected={exercise.text} /> : null}
      </View>
    );
  }

  if (exercise.level === 'N5') {
    return (
      <View style={styles.stack}>
        <View style={styles.recallPrompt}>
          <Text style={styles.recallReference}>{exercise.reference}</Text>
          <Text style={styles.recallHint}>Geen tekst meer zichtbaar.</Text>
        </View>
        <TextInput
          value={typedAnswer}
          editable={!submitted}
          style={[styles.input, styles.largeInput]}
          placeholder="Typ de tekst uit je hoofd"
          placeholderTextColor="#9B8D77"
          multiline
          autoCapitalize="none"
          onChangeText={setTypedAnswer}
        />
        {check ? <RecallDetails check={check} expected={exercise.text} /> : null}
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

function RecallDetails({ check, expected }: { check: RecallCheck; expected: string }) {
  return (
    <View style={styles.recallDetails}>
      {check.missingWords.length > 0 ? (
        <Text style={styles.detailText}>Nog oefenen: {check.missingWords.join(', ')}</Text>
      ) : (
        <Text style={styles.detailText}>Alles zat erin.</Text>
      )}
      <Text style={styles.correctText}>Correcte tekst: {expected}</Text>
    </View>
  );
}

function checkExercise(
  exercise: Exercise,
  selectedChoices: Record<string, string>,
  typedAnswer: string,
  index: number,
): FeedbackState {
  if (exercise.level === 'N1' || exercise.level === 'N2') {
    const blanks = exercise.blanks ?? [];
    const missing = blanks.filter((blank) => normalizeAnswer(selectedChoices[blank.id] ?? '') !== normalizeAnswer(blank.answer));
    if (missing.length === 0) {
      return { tone: 'correct', message: pick(CORRECT_MESSAGES, index) };
    }
    return {
      tone: missing.length === 1 ? 'almost' : 'miss',
      message: missing.length === 1 ? pick(ALMOST_MESSAGES, index) : pick(MISS_MESSAGES, index),
    };
  }

  if (exercise.level === 'N3') {
    const check = checkTypedWords(exercise.hiddenWords ?? [], typedAnswer);
    return feedbackFromCheck(check, index);
  }

  const check = checkRecall(exercise.text, typedAnswer, 1);
  return feedbackFromCheck(check, index);
}

function feedbackFromCheck(check: RecallCheck, index: number): FeedbackState {
  if (check.closeness === 'correct') {
    return { tone: 'correct', message: pick(CORRECT_MESSAGES, index), check };
  }
  if (check.closeness === 'almost') {
    return { tone: 'almost', message: pick(ALMOST_MESSAGES, index), check };
  }
  return { tone: 'miss', message: pick(MISS_MESSAGES, index), check };
}

function canSubmit(exercise: Exercise, selectedChoices: Record<string, string>, typedAnswer: string): boolean {
  if (exercise.level === 'N1' || exercise.level === 'N2') {
    return (exercise.blanks ?? []).every((blank) => Boolean(selectedChoices[blank.id]));
  }
  if (exercise.level === 'N3' || exercise.level === 'N4' || exercise.level === 'N5') {
    return typedAnswer.trim().length > 0;
  }
  return true;
}

function buttonLabel(exercise: Exercise, submitted: boolean, isLast: boolean): string {
  if (exercise.level === 'N0') {
    return 'Ik heb hem gelezen';
  }
  if (exercise.level === 'N6') {
    return isLast ? 'Afronden' : 'Verder';
  }
  if (submitted) {
    return isLast ? 'Afronden' : 'Verder';
  }
  return 'Controleer';
}

function introForExercise(exercise: Exercise): string {
  if (exercise.level === 'N0') {
    return 'Lees eerst alsof je de tekst onderstreept.';
  }
  if (exercise.level === 'N1') {
    return 'Een eerste woord verdwijnt. Je geheugen neemt het over.';
  }
  if (exercise.level === 'N2') {
    return 'Meer hulp valt weg, maar je krijgt nog keuzes.';
  }
  if (exercise.level === 'N3') {
    return 'Nu typ je zelf. Hoofdletters en leestekens zijn niet spannend.';
  }
  if (exercise.level === 'N4') {
    return 'Alleen de beginletters blijven staan.';
  }
  if (exercise.level === 'N5') {
    return 'Nu haal je de tekst helemaal zelf op.';
  }
  return 'Ketting komt later. Vandaag kijken we alleen vooruit.';
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
  blankBlock: {
    gap: 10,
  },
  blankLabel: {
    color: '#8A542B',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  optionsGrid: {
    gap: 10,
  },
  input: {
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: '#E0CFB0',
    borderBottomColor: '#CDB993',
    backgroundColor: '#FFFDF8',
    color: '#203A33',
    fontSize: 18,
    fontWeight: '800',
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  largeInput: {
    minHeight: 128,
    textAlignVertical: 'top',
  },
  recallPrompt: {
    alignItems: 'center',
    backgroundColor: '#F4E9D5',
    borderRadius: 20,
    gap: 6,
    padding: 22,
  },
  recallReference: {
    color: '#173F35',
    fontSize: 24,
    fontWeight: '900',
  },
  recallHint: {
    color: '#7A6B55',
    fontSize: 15,
    fontWeight: '800',
  },
  recallDetails: {
    backgroundColor: '#F7EAD3',
    borderRadius: 16,
    gap: 8,
    padding: 14,
  },
  detailText: {
    color: '#7A4D21',
    fontSize: 15,
    fontWeight: '900',
  },
  correctText: {
    color: '#26342F',
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 22,
  },
});
