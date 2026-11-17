import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';

const from = new URL('../masters/covers/', import.meta.url);
const to = new URL('../src/assets/covers/', import.meta.url);
await mkdir(to, { recursive: true });

for (const name of ['data', 'fullstack', 'frontend', 'design']) {
  const { data, info } = await sharp(new URL(`${name}.png`, from).pathname).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) data[i] = data[i + 1] = data[i + 2] = 0;
  const out = new URL(`${name}.webp`, to).pathname;
  await sharp(data, { raw: info }).resize({ width: 1200 }).webp({ lossless: true, effort: 6 }).toFile(out);
  console.log(`${name}.webp  ${Math.round((await stat(out)).size / 1024)} KB`);
}
