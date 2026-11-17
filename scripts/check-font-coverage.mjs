import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectSiteText } from './subset-fonts.mjs';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const subset = new Set(await collectSiteText());

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [])))).flat();
}

const decode = (text) =>
  text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)));

const missing = new Map();
let pages = 0;
for (const file of await walk(dist)) {
  const html = await readFile(file, 'utf8');
  if (!/<html[^>]*lang="zh/i.test(html)) continue;
  pages++;
  const shown = [];
  for (const [, css] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
    for (const [, , value] of css.matchAll(/content:\s*(["'])((?:\\.|(?!\1).)*)\1/g)) {
      shown.push(value.replace(/\\([0-9a-f]{1,6})\s?/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16))));
    }
  }
  shown.push(decode(html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')));
  for (const char of shown.join(' ')) {
    if (char.codePointAt(0) <= 0x7e || /\s|\p{Cc}|\p{Cf}/u.test(char) || subset.has(char)) continue;
    if (!missing.has(char)) missing.set(char, file.slice(dist.length));
  }
}

if (missing.size > 0) {
  console.error(`字型子集漏了 ${missing.size} 個字：`);
  for (const [char, file] of missing) console.error(`  「${char}」（U+${char.codePointAt(0).toString(16).toUpperCase()}）第一次出現在 ${file}`);
  process.exit(1);
}
console.log(`檢查了 ${pages} 個中文頁面：會顯示的字都在字型子集裡（子集共 ${subset.size} 個字）。`);
