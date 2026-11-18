import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';
import { parse as parseYaml } from 'yaml';

const root = fileURLToPath(new URL('..', import.meta.url));
const srcDir = join(root, 'src');
const outDir = join(srcDir, 'assets/fonts/generated');
const fontsource = (path) => join(root, 'node_modules/@fontsource', path);

const TEXT_EXTENSIONS = new Set(['.md', '.mdx', '.yaml', '.yml', '.astro', '.ts']);

const SOURCES = {
  sans400: {
    file: 'noto-sans-tc/files/noto-sans-tc-chinese-traditional-400-normal.woff2',
    ranges: 'noto-sans-tc/400.css',
    name: 'Noto Sans TC 400',
  },
  sans500: {
    file: 'noto-sans-tc/files/noto-sans-tc-chinese-traditional-500-normal.woff2',
    ranges: 'noto-sans-tc/500.css',
    name: 'Noto Sans TC 500',
  },
  serif600: {
    file: 'noto-serif-tc/files/noto-serif-tc-chinese-traditional-600-normal.woff2',
    ranges: 'noto-serif-tc/600.css',
    name: 'Noto Serif TC 600',
  },
  mincho500: {
    file: 'shippori-mincho/files/shippori-mincho-japanese-500-normal.woff2',
    ranges: 'shippori-mincho/500.css',
    name: 'Shippori Mincho 500',
  },
};

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return path === outDir ? [] : walk(path);
      return TEXT_EXTENSIONS.has(extname(entry.name)) ? [path] : [];
    }),
  );
  return files.flat();
}

function stripComments(file, text) {
  const ext = extname(file);
  if (ext === '.astro' || ext === '.ts') {
    return text
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      // Preserve URL schemes when removing comments
      .replace(/(^|[\s;{},(])\/\/[^\n]*/gm, '$1');
  }
  if (ext === '.yaml' || ext === '.yml') {
    return text.replace(/(^|\s)#[^\n]*/gm, '$1');
  }
  return text;
}

export async function collectSiteText() {
  const chars = new Set();
  for (let code = 0x20; code <= 0x7e; code++) chars.add(String.fromCodePoint(code));
  for (const file of await walk(srcDir)) {
    for (const char of stripComments(file, await readFile(file, 'utf8'))) {
      if (char.codePointAt(0) > 0x7e) chars.add(char);
    }
  }
  return [...chars].sort().join('');
}

async function collectDisplayText() {
  const copy = parseYaml(await readFile(join(srcDir, 'content/site.yaml'), 'utf8'));
  const display = typeof copy?.hero?.display === 'string' ? copy.hero.display : copy?.hero?.display?.zh;
  if (typeof display !== 'string' || display.length === 0) {
    throw new Error('src/content/site.yaml 缺少 hero.display.zh');
  }
  return display;
}

async function readCoverage(cssPath) {
  const css = await readFile(fontsource(cssPath), 'utf8');
  const ranges = [];
  for (const [, list] of css.matchAll(/unicode-range:\s*([^;]+);/g)) {
    for (const part of list.split(',')) {
      const [from, to] = part.trim().replace(/^U\+/i, '').split('-');
      const start = Number.parseInt(from, 16);
      ranges.push([start, to ? Number.parseInt(to, 16) : start]);
    }
  }
  return (char) => {
    const code = char.codePointAt(0);
    return ranges.some(([start, end]) => code >= start && code <= end);
  };
}

const isIgnorable = (char) => /\s|\p{Cc}|\p{Cf}/u.test(char);

async function subset(sourceKey, text) {
  const source = SOURCES[sourceKey];
  const input = await readFile(fontsource(source.file));
  return subsetFont(input, text, { targetFormat: 'woff2' });
}

/** @returns {Promise<{ skipped: boolean, report: string[] }>} */

export async function buildFonts({ force = false } = {}) {
  const siteText = await collectSiteText();
  const displayText = await collectDisplayText();

  // Use one fallback font for the entire display word
  const minchoHas = await readCoverage(SOURCES.mincho500.ranges);
  const missingInMincho = [...displayText].filter((c) => !isIgnorable(c) && !minchoHas(c));
  const displaySource = missingInMincho.length === 0 ? 'mincho500' : 'serif600';

  const targets = [
    { out: 'noto-sans-tc-400.woff2', source: 'sans400', text: siteText },
    { out: 'noto-sans-tc-500.woff2', source: 'sans500', text: siteText },
    { out: 'noto-serif-tc-600.woff2', source: 'serif600', text: siteText },
    { out: 'display-zh.woff2', source: displaySource, text: displayText },
  ];

  const hash = createHash('sha256')
    .update(JSON.stringify(targets.map((t) => [t.out, SOURCES[t.source].file, t.text])))
    .digest('hex');
  const manifestPath = join(outDir, 'manifest.json');
  if (!force && existsSync(manifestPath)) {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    if (manifest.hash === hash && targets.every((t) => existsSync(join(outDir, t.out)))) {
      return { skipped: true, report: manifest.report };
    }
  }

  await mkdir(outDir, { recursive: true });
  const report = [];
  for (const target of targets) {
    const output = await subset(target.source, target.text);
    await writeFile(join(outDir, target.out), output);
    report.push(
      `${target.out}：${SOURCES[target.source].name}，${[...target.text].length} 個字，${(output.length / 1024).toFixed(1)} KB`,
    );
  }

  if (missingInMincho.length > 0) {
    report.push(
      `展示大字「${displayText}」裡的「${missingInMincho.join('')}」不在 Shippori Mincho 裡，整個詞改用 Noto Serif TC`,
    );
  }

  const sansHas = await readCoverage(SOURCES.sans400.ranges);
  const missing = [...siteText].filter((c) => !isIgnorable(c) && !sansHas(c));
  if (missing.length > 0) {
    report.push(`Noto Sans TC 沒有這些字，會以系統字顯示：${missing.join(' ')}`);
  }

  await writeFile(manifestPath, `${JSON.stringify({ hash, report }, null, 2)}\n`);
  return { skipped: false, report };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { skipped, report } = await buildFonts({ force: process.argv.includes('--force') });
  console.log(skipped ? '字型子集沒有變動' : '已產生字型子集');
  for (const line of report) console.log(`  ${line}`);
}
