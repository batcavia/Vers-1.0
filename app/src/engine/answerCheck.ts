export type RecallCheck = {
  isCorrect: boolean;
  closeness: 'correct' | 'almost' | 'miss';
  missingWords: string[];
  normalizedExpected: string;
  normalizedActual: string;
};

export function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function checkExactWord(expected: string, actual: string): RecallCheck {
  return checkRecall(expected, actual, 0);
}

export function checkTypedWords(expectedWords: string[], actual: string): RecallCheck {
  return checkRecall(expectedWords.join(' '), actual, 0);
}

export function checkRecall(expected: string, actual: string, typoAllowance = 1): RecallCheck {
  const normalizedExpected = normalizeAnswer(expected);
  const normalizedActual = normalizeAnswer(actual);
  const expectedWords = splitWords(normalizedExpected);
  const actualWords = splitWords(normalizedActual);
  const missingWords = findMissingWords(expectedWords, actualWords, typoAllowance);
  const ratio = expectedWords.length === 0 ? 1 : (expectedWords.length - missingWords.length) / expectedWords.length;

  if (missingWords.length === 0) {
    return {
      isCorrect: true,
      closeness: 'correct',
      missingWords,
      normalizedExpected,
      normalizedActual,
    };
  }

  return {
    isCorrect: false,
    closeness: ratio >= 0.7 ? 'almost' : 'miss',
    missingWords,
    normalizedExpected,
    normalizedActual,
  };
}

export function firstLettersForText(text: string): string {
  return splitWords(normalizeAnswer(text))
    .map((word) => word.charAt(0))
    .join(' ');
}

function splitWords(value: string): string[] {
  return value.length === 0 ? [] : value.split(' ');
}

function findMissingWords(expectedWords: string[], actualWords: string[], typoAllowance: number): string[] {
  const remaining = [...actualWords];
  const missing: string[] = [];

  for (const expected of expectedWords) {
    const index = remaining.findIndex((actual) => wordsMatch(expected, actual, typoAllowance));
    if (index >= 0) {
      remaining.splice(index, 1);
    } else {
      missing.push(expected);
    }
  }

  return missing;
}

function wordsMatch(expected: string, actual: string, typoAllowance: number): boolean {
  if (expected === actual) {
    return true;
  }
  if (typoAllowance <= 0) {
    return false;
  }
  if (Math.abs(expected.length - actual.length) > typoAllowance) {
    return false;
  }
  return editDistance(expected, actual) <= typoAllowance;
}

function editDistance(left: string, right: string): number {
  const rows = left.length + 1;
  const columns = right.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(columns).fill(0));

  for (let row = 0; row < rows; row += 1) {
    matrix[row][0] = row;
  }
  for (let column = 0; column < columns; column += 1) {
    matrix[0][column] = column;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1;
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost,
      );
    }
  }

  return matrix[left.length][right.length];
}
