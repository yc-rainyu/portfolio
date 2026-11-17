export const sections = [
  { id: 'work', file: 'work.md' },
  { id: 'journey', file: 'journey.log' },
  { id: 'skills', file: 'skills.json' },
  { id: 'index', file: 'archive.csv' },
  { id: 'about', file: 'about.md' },
] as const;

export type SectionId = (typeof sections)[number]['id'];
