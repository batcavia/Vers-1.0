import { MemoryBundle, MemoryText } from '../data/demoTexts';
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
  text: string;
  promptText?: string;
  blanks?: ChoiceBlank[];
  hiddenWords?: string[];
  firstLetters?: string;
  chainTexts?: MemoryText[];
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  texts: MemoryText[];
  exercises: Exercise[];
};

export function buildLesson(bundle: MemoryBundle): Lesson {
  const primaryText = bundle.texts[0];
  const secondaryTexts = bundle.texts.slice(1, 3);
  const exercises: Exercise[] = [
    buildReadExercise(primaryText),
    buildSingleChoiceExercise(primaryText),
    buildMultiChoiceExercise(primaryText),
    buildTypedBlankExercise(primaryText),
    buildInitialsExercise(primaryText),
    buildFreeRecallExercise(primaryText),
  ];

  if (secondaryTexts.length > 0) {
    exercises.push(buildChainPreviewExercise([primaryText, ...secondaryTexts]));
  }

  return {
    id: bundle.id,
    title: bundle.title,
    description: bundle.description,
    texts: bundle.texts,
    exercises,
  };
}

function buildReadExercise(text: MemoryText): Exercise {
  return {
    id: `${text.id}-read`,
    level: 'N0',
    title: 'Lees rustig',
    instruction: 'Neem de tekst eerst helemaal op. Er is geen timer.',
    reference: text.reference,
    context: text.context,
    text: text.text,
  };
}

function buildSingleChoiceExercise(text: MemoryText): Exercise {
  const answer = pickImportantWords(text, 1)[0];
  return {
    id: `${text.id}-choice-one`,
    level: 'N1',
    title: 'Eén woord ontbreekt',
    instruction: 'Kies het woord dat de tekst compleet maakt.',
    reference: text.reference,
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

function buildMultiChoiceExercise(text: MemoryText): Exercise {
  const answers = pickImportantWords(text, 3);
  return {
    id: `${text.id}-choice-many`,
    level: 'N2',
    title: 'Meer woorden vallen weg',
    instruction: 'Vul elk gat met de juiste keuze.',
    reference: text.reference,
    text: text.text,
    promptText: maskWords(text.text, answers),
    blanks: answers.map((answer, index) => ({
      id: `${text.id}-blank-${index + 1}`,
      answer,
      options: buildOptions(answer, text),
    })),
  };
}

function buildTypedBlankExercise(text: MemoryText): Exercise {
  const hiddenWords = pickImportantWords(text, 2);
  return {
    id: `${text.id}-typed-blanks`,
    level: 'N3',
    title: 'Typ de ontbrekende woorden',
    instruction: 'Hoofdletters en leestekens tellen niet streng mee.',
    reference: text.reference,
    text: text.text,
    promptText: maskWords(text.text, hiddenWords),
    hiddenWords,
  };
}

function buildInitialsExercise(text: MemoryText): Exercise {
  return {
    id: `${text.id}-initials`,
    level: 'N4',
    title: 'Alleen eerste letters',
    instruction: 'Gebruik de eerste letters als steun en typ de volledige tekst.',
    reference: text.reference,
    text: text.text,
    firstLetters: firstLettersForText(text.text),
  };
}

function buildFreeRecallExercise(text: MemoryText): Exercise {
  return {
    id: `${text.id}-free-recall`,
    level: 'N5',
    title: 'Vrije recall',
    instruction: 'Typ de tekst uit je hoofd. Daarna zie je wat al stevig zat.',
    reference: text.reference,
    text: text.text,
  };
}

function buildChainPreviewExercise(texts: MemoryText[]): Exercise {
  return {
    id: 'chain-preview',
    level: 'N6',
    title: 'Ketting voorbereiden',
    instruction: 'Later oefenen we korte teksten achter elkaar. Vandaag kijk je alvast naar de volgorde.',
    reference: texts.map((text) => text.reference).join(' + '),
    text: texts.map((text) => text.text).join(' '),
    chainTexts: texts,
  };
}

function pickImportantWords(text: MemoryText, count: number): string[] {
  return text.importantWords.slice(0, count);
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

function buildOptions(answer: string, text: MemoryText): string[] {
  const distractors = text.importantWords
    .filter((word) => normalizeAnswer(word) !== normalizeAnswer(answer))
    .concat(['rust', 'licht', 'hoop', 'vertrouw', 'vandaag']);
  const unique = [answer, ...distractors].filter((word, index, words) => words.findIndex((item) => normalizeAnswer(item) === normalizeAnswer(word)) === index);
  return rotate(unique.slice(0, 4), answer.length % 4);
}

function rotate<T>(items: T[], offset: number): T[] {
  return items.map((_, index) => items[(index + offset) % items.length]);
}
