import { VERSES, Verse } from '../data/verses';

export type LessonStepKind = 'read' | 'reflect' | 'recall';

export type LessonStep = {
  id: string;
  kind: LessonStepKind;
  title: string;
  body: string;
  estimatedSeconds: number;
  verse?: Verse;
};

export type Lesson = {
  title: string;
  targetSeconds: number;
  softMinSeconds: number;
  softMaxSeconds: number;
  estimatedSeconds: number;
  verses: Verse[];
  steps: LessonStep[];
};

const TARGET_SECONDS = 180;
const SOFT_MIN_SECONDS = 150;
const SOFT_MAX_SECONDS = 240;

export function assembleLesson(): Lesson {
  const selectedVerses = pickVersesForTarget(VERSES);
  const steps = buildSteps(selectedVerses);
  const estimatedSeconds = sumSeconds(steps);

  return {
    title: 'Rustig leren, zonder klok',
    targetSeconds: TARGET_SECONDS,
    softMinSeconds: SOFT_MIN_SECONDS,
    softMaxSeconds: SOFT_MAX_SECONDS,
    estimatedSeconds,
    verses: selectedVerses,
    steps,
  };
}

function pickVersesForTarget(verses: Verse[]): Verse[] {
  const selected: Verse[] = [];
  let total = 0;

  for (const verse of verses) {
    const projected = total + verse.estimatedSeconds + 30;
    if (projected <= SOFT_MAX_SECONDS) {
      selected.push(verse);
      total = projected;
    }

    if (total >= SOFT_MIN_SECONDS && selected.length >= 4) {
      break;
    }
  }

  return selected;
}

function buildSteps(verses: Verse[]): LessonStep[] {
  const steps: LessonStep[] = [
    {
      id: 'warmup',
      kind: 'reflect',
      title: 'Adem in',
      body: 'Lees vandaag zonder haast. Het doel is niet snelheid, maar aandacht.',
      estimatedSeconds: 20,
    },
  ];

  for (const verse of verses) {
    steps.push({
      id: `${verse.id}-read`,
      kind: 'read',
      title: verse.reference,
      body: verse.text,
      estimatedSeconds: verse.estimatedSeconds,
      verse,
    });
    steps.push({
      id: `${verse.id}-recall`,
      kind: 'recall',
      title: 'Zeg de kern na',
      body: `Wat blijft hangen uit ${verse.reference}? Denk aan: ${verse.theme.toLowerCase()}.`,
      estimatedSeconds: 12,
      verse,
    });
  }

  steps.push({
    id: 'close',
    kind: 'reflect',
    title: 'Neem een zin mee',
    body: 'Kies een woord of korte zin die je vandaag wilt onthouden.',
    estimatedSeconds: 20,
  });

  return steps;
}

function sumSeconds(steps: LessonStep[]): number {
  return steps.reduce((total, step) => total + step.estimatedSeconds, 0);
}
