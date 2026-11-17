import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { languages, type Lang } from '../config/site';

export type ProjectEntry = CollectionEntry<'projects'>;
export type Project = ProjectEntry['data'] & {
  slug: string;
  lang: Lang;
  entry: ProjectEntry;
};
export type SiteCopy = CollectionEntry<'site'>['data'];
export type JourneyItem = CollectionEntry<'journeyZh'>['data'];
export type SkillGroup = CollectionEntry<'skills'>['data'];


export async function getCopy(lang: Lang): Promise<SiteCopy> {
  const entry = await getEntry('site', lang);
  if (!entry) throw new Error(`找不到文案檔 src/content/site/${lang}.yaml`);
  return entry.data;
}


const yearOf = (p: { start: number; end?: number }) => p.end ?? p.start;

function compareProjects(a: Project, b: Project): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.featured && b.featured) return (a.order ?? 0) - (b.order ?? 0);
  return yearOf(b) - yearOf(a) || b.start - a.start || a.slug.localeCompare(b.slug);
}

let slugCheck: Promise<void> | undefined;

/* Require matching project slugs for language switching */
function assertSameSlugs(): Promise<void> {
  slugCheck ??= (async () => {
    const all = await getCollection('projects');
    const byLang = new Map<string, Set<string>>(languages.map((l) => [l, new Set<string>()]));
    for (const entry of all) {
      const [lang, slug] = entry.id.split('/');
      if (lang && slug) byLang.get(lang)?.add(slug);
    }
    const [zh, en] = [byLang.get('zh')!, byLang.get('en')!];
    const missing = [
      ...[...zh].filter((s) => !en.has(s)).map((s) => `en/${s}.md`),
      ...[...en].filter((s) => !zh.has(s)).map((s) => `zh/${s}.md`),
    ];
    if (missing.length > 0) {
      throw new Error(
        `專案必須中英文各一個同名檔。缺少：${missing.map((m) => `src/content/projects/${m}`).join('、')}`,
      );
    }
  })();
  return slugCheck;
}

export async function getProjects(lang: Lang): Promise<Project[]> {
  await assertSameSlugs();
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
    throw new Error(`src/content/journey/${lang}.yaml 讀不到任何條目，請檢查 YAML 格式`);
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
