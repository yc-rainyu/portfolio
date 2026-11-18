import { parse as parseYaml } from 'yaml';
import { languages } from '../config/site.ts';

export const contentLanguages = languages;
/* Tags shown on a project without a row in the skills matrix */
export const projectOnlySkills = ['Adobe Illustrator'];
type Language = typeof contentLanguages[number];
type SkillDefinition = { name: string; aliases?: string[] };
type Group = { id: string; items: (string | SkillDefinition)[] };

export function localise(value: any, lang: Language): any {
  if (Array.isArray(value)) return value.map((item) => localise(item, lang));
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.some((key) => contentLanguages.includes(key as Language))) {
      if (keys.length !== 2 || !contentLanguages.every((key) => key in value)) {
        throw new Error('Translated fields must contain both zh and en');
      }
      return localise(value[lang], lang);
    }
    return Object.fromEntries(Object.entries(value)
      .map(([key, item]) => [key, localise(item, lang)])
      .filter(([, item]) => item !== undefined));
  }
  return value === null ? undefined : value;
}

export function parseProjectSource(source: string, file: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`${file} needs YAML frontmatter`);
  const data = parseYaml(match[1]) as Record<string, unknown>;
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(`${file} needs a YAML object`);
  if ('stack' in data) throw new Error(`${file} must define skills in skill-weights.yaml`);
  const sections = [...match[2].matchAll(/^# (zh|en)\s*$/gm)];
  if (sections.length !== 2 || sections[0]![1] !== 'zh' || sections[1]![1] !== 'en') {
    throw new Error(`${file} needs one # zh section followed by one # en section`);
  }
  const bodies = Object.fromEntries(sections.map((section, i) => [
    section[1], match[2]!.slice(section.index! + section[0].length, sections[i + 1]?.index).trim() + '\n',
  ])) as Record<Language, string>;
  return { data, bodies };
}

export function projectStack(weights: Record<string, number>, groups: Group[]): string[] {
  const practices = new Set<string>();
  const tools = new Set<string>();
  const known = new Set<string>(projectOnlySkills.map((name) => name.toLowerCase()));
  for (const group of groups) {
    for (const item of group.items) {
      const skill = typeof item === 'string' ? { name: item } : item;
      for (const name of [skill.name, ...(skill.aliases ?? [])]) {
        known.add(name.toLowerCase());
        if (group.id === 'practices') practices.add(name.toLowerCase());
      }
      if (skill.name === 'AI-assisted coding') {
        for (const alias of skill.aliases ?? []) tools.add(alias.toLowerCase());
      }
    }
  }
  for (const [name, weight] of Object.entries(weights)) {
    if (!known.has(name.toLowerCase())) throw new Error(`Unknown skill ${name}; define it in skills.yaml`);
    if (!Number.isInteger(weight) || weight < 1 || weight > 5) throw new Error(`${name} needs a usage level from 1 to 5`);
  }
  return Object.keys(weights).filter((name) => !practices.has(name.toLowerCase()) || tools.has(name.toLowerCase()));
}
