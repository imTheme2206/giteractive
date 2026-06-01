import type { GitState, CommitHash } from './types';

// Shared clean starting state for all guided modules (main only, no branches)
export function makeModuleState(): GitState {
  return {
    commits: {
      c1: { id: 'c1', parentIds: [], message: 'init: initial commit', branch: 'main' },
      c2: { id: 'c2', parentIds: ['c1'], message: 'feat: add readme', branch: 'main' },
      c3: { id: 'c3', parentIds: ['c2'], message: 'feat: setup project', branch: 'main' },
    },
    branches: { main: 'c3' },
    HEAD: 'main',
    nextCommitNum: 4,
  };
}

// Module 3 state: main + feature with two commits, set up for cherry-pick lesson
export function makeModule3State(): GitState {
  return {
    commits: {
      c1: { id: 'c1', parentIds: [], message: 'init: initial commit', branch: 'main' },
      c2: { id: 'c2', parentIds: ['c1'], message: 'feat: add readme', branch: 'main' },
      c3: { id: 'c3', parentIds: ['c2'], message: 'feat: setup project', branch: 'main' },
      f1: { id: 'f1', parentIds: ['c2'], message: 'feat: add login page', branch: 'feature' },
      f2: { id: 'f2', parentIds: ['f1'], message: 'feat: add dashboard', branch: 'feature' },
    },
    branches: { main: 'c3', feature: 'f2' },
    HEAD: 'main',
    nextCommitNum: 4,
  };
}

export function makeSandboxState(): GitState {
  const base = makeModuleState();
  return {
    ...base,
    commits: {
      ...base.commits,
      fb1: { id: 'fb1', parentIds: ['c2'], message: 'feat: start feature', branch: 'feature' },
    },
    branches: { ...base.branches, feature: 'fb1' },
  };
}

export function getNextBranchName(existingBranches: string[]): string {
  let name = 'feature';
  let n = 2;
  while (existingBranches.includes(name)) {
    name = `feature${n++}`;
  }
  return name;
}

export function createBranch(
  state: GitState,
  commitId: CommitHash,
  branchName: string
): { state: GitState; command: string } {
  return {
    state: {
      ...state,
      branches: { ...state.branches, [branchName]: commitId },
      HEAD: branchName,
    },
    command: `git checkout -b ${branchName} ${commitId}`,
  };
}

export function addCommit(state: GitState): { state: GitState; command: string } {
  const id = Math.random().toString(36).slice(2, 9);
  const msg = `feat: new commit ${state.nextCommitNum}`;
  const headCommit =
    state.branches[state.HEAD] !== undefined
      ? state.branches[state.HEAD] ?? state.HEAD
      : state.HEAD;
  const currentBranch = state.branches[state.HEAD] !== undefined ? state.HEAD : null;
  const newCommit = { id, parentIds: [headCommit], message: msg, branch: currentBranch ?? 'main' };
  return {
    state: {
      ...state,
      commits: { ...state.commits, [id]: newCommit },
      branches: currentBranch
        ? { ...state.branches, [currentBranch]: id }
        : state.branches,
      nextCommitNum: state.nextCommitNum + 1,
    },
    command: `git commit -m "${msg}"`,
  };
}

export function cherryPick(
  state: GitState,
  sourceId: CommitHash,
  targetBranch: string
): { state: GitState; command: string } | null {
  const source = state.commits[sourceId];
  if (!source) return null;
  const targetTip = state.branches[targetBranch];
  if (!targetTip) return null;
  const newId = Math.random().toString(36).slice(2, 9);
  const newCommit = {
    id: newId,
    parentIds: [targetTip],
    message: source.message + ' (cherry-pick)',
    branch: targetBranch,
  };
  return {
    state: {
      ...state,
      commits: { ...state.commits, [newId]: newCommit },
      branches: { ...state.branches, [targetBranch]: newId },
    },
    command: `git cherry-pick ${sourceId}`,
  };
}

export function rebase(
  state: GitState,
  branchToRebase: string,
  ontoBranch: string
): { state: GitState; command: string } | null {
  if (branchToRebase === ontoBranch) return null;
  const ontoTip = state.branches[ontoBranch];
  const rebaseTip = state.branches[branchToRebase];
  if (!ontoTip || !rebaseTip) return null;

  const ontoAncestors = new Set<string>();
  const walkOnto = (id: string) => {
    if (ontoAncestors.has(id)) return;
    ontoAncestors.add(id);
    state.commits[id]?.parentIds.forEach(walkOnto);
  };
  walkOnto(ontoTip);

  const uniqueCommits: CommitHash[] = [];
  const walkRebase = (id: string) => {
    if (ontoAncestors.has(id)) return;
    uniqueCommits.unshift(id);
    state.commits[id]?.parentIds.forEach(walkRebase);
  };
  walkRebase(rebaseTip);

  if (uniqueCommits.length === 0) return null;

  let newCommits = { ...state.commits };
  let currentParent = ontoTip;

  for (const oldId of uniqueCommits) {
    const newId = Math.random().toString(36).slice(2, 9);
    const oldCommit = newCommits[oldId];
    if (!oldCommit) continue;
    newCommits = {
      ...newCommits,
      [newId]: {
        id: newId,
        parentIds: [currentParent],
        message: oldCommit.message,
        branch: branchToRebase,
      },
    };
    currentParent = newId;
  }

  for (const oldId of uniqueCommits) {
    delete newCommits[oldId];
  }

  return {
    state: {
      ...state,
      commits: newCommits,
      branches: { ...state.branches, [branchToRebase]: currentParent },
      HEAD: state.HEAD === branchToRebase ? branchToRebase : state.HEAD,
    },
    command: `git rebase ${ontoBranch}`,
  };
}
