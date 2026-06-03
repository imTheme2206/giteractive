import type { GitState } from '../../types';

export type DiffLine = {
  kind: 'added' | 'removed' | 'unchanged';
  text: string;
};

export const diffStates = (before: GitState | undefined, after: GitState | undefined): DiffLine[] => {
  if (!before || !after) return [];

  const lines: DiffLine[] = [];

  const allBranches = new Set([...Object.keys(before.branches), ...Object.keys(after.branches)]);
  for (const branch of allBranches) {
    const tipBefore = before.branches[branch];
    const tipAfter = after.branches[branch];
    if (tipBefore === tipAfter) {
      if (tipBefore) lines.push({ kind: 'unchanged', text: `${branch} → ${tipBefore}` });
    } else if (!tipBefore) {
      lines.push({ kind: 'added', text: `${branch} → ${tipAfter}` });
    } else if (!tipAfter) {
      lines.push({ kind: 'removed', text: `${branch} → ${tipBefore}` });
    } else {
      lines.push({ kind: 'removed', text: `${branch} → ${tipBefore}` });
      lines.push({ kind: 'added', text: `${branch} → ${tipAfter}` });
    }
  }

  const addedCommits = Object.keys(after.commits).filter(id => !before.commits[id]);
  const removedCommits = Object.keys(before.commits).filter(id => !after.commits[id]);

  for (const id of removedCommits) {
    const c = before.commits[id];
    if (c) lines.push({ kind: 'removed', text: `commit ${id}: ${c.message}` });
  }
  for (const id of addedCommits) {
    const c = after.commits[id];
    if (c) lines.push({ kind: 'added', text: `commit ${id}: ${c.message}` });
  }

  if (before.HEAD !== after.HEAD) {
    lines.push({ kind: 'removed', text: `HEAD → ${before.HEAD}` });
    lines.push({ kind: 'added', text: `HEAD → ${after.HEAD}` });
  }

  return lines;
};
