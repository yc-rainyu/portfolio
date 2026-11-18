import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localise, parseProjectSource, projectStack } from '../src/lib/content-source.ts';
import { buildSkillMatrix, featuredSkills, FEATURED_SKILL_LIMIT } from '../src/lib/skills.ts';

const groups = [
  { id: 'frontend', order: 0, label: 'Front-end', items: [{ name: 'React', aliases: [] }] },
  { id: 'practices', order: 1, label: 'Practices', items: [
    { name: 'code review', aliases: [] },
    { name: 'AI-assisted coding', aliases: ['Claude Code', 'Codex CLI'] },
  ] },
];

test('Shared values and translated values resolve without leaking the other language', () => {
  const source = { year: 2026, title: { zh: '中文', en: 'English' }, metrics: [{ value: '96%', label: { zh: '準確率', en: 'Accuracy' } }] };
  assert.deepEqual(localise(source, 'en'), { year: 2026, title: 'English', metrics: [{ value: '96%', label: 'Accuracy' }] });
  assert.equal(localise(source, 'zh').title, '中文');
  assert.throws(() => localise({ title: { zh: '中文' } }, 'en'), /both zh and en/);
});

test('Each language gets only its own Markdown body', () => {
  const source = '---\ntitle: Example\n---\n# zh\n## 專案簡介\n中文\n# en\n## Overview\nEnglish';
  const parsed = parseProjectSource(source, 'example.md');
  assert.equal(parsed.bodies.zh, '## 專案簡介\n中文\n');
  assert.equal(parsed.bodies.en, '## Overview\nEnglish\n');
  assert.throws(() => parseProjectSource(source.replace('# en', '# zh'), 'example.md'), /one # zh/);
  assert.throws(() => parseProjectSource(source.replace('title: Example', 'stack: [React]'), 'example.md'), /skill-weights/);
});

test('One skill assignment drives tags and matrix while practices stay out of tags', () => {
  const weights = { React: 2, 'code review': 4, 'Claude Code': 5, 'AI-assisted coding': 1 };
  const stack = projectStack(weights, groups);
  assert.deepEqual(stack, ['React', 'Claude Code']);
  const projects = [{ slug: 'example', stack }] as any;
  const matrix = buildSkillMatrix(groups as any, projects, new Map([['example', weights]]));
  assert.equal(matrix.groups[0]!.rows[0]!.weight[0], 2);
  assert.equal(matrix.groups[1]!.rows[0]!.weight[0], 4);
  assert.equal(matrix.groups[1]!.rows[1]!.weight[0], 1);
  assert.deepEqual(projectStack({}, groups), []);
  assert.throws(() => projectStack({ Recat: 3 }, groups), /Unknown skill/);
  assert.throws(() => projectStack({ React: 6 }, groups), /1 to 5/);
});

test('The loader updates both languages after skill changes and handles added or removed projects', async () => {
  const { mkdtemp, mkdir, writeFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { pathToFileURL } = await import('node:url');
  const { bilingualProjects } = await import('../src/loaders/projects.ts');
  const directory = await mkdtemp(join(tmpdir(), 'portfolio-loader-'));
  const projects = join(directory, 'src/content/projects');
  const weights = join(directory, 'src/content/skill-weights.yaml');
  const skills = join(directory, 'src/content/skills.yaml');
  const source = '---\ntitle:\n  zh: 中文\n  en: English\n---\n# zh\n## 專案簡介\n中文\n# en\n## Overview\nEnglish';
  const entries = new Map<string, any>();
  const errors: string[] = [];
  let changed: any;
  try {
    await mkdir(projects, { recursive: true });
    await writeFile(join(projects, 'example.md'), source);
    await writeFile(weights, 'example:\n  React: 2\n');
    await writeFile(skills, '- id: frontend\n  items: [React, Vue]\n');
    await bilingualProjects().load({
      config: { root: pathToFileURL(directory + '/') },
      store: { keys: () => entries.keys(), delete: (id: string) => entries.delete(id), set: (entry: any) => entries.set(entry.id, entry) },
      parseData: async ({ data }: any) => data,
      renderMarkdown: async (body: string) => ({ html: body }),
      generateDigest: (data: any) => JSON.stringify(data),
      watcher: { add() {}, on(_event: string, callback: any) { changed = callback; } },
      logger: { error: (message: string) => errors.push(message) },
    } as any);
    assert.equal(entries.size, 2);
    assert.equal(entries.get('zh/example').data.title, '中文');
    assert.deepEqual(entries.get('en/example').data.stack, ['React']);
    await writeFile(weights, 'example:\n  React: 4\n  Vue: 2\n');
    await changed('change', weights);
    assert.deepEqual(entries.get('zh/example').data.stack, ['React', 'Vue']);
    assert.deepEqual(entries.get('en/example').data.stack, ['React', 'Vue']);
    await writeFile(join(projects, 'added.md'), source);
    await changed('add', join(projects, 'added.md'));
    assert.equal(entries.size, 4);
    await rm(join(projects, 'added.md'));
    await changed('unlink', join(projects, 'added.md'));
    assert.equal(entries.size, 2);
    await writeFile(join(projects, 'example.md'), 'invalid content');
    await changed('change', join(projects, 'example.md'));
    assert.equal(errors.length, 1);
    assert.equal(entries.get('en/example').data.title, 'English');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});


test('Featured cards slice the stack derived from the weight file in its original order', () => {
  const definitions = [{ id: 'frontend', items: ['React', 'Vue', 'TypeScript'] },
    { id: 'practices', items: ['code review'] }];
  const weights = { Vue: 2, 'code review': 4, React: 5, TypeScript: 3 };
  const stack = projectStack(weights, definitions);
  assert.deepEqual(featuredSkills({ stack }), ['Vue', 'React', 'TypeScript'].slice(0, FEATURED_SKILL_LIMIT));
  const many = Array.from({ length: FEATURED_SKILL_LIMIT + 3 }, (_, i) => `skill${i}`);
  assert.deepEqual(featuredSkills({ stack: many }), many.slice(0, FEATURED_SKILL_LIMIT));
  assert.equal(many.length, FEATURED_SKILL_LIMIT + 3);
});
