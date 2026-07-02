import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';

import { AnswerOption } from '../components/AnswerOption';
import { FeedbackTone } from '../components/FeedbackBubble';
import { Mascot } from '../components/Mascot';
import { ProgressDots } from '../components/ProgressDots';
import { checkRecall, checkTypedWords, normalizeAnswer, RecallCheck } from '../engine/answerCheck';
import { ChoiceBlank, Exercise, Lesson } from '../engine/exerciseBuilder';

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
  'Goed! Minder hulp de volgende keer.',
  'Je bouwt hem laag voor laag op.',
];

const ALMOST_MESSAGES = [
  'Bijna. Een woord zat nog scheef.',
  'De kern had je. We oefenen hem nog een keer.',
  'Bijna - dit woord ontbrak nog.',
];

const MISS_MESSAGES = [
  'Geen probleem. We geven iets meer hulp.',
  'Rustig opnieuw. Eerst met meer steun.',
  'Dit is precies hoe onthouden groeit.',
];

export function LessonScreen({ lesson, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [typedAnswer, setTypedAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({ tone: 'idle', message: 'Lees rustig. De hulp valt straks stap voor stap weg.' });
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
      <ProgressDots current={index} total={lesson.exercises.length} />
      <View style={styles.levelRow}>
        <Text style={styles.level}>{exercise.level}</Text>
        <Text style={styles.reference}>{exercise.reference}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Mascot tone={feedback.tone} message={feedback.message} />
        <View style={styles.card}>
          <Text style={styles.title}>{exercise.title}</Text>
          <Text style={styles.instruction}>{exercise.instruction}</Text>
          {renderExerciseBody(exercise, selectedChoices, submitted, typedAnswer, setTypedAnswer, choose, feedback.check)}
        </View>
      </ScrollView>

      <Pressable
        disabled={!canCheck && !submitted && exercise.level !== 'N0' && exercise.level !== 'N6'}
        style={({ pressed }) => [
          styles.primaryButton,
          !canCheck && !submitted && exercise.level !== 'N0' && exercise.level !== 'N6' ? styles.disabledButton : null,
          pressed ? styles.pressedButton : null,
        ]}
        onPress={handlePrimaryAction}
      >
        <Text style={styles.primaryButtonText}>{buttonLabel(exercise, submitted, isLast)}</Text>
      </Pressable>
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
      <View style={styles.stack}>
        {exercise.context ? <Text style={styles.context}>{exercise.context}</Text> : null}
        <Text style={styles.fullText}>{exercise.text}</Text>
      </View>
    );
  }

  if (exercise.level === 'N1' || exercise.level === 'N2') {
    return (
      <View style={styles.stack}>
        <Text style={styles.promptText}>{exercise.promptText}</Text>
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
        <Text style={styles.promptText}>{exercise.promptText}</Text>
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
        <Text style={styles.initials}>{exercise.firstLetters}</Text>
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
        <Text style={styles.referenceOnly}>{exercise.reference}</Text>
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
        <View key={text.id} style={styles.chainItem}>
          <Text style={styles.chainReference}>{text.reference}</Text>
          <Text style={styles.chainText}>{text.text}</Text>
        </View>
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

  if (exercise.level === 'N4') {
    const check = checkRecall(exercise.text, typedAnswer, 1);
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
    return 'Eerst lezen we de tekst helemaal.';
  }
  if (exercise.level === 'N1') {
    return 'Een klein stukje hulp valt weg.';
  }
  if (exercise.level === 'N2') {
    return 'Nu vallen er meerdere woorden weg.';
  }
  if (exercise.level === 'N3') {
    return 'Je typt zelf. Hoofdletters zijn niet spannend.';
  }
  if (exercise.level === 'N4') {
    return 'Alleen de eerste letters blijven over.';
  }
  if (exercise.level === 'N5') {
    return 'Alle hulp is weg. Probeer rustig uit je hoofd.';
  }
  return 'Ketting komt later. Vandaag bereiden we alleen de volgorde voor.';
}

function pick(messages: string[], index: number): string {
  return messages[index % messages.length];
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF7EA',
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  level: {
    backgroundColor: '#19715F',
    color: '#FFFFFF',
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 13,
    fontWeight: '900',
  },
  reference: {
    color: '#6A5B43',
    fontSize: 15,
    fontWeight: '800',
  },
  content: {
    flexGrow: 1,
    gap: 14,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
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
  context: {
    color: '#7B5D33',
    fontSize: 15,
    fontWeight: '700',
  },
  fullText: {
    color: '#22362F',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 38,
  },
  promptText: {
    color: '#22362F',
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 36,
  },
  blankBlock: {
    gap: 10,
  },
  blankLabel: {
    color: '#6A5B43',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  optionsGrid: {
    gap: 10,
  },
  input: {
    minHeight: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8CBB3',
    backgroundColor: '#FFFDF8',
    color: '#22362F',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  largeInput: {
    minHeight: 118,
    textAlignVertical: 'top',
  },
  initials: {
    color: '#19715F',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 34,
  },
  referenceOnly: {
    color: '#173F35',
    fontSize: 22,
    fontWeight: '900',
  },
  recallDetails: {
    backgroundColor: '#F7F0E4',
    borderRadius: 12,
    gap: 8,
    padding: 12,
  },
  detailText: {
    color: '#6A4A25',
    fontSize: 15,
    fontWeight: '800',
  },
  correctText: {
    color: '#26342F',
    fontSize: 15,
    lineHeight: 22,
  },
  chainItem: {
    backgroundColor: '#F7F0E4',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  chainReference: {
    color: '#B06535',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  chainText: {
    color: '#22362F',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#19715F',
    borderRadius: 14,
    minHeight: 58,
    justifyContent: 'center',
    marginTop: 6,
  },
  disabledButton: {
    opacity: 0.45,
  },
  pressedButton: {
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
