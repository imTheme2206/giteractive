import type { GitState } from '../types';

export type LayoutNode = {
  id: string;
  x: number;
  y: number;
  branch: string;
};

export const computeLayout = (gitState: GitState): Map<string, LayoutNode> => {
  const { commits } = gitState;
  const result = new Map<string, LayoutNode>();

  const children = new Map<string, string[]>();
  const allIds = Object.keys(commits);

  for (const id of allIds) {
    const commit = commits[id];
    if (!commit) continue;
    for (const parentId of commit.parentIds) {
      const existing = children.get(parentId) ?? [];
      existing.push(id);
      children.set(parentId, existing);
    }
  }

  // Kahn's algorithm: ensures all parents are processed before children (handles merge commits)
  const inDegree = new Map<string, number>();
  for (const id of allIds) {
    inDegree.set(id, commits[id]?.parentIds.length ?? 0);
  }
  const queue: string[] = allIds.filter(id => (inDegree.get(id) ?? 0) === 0);
  const topoOrder: string[] = [];

  while (queue.length > 0) {
    const id = queue.shift()!;
    topoOrder.push(id);
    for (const childId of (children.get(id) ?? [])) {
      const newDeg = (inDegree.get(childId) ?? 1) - 1;
      inDegree.set(childId, newDeg);
      if (newDeg === 0) queue.push(childId);
    }
  }

  const depth = new Map<string, number>();
  for (const id of topoOrder) {
    const commit = commits[id];
    if (!commit) continue;
    let maxParentDepth = -1;
    for (const pid of commit.parentIds) {
      maxParentDepth = Math.max(maxParentDepth, depth.get(pid) ?? 0);
    }
    depth.set(id, maxParentDepth + 1);
  }

  const laneMap = new Map<string, number>();
  laneMap.set('main', 0);
  let nextLane = 1;

  for (const id of topoOrder) {
    const commit = commits[id];
    if (!commit) continue;
    const br = commit.branch ?? 'main';
    if (!laneMap.has(br)) {
      laneMap.set(br, nextLane++);
    }
  }

  for (const id of topoOrder) {
    const commit = commits[id];
    if (!commit) continue;
    const br = commit.branch ?? 'main';
    const lane = laneMap.get(br) ?? 0;
    const d = depth.get(id) ?? 0;
    result.set(id, {
      id,
      x: 60 + d * 130,
      y: 60 + lane * 120,
      branch: br,
    });
  }

  return result;
};
