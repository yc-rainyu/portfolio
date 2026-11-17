import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export const seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
export type Season = (typeof seasons)[number];

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/seasons/*/*.webp', { eager: true });

export interface Art {
  src: string;
  ratio: number;
}

const cache = new Map<string, Promise<Art>>();

export function art(season: Season, name: string, width: number): Promise<Art> {
  const file = files[`../assets/seasons/${season}/${name}.webp`];
  if (!file) throw new Error(`找不到插畫 src/assets/seasons/${season}/${name}.webp`);
  const image = file.default;
  width = Math.min(image.width, Math.max(1, Math.round(width)));
  const key = `${season}/${name}@${width}`;
  let result = cache.get(key);
  if (!result) {
    result = Promise.all([
      getImage({ src: image, width, format: 'avif' }),
      getImage({ src: image, width, format: 'webp' }),
    ]).then(([avif, webp]) => ({
      src: `image-set(url("${avif.src}") type("image/avif"), url("${webp.src}") type("image/webp"))`,
      ratio: image.width / image.height,
    }));
    cache.set(key, result);
  }
  return result;
}

/* Keep illustration placement stable between builds */
export function seededRandom(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
