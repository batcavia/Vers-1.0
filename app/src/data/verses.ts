export type Verse = {
  id: string;
  reference: string;
  text: string;
  theme: string;
  estimatedSeconds: number;
};

export const VERSES: Verse[] = [
  {
    id: 'john-3-16',
    reference: 'Johannes 3:16',
    text: 'Want alzo lief heeft God de wereld gehad, dat Hij Zijn eniggeboren Zoon gegeven heeft, opdat een iegelijk die in Hem gelooft, niet verderve, maar het eeuwige leven hebbe.',
    theme: 'Gods liefde',
    estimatedSeconds: 34,
  },
  {
    id: 'psalm-23-1',
    reference: 'Psalm 23:1',
    text: 'De HEERE is mijn Herder, mij zal niets ontbreken.',
    theme: 'Vertrouwen',
    estimatedSeconds: 18,
  },
  {
    id: 'romans-8-28',
    reference: 'Romeinen 8:28',
    text: 'En wij weten, dat dengenen, die God liefhebben, alle dingen medewerken ten goede, namelijk dengenen, die naar Zijn voornemen geroepen zijn.',
    theme: 'Hoop',
    estimatedSeconds: 28,
  },
  {
    id: 'philippians-4-13',
    reference: 'Filippenzen 4:13',
    text: 'Ik vermag alle dingen door Christus, Die mij kracht geeft.',
    theme: 'Kracht',
    estimatedSeconds: 16,
  },
  {
    id: 'matthew-11-28',
    reference: 'Mattheus 11:28',
    text: 'Komt herwaarts tot Mij, allen die vermoeid en belast zijt, en Ik zal u rust geven.',
    theme: 'Rust',
    estimatedSeconds: 22,
  },
  {
    id: 'proverbs-3-5',
    reference: 'Spreuken 3:5',
    text: 'Vertrouw op den HEERE met uw ganse hart, en steun op uw verstand niet.',
    theme: 'Overgave',
    estimatedSeconds: 21,
  },
  {
    id: 'isaiah-41-10',
    reference: 'Jesaja 41:10',
    text: 'Vrees niet, want Ik ben met u; zijt niet verbaasd, want Ik ben uw God; Ik sterk u, ook help Ik u, ook ondersteun Ik u met de rechterhand Mijner gerechtigheid.',
    theme: 'Moed',
    estimatedSeconds: 35,
  },
  {
    id: 'psalm-119-105',
    reference: 'Psalm 119:105',
    text: 'Uw woord is een lamp voor mijn voet, en een licht voor mijn pad.',
    theme: 'Leiding',
    estimatedSeconds: 18,
  },
  {
    id: 'romans-12-12',
    reference: 'Romeinen 12:12',
    text: 'Verblijdt u in de hoop. Zijt geduldig in de verdrukking. Volhardt in het gebed.',
    theme: 'Volharding',
    estimatedSeconds: 21,
  },
  {
    id: 'hebrews-11-1',
    reference: 'Hebreeen 11:1',
    text: 'Het geloof nu is een vaste grond der dingen, die men hoopt, en een bewijs der zaken, die men niet ziet.',
    theme: 'Geloof',
    estimatedSeconds: 27,
  }
];
