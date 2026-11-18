import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { type Lang } from '../config/site';

export type ProjectEntry = CollectionEntry<'projects'>;
export type Project = ProjectEntry['data'] & {
  slug: string;
  lang: Lang;
  entry: ProjectEntry;
};
export type SiteCopy = CollectionEntry<'site'>['data'];
export type JourneyItem = CollectionEntry<'journeyZh'>['data'];
export type SkillGroup = CollectionEntry<'skills'>['data'];

const zhDigits = '零一二三四五六七八九';

/* Write a whole number from 1 to 99 in Chinese numerals */
function zhNumber(n: number): string {
  if (n < 10) return zhDigits[n]!;
  const tens = Math.floor(n / 10);
  return `${tens > 1 ? zhDigits[tens] : ''}十${n % 10 ? zhDigits[n % 10] : ''}`;
}

/* Replace known {name} placeholders in every string */
function fill<T>(value: T, tokens: Record<string, string>): T {
  if (typeof value === 'string') return value.replace(/\{(\w+)\}/g, (match, name) => tokens[name] ?? match) as T;
  if (Array.isArray(value)) return value.map((item) => fill(item, tokens)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fill(item, tokens)])) as T;
  }
  return value;
}

export async function getCopy(lang: Lang): Promise<SiteCopy> {
  const entry = await getEntry('site', lang);
  if (!entry) throw new Error(`找不到文案檔 src/content/site.yaml`);
  const total = (await getCollection('projects', ({ id }) => id.startsWith(`${lang}/`))).length;
  const projectCount = (total % 5 === 0) ? String(total) : `${total - (total % 5)}+`;
  const { years } = entry.data.values;
  return fill(entry.data, { years: String(years), yearsZh: zhNumber(years), projectCount });
}


const yearOf = (p: { start: number; end?: number }) => p.end ?? p.start;

function compareProjects(a: Project, b: Project): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.featured && b.featured) return (a.order ?? 0) - (b.order ?? 0);
  return yearOf(b) - yearOf(a) || b.start - a.start || a.slug.localeCompare(b.slug);
}

export async function getProjects(lang: Lang): Promise<Project[]> {
  const entries = await getCollection('projects', ({ id }) => id.startsWith(`${lang}/`));
  return entries
    .map((entry) => ({ ...entry.data, slug: entry.id.slice(lang.length + 1), lang, entry }))
    .sort(compareProjects);
}

export async function getFeatured(lang: Lang): Promise<Project[]> {
  return (await getProjects(lang)).filter((p) => p.featured);
}

export async function getIndex(lang: Lang): Promise<Project[]> {
  return (await getProjects(lang)).sort(
    (a, b) => yearOf(b) - yearOf(a) || b.start - a.start || compareProjects(a, b),
  );
}

export function formatYears(p: { start: number; end?: number }): string {
  return p.end !== undefined && p.end !== p.start ? `${p.start}–${p.end}` : String(p.start);
}


export async function getJourney(lang: Lang): Promise<JourneyItem[]> {
  const entries = await getCollection(lang === 'zh' ? 'journeyZh' : 'journeyEn');
  if (entries.length === 0) {
    throw new Error(`src/content/journey.yaml 讀不到任何條目，請檢查 YAML 格式`);
  }
  return entries.map((e) => e.data).sort((a, b) => a.order - b.order);
}


export async function getSkillGroups(): Promise<SkillGroup[]> {
  const entries = await getCollection('skills');
  if (entries.length === 0) {
    throw new Error('src/content/skills.yaml 讀不到任何分組，請檢查 YAML 格式');
  }
  return entries.map((e) => e.data).sort((a, b) => a.order - b.order);
}

export type SkillWeights = Map<string, Record<string, number>>;

export async function getSkillWeights(): Promise<SkillWeights> {
  const entries = await getCollection('skillWeights');
  return new Map(entries.map((e) => [e.id, e.data.weights]));
}


export function publicFileExists(urlPath: string): boolean {
  return existsSync(join(process.cwd(), 'public', decodeURIComponent(urlPath)));
}
