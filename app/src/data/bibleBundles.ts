export type BibleText = {
  id: string;
  reference: string;
  text: string;
  context?: string;
  theme: string;
  importantWords: string[];
};

export type BibleBundle = {
  id: string;
  name: string;
  translation: string;
  language: string;
  sourceNote: string;
  futureSourcesNote: string;
  description: string;
  texts: BibleText[];
};

export const ESSENTIALS_BUNDLE: BibleBundle = {
  id: 'essentials-statenvertaling',
  name: 'Essentials',
  translation: 'Statenvertaling',
  language: 'nl',
  sourceNote: 'Statenvertaling wordt gebruikt als juridisch veilige standaard demo-inhoud.',
  futureSourcesNote: 'Andere vertalingen kunnen later via licentie of gebruikersimport worden toegevoegd.',
  description: 'Tien korte kernteksten om de progressieve memorisatieflow te leren kennen.',
  texts: [
    {
      id: 'john-3-16',
      reference: 'Johannes 3:16',
      text: 'Want alzo lief heeft God de wereld gehad, dat Hij Zijn eniggeboren Zoon gegeven heeft, opdat een iegelijk die in Hem gelooft, niet verderve, maar het eeuwige leven hebbe.',
      context: 'Een kerntekst over Gods liefde en het eeuwige leven.',
      theme: 'Gods liefde',
      importantWords: ['lief', 'wereld', 'eniggeboren', 'gelooft'],
    },
    {
      id: 'psalm-23-1',
      reference: 'Psalm 23:1',
      text: 'De HEERE is mijn Herder, mij zal niets ontbreken.',
      context: 'Een korte belijdenis van vertrouwen.',
      theme: 'Vertrouwen',
      importantWords: ['HEERE', 'Herder', 'niets', 'ontbreken'],
    },
    {
      id: 'philippians-4-6',
      reference: 'Filippenzen 4:6',
      text: 'Weest in geen ding bezorgd; maar laat uw begeerten in alles, door bidden en smeken, met dankzegging bekend worden bij God.',
      context: 'Een oefentekst over gebed in plaats van zorg.',
      theme: 'Gebed',
      importantWords: ['bezorgd', 'begeerten', 'bidden', 'dankzegging'],
    },
    {
      id: 'philippians-4-7',
      reference: 'Filippenzen 4:7',
      text: 'En de vrede Gods, die alle verstand te boven gaat, zal uw harten en uw zinnen bewaren in Christus Jezus.',
      context: 'Een vervolgtekst over vrede die bewaart.',
      theme: 'Vrede',
      importantWords: ['vrede', 'verstand', 'harten', 'Christus'],
    },
    {
      id: 'matthew-11-28',
      reference: 'Mattheus 11:28',
      text: 'Komt herwaarts tot Mij, allen die vermoeid en belast zijt, en Ik zal u rust geven.',
      context: 'Een uitnodiging tot rust.',
      theme: 'Rust',
      importantWords: ['Komt', 'vermoeid', 'belast', 'rust'],
    },
    {
      id: 'isaiah-41-10',
      reference: 'Jesaja 41:10',
      text: 'Vrees niet, want Ik ben met u; zijt niet verbaasd, want Ik ben uw God; Ik sterk u, ook help Ik u, ook ondersteun Ik u met de rechterhand Mijner gerechtigheid.',
      context: 'Een tekst over moed en Gods nabijheid.',
      theme: 'Moed',
      importantWords: ['Vrees', 'God', 'sterk', 'ondersteun'],
    },
    {
      id: 'romans-8-28',
      reference: 'Romeinen 8:28',
      text: 'En wij weten, dat dengenen, die God liefhebben, alle dingen medewerken ten goede, namelijk dengenen, die naar Zijn voornemen geroepen zijn.',
      context: 'Een tekst over vertrouwen in Gods weg.',
      theme: 'Hoop',
      importantWords: ['weten', 'liefhebben', 'medewerken', 'geroepen'],
    },
    {
      id: 'psalm-119-105',
      reference: 'Psalm 119:105',
      text: 'Uw woord is een lamp voor mijn voet, en een licht voor mijn pad.',
      context: 'Een korte tekst over leiding door het Woord.',
      theme: 'Leiding',
      importantWords: ['woord', 'lamp', 'voet', 'licht'],
    },
    {
      id: 'romans-12-12',
      reference: 'Romeinen 12:12',
      text: 'Verblijdt u in de hoop. Zijt geduldig in de verdrukking. Volhardt in het gebed.',
      context: 'Een compacte oefentekst met drie opdrachten.',
      theme: 'Volharding',
      importantWords: ['Verblijdt', 'hoop', 'geduldig', 'gebed'],
    },
    {
      id: 'hebrews-11-1',
      reference: 'Hebreeen 11:1',
      text: 'Het geloof nu is een vaste grond der dingen, die men hoopt, en een bewijs der zaken, die men niet ziet.',
      context: 'Een definitieachtige tekst over geloof.',
      theme: 'Geloof',
      importantWords: ['geloof', 'grond', 'hoopt', 'bewijs'],
    },
  ],
};
