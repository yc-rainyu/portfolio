
export const themes = ['spring', 'summer', 'autumn', 'winter', 'shachiku'] as const;
export type Theme = (typeof themes)[number];

export const languages = ['zh', 'en'] as const;
export type Lang = (typeof languages)[number];

export const site = {
  url: 'https://ycrainyu.com',

  links: {
    github: 'https://github.com/yc-rainyu/',
    linkedin: 'https://www.linkedin.com/in/yuching-chang/',
    email: 'yc.rain.yu@gmail.com',
    cv: {
      zh: 'https://reurl.cc/dO4E12',
      en: 'https://reurl.cc/bejXmE',
    },
  },

  defaultTheme: 'autumn',

  showTagline: false,

  ogImage: '/og-default.png',
} as const satisfies {
  url: string;
  links: { github: string; linkedin: string; email: string; cv: Record<Lang, string> };
  defaultTheme: Theme;
  showTagline: boolean;
  ogImage: string;
};

export const storageKeys = { theme: 'theme', lang: 'lang' } as const;
