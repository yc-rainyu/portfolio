import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, relative, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { Loader } from 'astro/loaders';
import { contentLanguages, localise, parseProjectSource, projectStack } from '../lib/content-source.ts';

export function bilingualProjects(): Loader {
  return {
    name: 'bilingual-projects',
    async load({ config, store, parseData, renderMarkdown, generateDigest, watcher, logger }) {
      const root = fileURLToPath(config.root);
      const directory = resolve(root, 'src/content/projects');
      const weightsPath = resolve(root, 'src/content/skill-weights.yaml');
      const skillsPath = resolve(root, 'src/content/skills.yaml');
      async function sync() {
        const names = (await readdir(directory)).filter((name) => name.endsWith('.md')).sort();
        const weights = parseYaml(await readFile(weightsPath, 'utf8')) as Record<string, Record<string, number>>;
        const groups = parseYaml(await readFile(skillsPath, 'utf8'));
        for (const slug of Object.keys(weights)) {
          if (!names.includes(`${slug}.md`)) throw new Error(`Unknown project in skill-weights.yaml: ${slug}`);
        }
        const pending = [];
        for (const name of names) {
          const filePath = resolve(directory, name);
          const source = await readFile(filePath, 'utf8');
          const { data: shared, bodies } = parseProjectSource(source, name);
          const slug = name.slice(0, -3);
          const stack = projectStack(weights[slug] ?? {}, groups);
          for (const lang of contentLanguages) {
            const id = `${lang}/${slug}`;
            const data = await parseData({ id, data: { ...localise(shared, lang), stack }, filePath });
            const rendered = await renderMarkdown(bodies[lang], { fileURL: pathToFileURL(filePath) });
            pending.push({ id, data, body: bodies[lang], filePath: relative(root, filePath),
              digest: generateDigest({ source, weights: weights[slug], groups }), rendered,
              assetImports: rendered.metadata?.imagePaths });
          }
        }
        // Validate all entries before replacing the current content
        const keep = new Set(pending.map((entry) => entry.id));
        for (const id of store.keys()) if (!keep.has(id)) store.delete(id);
        for (const entry of pending) store.set(entry);
      }
      await sync();
      if (!watcher) return;
      watcher.add([directory, weightsPath, skillsPath]);
      let queue = Promise.resolve();
      watcher.on('all', (event, path) => {
        if (!['add', 'change', 'unlink'].includes(event)) return;
        if (path !== weightsPath && path !== skillsPath && !(dirname(path) === directory && path.endsWith('.md'))) return;
        queue = queue.then(sync).catch((error) => { logger.error(String(error)); });
        return queue;
      });
    },
  };
}
