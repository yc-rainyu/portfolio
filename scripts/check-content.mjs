import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { contentLanguages, localise, parseProjectSource, projectOnlySkills, projectStack } from '../src/lib/content-source.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (name) => readFile(resolve(root, name), 'utf8');
const groups = parseYaml(await read('src/content/skills.yaml'));
const weights = parseYaml(await read('src/content/skill-weights.yaml'));
const known = new Map();
const used = new Set();
const projectOnly = new Set(projectOnlySkills);
const siteCopy = parseYaml(await read('src/content/site.yaml'));
const errors = [];
for (const group of groups) for (const item of group.items) {
  const skill = typeof item === 'string' ? { name: item } : item;
  for (const name of [skill.name, ...(skill.aliases ?? [])]) {
    const key = name.toLowerCase();
    if (known.has(key)) errors.push(`Duplicate skill name or alias: ${name}`);
    known.set(key, skill.name);
  }
}
const names = (await readdir(resolve(root, 'src/content/projects'))).filter((name) => name.endsWith('.md'));
const projects = new Map();
for (const name of names) {
  const slug = name.slice(0, -3);
  const file = `src/content/projects/${name}`;
  const { data, bodies } = parseProjectSource(await read(file), file);
  const entries = weights[slug] ?? {};
  const stack = projectStack(entries, groups);
  projects.set(slug, { stack, bodies, data });
  for (const [skill, level] of Object.entries(entries)) {
    if (!Number.isInteger(level) || level < 1 || level > 5) errors.push(`${slug}: ${skill} must be an integer from 1 to 5`);
    const canonical = known.get(skill.toLowerCase());
    if (!canonical && !projectOnly.has(skill)) errors.push(`${slug}: unknown skill ${skill}; add its definition to skills.yaml`);
    if (canonical) used.add(canonical);
  }
  for (const lang of contentLanguages) {
    const translated = localise(data, lang);
    for (const key of ['cover', 'coverStill', 'heroCover']) {
      if (translated[key]) {
        try { await readFile(resolve(root, dirname(file), translated[key])); }
        catch { errors.push(`${slug}/${lang}: missing ${key} image`); }
      }
    }
    if (!translated.title || !translated.summary) errors.push(`${slug}/${lang}: missing title or summary`);
    if (translated.status === 'unpublished' && translated.links?.live) errors.push(`${slug}: an unpublished project must not display a live link`);
    const headings = [...bodies[lang].matchAll(/^## (.+)$/gm)].map((m) => m[1]);
    const overview = siteCopy.work.sections.overview[lang];
    if (headings.length !== 1 || headings[0] !== overview) errors.push(`${slug}/${lang}: expected one overview heading`);
  }
}
for (const slug of Object.keys(weights)) if (!projects.has(slug)) errors.push(`Unknown project in skill-weights.yaml: ${slug}`);
for (const name of ['site', 'journey']) {
  const source = parseYaml(await read(`src/content/${name}.yaml`));
  for (const lang of contentLanguages) localise(source, lang);
}
if (errors.length) throw new Error(errors.join('\n'));
const unused = [...new Set(known.values())].filter((name) => !used.has(name));
console.log(`Content check passed for ${projects.size} bilingual projects and ${groups.reduce((sum, group) => sum + group.items.length, 0)} skills.`);
if (unused.length) console.log(`Skills without a project assignment: ${unused.join(', ')}`);
