import { languages, type Lang } from '../config/site';

export const htmlLang: Record<Lang, string> = { zh: 'zh-Hant-TW', en: 'en-GB' };

export const hreflang: Record<Lang, string> = { zh: 'zh-TW', en: 'en' };
export const ogLocale: Record<Lang, string> = { zh: 'zh_TW', en: 'en_GB' };

export const otherLang = (lang: Lang): Lang => (lang === 'zh' ? 'en' : 'zh');

export function isLang(value: string | undefined): value is Lang {
  return (languages as readonly string[]).includes(value ?? '');
}

export function langFromPath(pathname: string): Lang | undefined {
  const first = pathname.split('/').filter(Boolean)[0];
  return isLang(first) ? first : undefined;
}

export function pathInLang(pathname: string, to: Lang): string {
  const parts = pathname.split('/').filter(Boolean);
  if (isLang(parts[0])) parts[0] = to;
  else parts.unshift(to);
  return `/${parts.join('/')}/`;
}

export const homePath = (lang: Lang) => `/${lang}/`;
export const workPath = (lang: Lang, slug: string) => `/${lang}/work/${slug}/`;
