import type { BibleBundle, BibleText } from '../data/bibleBundles';
import { firstLettersForText, normalizeAnswer } from './answerCheck';

export type ExerciseLevel = 'N0' | 'N1' | 'N2' | 'N4' | 'N6';

export type ChoiceBlank = {
  id: string;
  answer: string;
  options: string[];
  reference: string;
  text: string;
  promptText: string;
  theme: string;
};

export type LessonTheme = {
  id: string;
  title: string;
  description: string;
  textIds: string[];
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
  allTexts: BibleText[];
  focusText: BibleText;
  themes: LessonTheme[];
  activeTheme: LessonTheme;
  exercises: Exercise[];
};

export const LESSON_THEMES: LessonTheme[] = [
  {
    id: 'vertrouwen-en-rust',
    title: 'Vertrouwen en rust',
    description: 'Teksten voor momenten waarop je steun, rust en richting zoekt.',
    textIds: ['psalm-23-1', 'matthew-11-28', 'isaiah-41-10', 'psalm-119-105'],
  },
  {
    id: 'gebed-en-vrede',
    title: 'Gebed en vrede',
    description: 'Teksten over zorgen loslaten, bidden en Gods vrede ontvangen.',
    textIds: ['philippians-4-6', 'philippians-4-7', 'romans-12-12'],
  },
  {
    id: 'geloof-en-hoop',
    title: 'Geloof en hoop',
    description: 'Kernteksten over liefde, geloof en hoopvolle volharding.',
    textIds: ['john-3-16', 'romans-8-28', 'hebrews-11-1'],
  },
];

export function buildLesson(bundle: BibleBundle, themeIndex = 0): Lesson {
  const activeTheme = LESSON_THEMES[themeIndex % LESSON_THEMES.length];
  const texts = activeTheme.textIds
    .map((id) => bundle.texts.find((text) => text.id === id))
    .filter((text): text is BibleText => Boolean(text));
  const focusText = texts[0] ?? bundle.texts[0];
  const exercises: Exercise[] = [
    buildReadSetExercise(activeTheme, texts),
    buildSingleCheckoffExercise(texts),
    buildMultiCheckoffExercise(texts),
    buildFirstLettersSetExercise(activeTheme, texts),
    buildChainPreviewExercise(texts),
  ];

  return {
    id: `${bundle.id}-${activeTheme.id}`,
    title: activeTheme.title,
    description: activeTheme.description,
    translation: bundle.translation,
    sourceNote: bundle.sourceNote,
    futureSourcesNote: bundle.futureSourcesNote,
    texts,
    allTexts: bundle.texts,
    focusText,
    themes: LESSON_THEMES,
    activeTheme,
    exercises,
  };
}

function buildReadSetExercise(theme: LessonTheme, texts: BibleText[]): Exercise {
  return {
    id: `${theme.id}-read-set`,
    level: 'N0',
    title: 'Lees de teksten',
    instruction: 'Kijk eerst rustig naar de teksten in dit thema. Daarna vallen woorden per plek weg.',
    reference: theme.title,
    context: theme.description,
    text: texts.map((text) => `${text.reference}: ${text.text}`).join('\n'),
    chainTexts: texts,
  };
}

function buildSingleCheckoffExercise(texts: BibleText[]): Exercise {
  const blanks = texts.map((text) => buildBlank(text, 0));
  return {
    id: 'checkoff-place-one',
    level: 'N1',
    title: 'Plek 1 afvinken',
    instruction: 'Elke tekst mist nu één sleutelwoord. Kies het woord en vink de plekken één voor één af.',
    reference: 'Plek 1',
    text: blanks.map((blank) => blank.text).join(' '),
    blanks,
  };
}

function buildMultiCheckoffExercise(texts: BibleText[]): Exercise {
  const blanks = texts.flatMap((text) => [buildBlank(text, 1), buildBlank(text, 2)]);
  return {
    id: 'checkoff-more-places',
    level: 'N2',
    title: 'Meer plekken afvinken',
    instruction: 'Nu vallen er meer woorden weg, verdeeld over meerdere teksten. Werk de plekken rustig af.',
    reference: 'Plek 2 en 3',
    text: blanks.map((blank) => blank.text).join(' '),
    blanks,
  };
}

function buildFirstLettersSetExercise(theme: LessonTheme, texts: BibleText[]): Exercise {
  return {
    id: `${theme.id}-initials`,
    level: 'N4',
    title: 'Eerste letters per tekst',
    instruction: 'Geen overtypen: gebruik de eerste letters om de tekst hardop of in gedachten op te halen.',
    reference: theme.title,
    text: texts.map((text) => text.text).join(' '),
    firstLetters: texts.map((text) => `${text.reference}: ${firstLettersForText(text.text)}`).join('\n'),
    chainTexts: texts,
  };
}

function buildChainPreviewExercise(texts: BibleText[]): Exercise {
  return {
    id: 'chain-preview',
    level: 'N6',
    title: 'Ketting voorbereiden',
    instruction: 'Bekijk de volgorde. Later oefenen we deze teksten achter elkaar als korte ketting.',
    reference: texts.map((text) => text.reference).join(' + '),
    text: texts.map((text) => text.text).join(' '),
    chainTexts: texts,
  };
}

function buildBlank(text: BibleText, wordIndex: number): ChoiceBlank {
  const answer = pickImportantWord(text, wordIndex);
  return {
    id: `${text.id}-blank-${wordIndex + 1}`,
    answer,
    options: buildOptions(answer, text),
    reference: text.reference,
    text: text.text,
    promptText: maskWords(text.text, [answer]),
    theme: text.theme,
  };
}

function pickImportantWord(text: BibleText, index: number): string {
  const fallbackWords = text.text
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Za-z0-9À-ž]/g, ''))
    .filter((word) => word.length > 3);
  const words = [...text.importantWords, ...fallbackWords];
  return words[index % words.length];
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
