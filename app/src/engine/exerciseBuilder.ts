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
  badgeTitle: string;
  levelCount: number;
  textIds?: string[];
  bookNames?: string[];
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

const BIBLE_BOOKS = [
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numeri',
  'Deuteronomium',
  'Jozua',
  'Richteren',
  'Ruth',
  '1 Samuel',
  '2 Samuel',
  '1 Koningen',
  '2 Koningen',
  '1 Kronieken',
  '2 Kronieken',
  'Ezra',
  'Nehemia',
  'Esther',
  'Job',
  'Psalmen',
  'Spreuken',
  'Prediker',
  'Hooglied',
  'Jesaja',
  'Jeremia',
  'Klaagliederen',
  'Ezechiel',
  'Daniel',
  'Hosea',
  'Joel',
  'Amos',
  'Obadja',
  'Jona',
  'Micha',
  'Nahum',
  'Habakuk',
  'Zefanja',
  'Haggai',
  'Zacharia',
  'Maleachi',
  'Mattheus',
  'Markus',
  'Lukas',
  'Johannes',
  'Handelingen',
  'Romeinen',
  '1 Korinthe',
  '2 Korinthe',
  'Galaten',
  'Efeze',
  'Filippenzen',
  'Kolossenzen',
  '1 Thessalonicenzen',
  '2 Thessalonicenzen',
  '1 Timotheus',
  '2 Timotheus',
  'Titus',
  'Filemon',
  'Hebreeen',
  'Jakobus',
  '1 Petrus',
  '2 Petrus',
  '1 Johannes',
  '2 Johannes',
  '3 Johannes',
  'Judas',
  'Openbaring',
];

export const LESSON_THEMES: LessonTheme[] = [
  {
    id: 'vertrouwen-en-rust',
    title: 'Vertrouwen en rust',
    description: 'Teksten voor momenten waarop je steun, rust en richting zoekt.',
    badgeTitle: 'Rustdrager',
    levelCount: 5,
    textIds: ['psalm-23-1', 'matthew-11-28', 'isaiah-41-10', 'psalm-119-105'],
  },
  {
    id: 'gebed-en-vrede',
    title: 'Gebed en vrede',
    description: 'Teksten over zorgen loslaten, bidden en Gods vrede ontvangen.',
    badgeTitle: 'Vredeswachter',
    levelCount: 5,
    textIds: ['philippians-4-6', 'philippians-4-7', 'romans-12-12'],
  },
  {
    id: 'geloof-en-hoop',
    title: 'Geloof en hoop',
    description: 'Kernteksten over liefde, geloof en hoopvolle volharding.',
    badgeTitle: 'Hoopbouwer',
    levelCount: 5,
    textIds: ['john-3-16', 'romans-8-28', 'hebrews-11-1'],
  },
  {
    id: 'jezus-woorden',
    title: 'Woorden van Jezus',
    description: 'Begin met korte woorden rond liefde, rust en volgen.',
    badgeTitle: 'Leerling',
    levelCount: 4,
    textIds: ['john-3-16', 'matthew-11-28', 'psalm-119-105'],
  },
  {
    id: 'moed-in-moeite',
    title: 'Moed in moeite',
    description: 'Teksten om staande te blijven wanneer het onrustig wordt.',
    badgeTitle: 'Moedhouder',
    levelCount: 5,
    textIds: ['isaiah-41-10', 'romans-8-28', 'philippians-4-7', 'romans-12-12'],
  },
  {
    id: 'bijbelboeken-volgorde',
    title: 'Bijbelboeken in volgorde',
    description: 'Leer de boeken van de Bijbel stap voor stap, van Genesis tot Openbaring.',
    badgeTitle: 'Bijbelnavigator',
    levelCount: 7,
    bookNames: BIBLE_BOOKS,
  },
];

export function buildLesson(bundle: BibleBundle, themeIndex = 0): Lesson {
  const activeTheme = LESSON_THEMES[themeIndex % LESSON_THEMES.length];
  const texts = buildThemeTexts(activeTheme, bundle);
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

function buildThemeTexts(theme: LessonTheme, bundle: BibleBundle): BibleText[] {
  if (theme.bookNames) {
    return chunk(theme.bookNames, 6).map((books, index) => ({
      id: `${theme.id}-${index + 1}`,
      reference: `Bijbelboeken ${index * 6 + 1}-${index * 6 + books.length}`,
      text: books.join(' - '),
      context: 'Oefen de volgorde als korte ketting.',
      theme: theme.title,
      importantWords: books.map((book) => book.replace(/^\d\s+/, '')),
    }));
  }

  return (theme.textIds ?? [])
    .map((id) => bundle.texts.find((text) => text.id === id))
    .filter((text): text is BibleText => Boolean(text));
}

function buildReadSetExercise(theme: LessonTheme, texts: BibleText[]): Exercise {
  return {
    id: `${theme.id}-read-set`,
    level: 'N0',
    title: 'Lees de cursus',
    instruction: `Deze cursus heeft ${theme.levelCount} niveaus. Kijk eerst rustig naar de teksten; daarna valt er per niveau meer hulp weg.`,
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
    instruction: 'Elke tekst mist nu een sleutelwoord. Kies het woord en vink de plekken een voor een af.',
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
    .concat(['genade', 'vrede', 'hoop', 'woord', 'licht', 'geloof', 'Psalmen', 'Johannes']);
  const unique = [answer, ...distractors].filter(
    (word, index, words) => words.findIndex((item) => normalizeAnswer(item) === normalizeAnswer(word)) === index,
  );
  return rotate(unique.slice(0, 4), answer.length % 4);
}

function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size));
  }
  return groups;
}

function rotate<T>(items: T[], offset: number): T[] {
  return items.map((_, index) => items[(index + offset) % items.length]);
}
