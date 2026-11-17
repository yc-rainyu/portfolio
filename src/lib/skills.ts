/* Weights describe project usage rather than proficiency */
import type { Project, SkillGroup, SkillWeights } from './content';

export interface MatrixRow {
  name: string;
  detail?: string;
  used: boolean[];
  weight: number[];
}

export const DEFAULT_WEIGHT = 3;

export interface SkillMatrix {
  columns: Project[];
  groups: { id: string; label: string; rows: MatrixRow[] }[];
  unmatched: string[];
}

const normalise = (name: string) => name.trim().toLowerCase();

export function buildSkillMatrix(groups: SkillGroup[], projects: Project[], weights: SkillWeights = new Map()): SkillMatrix {
  const lookup = new Map<string, string>();
  const practices = new Set<string>();
  for (const group of groups) {
    for (const item of group.items) {
      const names = [item.name, ...item.aliases];
      for (const name of names) {
        lookup.set(normalise(name), item.name);
        if (group.id === 'practices') practices.add(normalise(name));
      }
    }
  }

  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  for (const [slug, entries] of weights) {
    const project = bySlug.get(slug);
    if (!project) {
      throw new Error(`src/content/skill-weights.yaml 裡的「${slug}」不是任何專案的檔名`);
    }
    const stack = new Set(project.stack.map((t) => t.trim().toLowerCase()));
    for (const tech of Object.keys(entries)) {
      if (!stack.has(normalise(tech)) && !practices.has(normalise(tech))) {
        throw new Error(`src/content/skill-weights.yaml：「${slug}」的 stack 裡沒有「${tech}」，請對照 src/content/projects/zh/${slug}.md`);
      }
    }
  }

  const unmatched = new Set<string>();
  const usedBy = projects.map((project) => {
    const skills = new Map<string, number>();
    const entries = Object.entries(weights.get(project.slug) ?? {}).map(([tech, w]) => [normalise(tech), w] as const);
    const weightOf = new Map(entries);
    for (const tech of project.stack) {
      const skill = lookup.get(normalise(tech));
      if (skill) skills.set(skill, Math.max(skills.get(skill) ?? 0, weightOf.get(normalise(tech)) ?? DEFAULT_WEIGHT));
      else unmatched.add(tech);
    }
    for (const [name, weight] of entries) {
      if (practices.has(name)) {
        const skill = lookup.get(name)!;
        skills.set(skill, Math.max(skills.get(skill) ?? 0, weight));
      }
    }
    return skills;
  });

  const keep = projects.map((_, i) => usedBy[i]!.size > 0);
  const columns = projects.filter((_, i) => keep[i]);
  const columnSkills = usedBy.filter((_, i) => keep[i]);

  return {
    columns,
    groups: groups.map((group) => ({
      id: group.id,
      label: group.label,
      rows: group.items.map((item) => ({
        name: item.name,
        detail: item.detail,
        used: columnSkills.map((skills) => skills.has(item.name)),
        weight: columnSkills.map((skills) => skills.get(item.name) ?? 0),
      })),
    })),
    unmatched: [...unmatched].sort(),
  };
}
