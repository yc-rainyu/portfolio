import type { JourneyItem } from './content';

export const branchOrder = ['art', 'design', 'frontend', 'fullstack'] as const;
export type Branch = (typeof branchOrder)[number];
export type LaneBranch = Branch | 'main';

export interface LaneLine {
  lane: number;
  branch: LaneBranch;
  older: boolean;
  newer: boolean;
}

export interface JourneyRow {
  item: JourneyItem;
  branch: Branch;
  lane: number;
  startsBranch: boolean;
  forkFromLane?: number;
  merges: { branch: Branch; lane: number; into: LaneBranch; intoLane: number }[];
  lines: LaneLine[];
}

export interface JourneyGraph {
  rows: JourneyRow[];
  lanes: number;
}

export function buildJourneyGraph(items: JourneyItem[]): JourneyGraph {
  const last = items.length - 1;
  const first = new Map<Branch, number>();
  const mergedAt = new Map<Branch, number>();

  items.forEach((item, i) => {
    if (!first.has(item.branch)) first.set(item.branch, i);
    for (const branch of [...item.merges, ...item.joins]) {
      if (branch === item.branch) throw new Error(`歷程資料：第 ${i + 1} 筆不能合併自己所在的分支`);
      if (mergedAt.has(branch)) throw new Error(`歷程資料：分支 ${branch} 被合併了兩次（第 ${i + 1} 筆）`);
      mergedAt.set(branch, i);
    }
  });

  const end = (branch: Branch) => mergedAt.get(branch) ?? last;

  items.forEach((item, i) => {
    const starts = first.get(item.branch) === i;
    if (item.from && !starts) {
      throw new Error(`歷程資料：第 ${i + 1} 筆寫了 from，但 ${item.branch} 分支在前面已經開始了`);
    }
    if (item.from) {
      const parentStart = first.get(item.from);
      if (parentStart === undefined || parentStart >= i || end(item.from) < i) {
        throw new Error(`歷程資料：第 ${i + 1} 筆要從 ${item.from} 分出來，但那條分支在這裡不存在`);
      }
    }
    for (const branch of [...item.merges, ...item.joins]) {
      const start = first.get(branch);
      if (start === undefined || start >= i) {
        throw new Error(`歷程資料：第 ${i + 1} 筆要合併 ${branch}，但那條分支還沒開始`);
      }
    }
    const merged = mergedAt.get(item.branch);
    if (merged !== undefined && merged <= i) {
      throw new Error(`歷程資料：第 ${i + 1} 筆在 ${item.branch} 分支上，但那條分支已經被合併了`);
    }
  });

  // Reuse a lane only when the full branch interval is free
  const lane = new Map<Branch, number>();
  const started = [...first.entries()].sort((a, b) => a[1] - b[1]);
  for (const [branch, start] of started) {
    const parent = items[start]!.from;
    const parentLane = parent ? (lane.get(parent) ?? 0) : 0;
    const taken = new Set<number>();
    for (const [other, otherLane] of lane) {
      if (first.get(other)! <= end(branch) && start <= end(other)) taken.add(otherLane);
    }
    let best = 0;
    for (let candidate = 1; candidate <= lane.size + 1; candidate++) {
      if (taken.has(candidate)) continue;
      if (best === 0 || Math.abs(candidate - parentLane) < Math.abs(best - parentLane)) best = candidate;
    }
    lane.set(branch, best);
  }

  const rows = items.map((item, i): JourneyRow => {
    const starts = first.get(item.branch) === i;
    const lines: LaneLine[] = [{ lane: 0, branch: 'main', older: true, newer: true }];
    for (const [branch, start] of first) {
      if (start > i || end(branch) < i) continue;
      lines.push({
        lane: lane.get(branch)!,
        branch,
        older: i > start,
        newer: mergedAt.has(branch) ? i < end(branch) : true,
      });
    }
    return {
      item,
      branch: item.branch,
      lane: lane.get(item.branch)!,
      startsBranch: starts,
      forkFromLane: starts ? (item.from ? lane.get(item.from)! : 0) : undefined,
      merges: [
        ...item.merges.map((branch) => ({ branch, lane: lane.get(branch)!, into: 'main' as const, intoLane: 0 })),
        ...item.joins.map((branch) => ({
          branch,
          lane: lane.get(branch)!,
          into: item.branch,
          intoLane: lane.get(item.branch)!,
        })),
      ],
      lines,
    };
  });

  return { rows, lanes: 1 + Math.max(0, ...lane.values()) };
}
