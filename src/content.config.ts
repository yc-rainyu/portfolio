import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse as parseYaml } from 'yaml';
import { bilingualProjects } from './loaders/projects';
import { localise } from './lib/content-source';

const text = z.string().trim().min(1);


const projects = defineCollection({
  loader: bilingualProjects(),
  schema: ({ image }) =>
    z
      .strictObject({
        title: text,
        summary: text,
        category: z.enum(['data', 'fullstack', 'frontend', 'design']),
        start: z.number().int().min(2000).max(2100),
        end: z.number().int().min(2000).max(2100).optional(),
        featured: z.boolean().default(false),
        order: z.number().optional(),
        role: text.optional(),
        stack: z.array(text).default([]),
        metrics: z
          .array(z.strictObject({ label: text, value: text, note: text.optional() }))
          .max(3, '重點數字最多 3 個')
          .default([]),
        links: z
          .strictObject({
            live: z.url().optional(),
            github: z.url().optional(),
            demo: z.url().optional(),
          })
          .default({}),
        cover: image().optional(),
        coverLayout: z.enum(['overlap', 'below']).default('overlap'),
        heroCover: image().optional(),
        heroCoverAlt: text.optional(),
        coverStill: image().optional(),
        coverAlt: text.optional(),
        status: z.enum(['live', 'archived', 'internal', 'unpublished', 'research']),
      })
      .refine((p) => p.end === undefined || p.end >= p.start, {
        path: ['end'],
        message: 'end 不能早於 start',
      })
      .refine((p) => !p.featured || p.order !== undefined, {
        path: ['order'],
        message: 'featured 為 true 時必須填 order',
      })
      .refine((p) => !p.cover || p.coverAlt !== undefined, {
        path: ['coverAlt'],
        message: '有 cover 時必須填 coverAlt',
      })
      .refine((p) => !p.heroCover || p.heroCoverAlt !== undefined, {
        path: ['heroCoverAlt'],
        message: '有 heroCover 時必須填 heroCoverAlt',
      }),
});


/* Preserve the order defined in YAML */
function orderedYaml(path: string, lang?: 'zh' | 'en') {
  return file(path, {
    parser: (source) => {
      const raw = parseYaml(source);
      const data: unknown = lang ? localise(raw, lang) : raw;
      if (!Array.isArray(data)) {
        throw new Error(`${path} 的最外層必須是陣列`);
      }
      return data.map((item, index) => ({
        id: String(index + 1).padStart(2, '0'),
        ...(item as Record<string, unknown>),
        order: index,
      }));
    },
  });
}

const journeyBranch = z.enum(['art', 'design', 'frontend', 'fullstack']);

const journeySchema = z.strictObject({
  id: z.string(),
  order: z.number(),
  year: z.union([z.number().int(), text]).transform(String),
  title: text,
  org: text,
  desc: text,
  era: z.enum(['design', 'frontend', 'data']),
  branch: journeyBranch,
  from: journeyBranch.optional(),
  merges: z.array(journeyBranch).default([]),
  joins: z.array(journeyBranch).default([]),
});

const journeyZh = defineCollection({
  loader: orderedYaml('src/content/journey.yaml', 'zh'),
  schema: journeySchema,
});
const journeyEn = defineCollection({
  loader: orderedYaml('src/content/journey.yaml', 'en'),
  schema: journeySchema,
});


const skills = defineCollection({
  loader: orderedYaml('src/content/skills.yaml'),
  schema: z.strictObject({
    id: z.string(),
    order: z.number(),
    label: text,
    items: z
      .array(
        z.union([
          text.transform((name) => ({ name, detail: undefined, aliases: [] as string[] })),
          z.strictObject({
            name: text,
            detail: text.optional(),
            aliases: z.array(text).default([]),
          }),
        ]),
      )
      .min(1),
  }),
});


const skillWeights = defineCollection({
  loader: file('src/content/skill-weights.yaml', {
    parser: (source) => {
      const data: unknown = parseYaml(source) ?? {};
      if (typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('src/content/skill-weights.yaml 的最外層必須是「專案檔名: { 技術: 數字 }」');
      }
      return Object.entries(data as Record<string, unknown>).map(([id, weights]) => ({ id, weights: weights ?? {} }));
    },
  }),
  schema: z.strictObject({
    id: z.string(),
    weights: z.record(text, z.number().int().min(1).max(5)),
  }),
});


const chapter = z.strictObject({ label: text, title: text, nav: text.optional() });

const site = defineCollection({
  loader: file('src/content/site.yaml', {
    parser: (source) => Object.fromEntries(['zh', 'en'].map((lang) => [lang, localise(parseYaml(source), lang as 'zh' | 'en')])),
  }),
  schema: z.strictObject({
    values: z.strictObject({ years: z.number().int().min(1).max(99) }),

    meta: z.strictObject({ siteName: text, title: text, description: text }),

    nav: z.strictObject({
      label: text,
      menu: text,
      skip: text,
      logo: text,
      home: text,
    }),

    theme: z.strictObject({
      label: text,
      expand: text,
      names: z.strictObject({
        spring: text,
        summer: text,
        autumn: text,
        winter: text,
        shachiku: text,
      }),
    }),

    langSwitch: z.strictObject({ label: text, other: text }),

    hero: z.strictObject({
      label: text,
      display: text,
      name: text,
      role: text,
      tagline: text,
      intro: z.array(text).min(1).max(3),
      facts: z.array(text).min(1),
      stats: z.array(z.strictObject({ value: text, label: text })).length(3),
      factsBesideStats: z.array(text).default([]),
      sideLabel: text,
      featuredLabel: text,
      status: text.optional(),
      actions: z.strictObject({ work: text, cv: text, github: text, linkedin: text }),
    }),

    chapters: z.strictObject({
      work: chapter,
      journey: chapter,
      skills: chapter,
      index: chapter,
      about: chapter,
    }),

    work: z.strictObject({
      readMore: text,
      back: text,
      prev: text,
      next: text,
      filterAll: text,
      filterLabel: text,
      count: text,
      links: z.strictObject({ live: text, github: text, demo: text }),
      categories: z.strictObject({ data: text, fullstack: text, frontend: text, design: text }),
      status: z.strictObject({ live: text, archived: text, internal: text, unpublished: text, research: text }),
      fields: z.strictObject({
        year: text,
        role: text,
        stack: text,
        category: text,
        status: text,
        title: text,
        metrics: text,
      }),
      sections: z.strictObject({ overview: text }),
    }),

    skills: z.strictObject({
      legend: z.strictObject({ caption: text, levels: z.array(text).length(5), practices: text }),
    }),

    journey: z.strictObject({
      eras: z.strictObject({ design: text, frontend: text, data: text }),
      branches: z.strictObject({ art: text, design: text, frontend: text, fullstack: text }),
    }),

    about: z.strictObject({
      bio: z.array(text).min(1),
      educationTitle: text,
      education: z.array(
        z.strictObject({ school: text, degree: text, period: text, note: text.optional() }),
      ),
      awardsTitle: text,
      awards: z.array(
        z.strictObject({ title: text, org: text, date: text, desc: text.optional() }),
      ),
      languagesTitle: text,
      languages: z.array(z.strictObject({ name: text, level: text })),
      contactTitle: text,
      contact: z.strictObject({
        email: text,
        linkedin: text,
        github: text,
      }),
    }),

    footer: z.strictObject({ copyright: text, builtAt: text }),

    notFound: z.strictObject({ title: text, body: text, home: text }),
  }),
});

export const collections = { projects, journeyZh, journeyEn, skills, skillWeights, site };
