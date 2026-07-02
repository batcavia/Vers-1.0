import type { BibleBundle, BibleText } from '../data/bibleBundles';
import { firstLettersForText, normalizeAnswer } from './answerCheck';

export type ExerciseLevel = 'N0' | 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'N6';

export type ChoiceBlank = {
  id: string;
  answer: string;
  options: string[];
};

export type Exercise = {
  id: string;
  level: ExerciseLevel;
  title: string;
  instruction: string;
  reference: string;
  context?: string;
  theme?: string;
  text: string;
  promptText?: string;
  blanks?: ChoiceBlank[];
  hiddenWords?: string[];
  firstLetters?: string;
  chainTexts?: BibleText[];
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  translation: string;
  sourceNote: string;
  futureSourcesNote: string;
  texts: BibleText[];
  focusText: BibleText;
  exercises: Exercise[];
};

export function buildLesson(bundle: BibleBundle, lessonIndex = 0): Lesson {
  const focusText = bundle.texts[lessonIndex % bundle.texts.length];
  const chainTexts = [
    focusText,
    bundle.texts[(lessonIndex + 1) % bundle.texts.length],
    bundle.texts[(lessonIndex + 2) % bundle.texts.length],
  ];
  const exercises: Exercise[] = [
    buildReadExercise(focusText),
    buildSingleChoiceExercise(focusText),
    buildMultiChoiceExercise(focusText),
    buildTypedBlankExercise(focusText),
    buildInitialsExercise(focusText),
    buildFreeRecallExercise(focusText),
    buildChainPreviewExercise(chainTexts),
  ];

  return {
    id: `${bundle.id}-${focusText.id}`,
    title: bundle.name,
    description: bundle.description,
    translation: bundle.translation,
    sourceNote: bundle.sourceNote,
    futureSourcesNote: bundle.futureSourcesNote,
    texts: bundle.texts,
    focusText,
    exercises,
  };
}

function buildReadExercise(text: BibleText): Exercise {
  return {
    id: `${text.id}-read`,
    level: 'N0',
    title: 'Lees de hele tekst',
    instruction: 'Neem eerst de volledige tekst op. Straks verdwijnt de hulp stap voor stap.',
    reference: text.reference,
    context: text.context,
    theme: text.theme,
    text: text.text,
  };
}

function buildSingleChoiceExercise(text: BibleText): Exercise {
  const answer = pickImportantWords(text, 1)[0];
  return {
    id: `${text.id}-choice-one`,
    level: 'N1',
    title: 'Eén woord verdwijnt',
    instruction: 'Kies het ontbrekende sleutelwoord.',
    reference: text.reference,
    theme: text.theme,
    text: text.text,
    promptText: maskWords(text.text, [answer]),
    blanks: [
      {
        id: `${text.id}-blank-1`,
        answer,
        options: buildOptions(answer, text),
      },
    ],
  };
}

function buildMultiChoiceExercise(text: BibleText): Exercise {
  const answers = pickImportantWords(text, 4);
  return {
    id: `${text.id}-choice-many`,
    level: 'N2',
    title: 'Meer woorden vallen weg',
    instruction: 'Vul elk gat. Je ziet hoe de tekst verder uit beeld verdwijnt.',
    reference: text.reference,
    theme: text.theme,
    text: text.text,
    promptText: maskWords(text.text, answers),
    blanks: answers.map((answer, index) => ({
      id: `${text.id}-blank-${index + 1}`,
      answer,
      options: buildOptions(answer, text),
    })),
  };
}

function buildTypedBlankExercise(text: BibleText): Exercise {
  const hiddenWords = pickImportantWords(text, 3);
  return {
    id: `${text.id}-typed-blanks`,
    level: 'N3',
    title: 'Typ wat ontbreekt',
    instruction: 'Nu kies je niet meer. Typ de ontbrekende woorden zelf.',
    reference: text.reference,
    theme: text.theme,
    text: text.text,
    promptText: maskWords(text.text, hiddenWords),
    hiddenWords,
  };
}

function buildInitialsExercise(text: BibleText): Exercise {
  return {
    id: `${text.id}-initials`,
    level: 'N4',
    title: 'Alleen eerste letters',
    instruction: 'De tekst is bijna weg. Gebruik alleen de eerste letters als steun.',
    reference: text.reference,
    theme: text.theme,
    text: text.text,
    firstLetters: firstLettersForText(text.text),
  };
}

function buildFreeRecallExercise(text: BibleText): Exercise {
  return {
    id: `${text.id}-free-recall`,
    level: 'N5',
    title: 'Vrije recall',
    instruction: 'Alle hulp is weg. Typ de tekst rustig uit je hoofd.',
    reference: text.reference,
    theme: text.theme,
    text: text.text,
  };
}

function buildChainPreviewExercise(texts: BibleText[]): Exercise {
  return {
    id: 'chain-preview',
    level: 'N6',
    title: 'Ketting voorbereiden',
    instruction: 'Later oefen je meerdere teksten achter elkaar. Vandaag zie je alvast de volgorde.',
    reference: texts.map((text) => text.reference).join(' + '),
    text: texts.map((text) => text.text).join(' '),
    chainTexts: texts,
  };
}

function pickImportantWords(text: BibleText, count: number): string[] {
  const fallbackWords = text.text
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Za-z0-9À-ž]/g, ''))
    .filter((word) => word.length > 3);
  return [...text.importantWords, ...fallbackWords].slice(0, count);
}

function maskWords(text: string, hiddenWords: string[]): string {
  const normalizedHidden = hiddenWords.map(normalizeAnswer);
  return text
    .split(/(\s+)/)
    .map((part) => {
      const normalized = normalizeAnswer(part);
      if (normalized.length > 0 && normalizedHidden.includes(normalized)) {
        return '____';
      }
      return part;
    })
    .join('');
}

function buildOptions(answer: string, text: BibleText): string[] {
  const distractors = text.importantWords
    .filter((word) => normalizeAnswer(word) !== normalizeAnswer(answer))
    .concat(['genade', 'vrede', 'hoop', 'woord', 'licht', 'geloof']);
  const unique = [answer, ...distractors].filter(
    (word, index, words) => words.findIndex((item) => normalizeAnswer(item) === normalizeAnswer(word)) === index,
  );
  return rotate(unique.slice(0, 4), answer.length % 4);
}

function rotate<T>(items: T[], offset: number): T[] {
  return items.map((_, index) => items[(index + offset) % items.length]);
}
