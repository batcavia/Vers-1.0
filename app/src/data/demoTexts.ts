export type MemoryText = {
  id: string;
  reference: string;
  text: string;
  context?: string;
  importantWords: string[];
};

export type MemoryBundle = {
  id: string;
  title: string;
  description: string;
  texts: MemoryText[];
};

export const ESSENTIALS_DEMO: MemoryBundle = {
  id: 'essentials-demo',
  title: 'Essentials demo',
  description: 'Korte placeholderteksten om de memorisatieflow te testen. Later kan hier gelicentieerde tekst of gebruikersimport in.',
  texts: [
    {
      id: 'world-loved',
      reference: 'Demo 1',
      text: 'God heeft de wereld lief.',
      context: 'Een korte oefentekst over liefde.',
      importantWords: ['God', 'wereld', 'lief'],
    },
    {
      id: 'my-shepherd',
      reference: 'Demo 2',
      text: 'De Heer is mijn herder.',
      context: 'Een korte oefentekst over vertrouwen.',
      importantWords: ['Heer', 'mijn', 'herder'],
    },
    {
      id: 'pray-first',
      reference: 'Demo 3',
      text: 'Maak je geen zorgen, maar bid.',
      context: 'Een korte oefentekst over rust en gebed.',
      importantWords: ['Maak', 'zorgen', 'bid'],
    },
  ],
};
