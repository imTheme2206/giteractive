import type { GitState, CommitHash } from './types';

export const makeModuleState = (): GitState => ({
  commits: {
    c1: { id: 'c1', parentIds: [], message: 'init: initial commit', branch: 'main' },
    c2: { id: 'c2', parentIds: ['c1'], message: 'feat: add readme', branch: 'main' },
    c3: { id: 'c3', parentIds: ['c2'], message: 'feat: setup project', branch: 'main' },
  },
  branches: { main: 'c3' },
  HEAD: 'main',
  nextCommitNum: 4,
});

export const makeModule3State = (): GitState => ({
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
});

// Modules 4 and 5 start from the same diverged graph as module 3
export const makeModule4State = makeModule3State;
export const makeModule5State = makeModule3State;

// Module 6: same topology but both branches touch "greeting" — signals a conflict
export const makeModule6State = (): GitState => ({
  commits: {
    c1: { id: 'c1', parentIds: [], message: 'init: initial commit', branch: 'main' },
    c2: { id: 'c2', parentIds: ['c1'], message: 'feat: add readme', branch: 'main' },
    c3: { id: 'c3', parentIds: ['c2'], message: 'fix: update greeting text', branch: 'main' },
    f1: { id: 'f1', parentIds: ['c2'], message: 'feat: add login page', branch: 'feature' },
    f2: { id: 'f2', parentIds: ['f1'], message: 'feat: update greeting for devs', branch: 'feature' },
  },
  branches: { main: 'c3', feature: 'f2' },
  HEAD: 'main',
  nextCommitNum: 4,
});

export const makeModule7State = (): GitState => ({
  commits: {
    c1: { id: 'c1', parentIds: [], message: 'init: initial commit', branch: 'main' },
    c2: { id: 'c2', parentIds: ['c1'], message: 'feat: add readme', branch: 'main' },
    c3: { id: 'c3', parentIds: ['c2'], message: 'feat: setup project', branch: 'main' },
    c4: { id: 'c4', parentIds: ['c3'], message: 'wip: broken experiment', branch: 'main' },
    c5: { id: 'c5', parentIds: ['c4'], message: 'wip: still broken', branch: 'main' },
  },
  branches: { main: 'c5' },
  HEAD: 'main',
  nextCommitNum: 6,
});

export const makeModule8State = (): GitState => ({
  commits: {
    c1: { id: 'c1', parentIds: [], message: 'init: initial commit', branch: 'main' },
    c2: { id: 'c2', parentIds: ['c1'], message: 'feat: add readme', branch: 'main' },
    c3: { id: 'c3', parentIds: ['c2'], message: 'feat: setup project', branch: 'main' },
    f1: { id: 'f1', parentIds: ['c2'], message: 'feat: start feature', branch: 'feature' },
    f2: { id: 'f2', parentIds: ['f1'], message: 'feat: implement ui', branch: 'feature' },
  },
  branches: { main: 'c3', feature: 'f2' },
  HEAD: 'feature',
  nextCommitNum: 4,
});

export const resetHard = (
  state: GitState,
  targetId: CommitHash
): { state: GitState; command: string } | null => {
  const branch = state.HEAD;
  if (!state.branches[branch]) return null;

  const newBranches = { ...state.branches, [branch]: targetId };

  const reachable = new Set<string>();
  const walk = (id: string) => {
    if (reachable.has(id)) return;
    reachable.add(id);
    state.commits[id]?.parentIds.forEach(walk);
  };
  Object.values(newBranches).forEach(tip => walk(tip));

  const newCommits: typeof state.commits = {};
  for (const [id, commit] of Object.entries(state.commits)) {
    if (reachable.has(id)) newCommits[id] = commit;
  }

  return {
    state: { ...state, commits: newCommits, branches: newBranches },
    command: `git reset --hard ${targetId}`,
  };
};

export const makeSandboxState = (): GitState => {
  const base = makeModuleState();
  return {
    ...base,
    commits: {
      ...base.commits,
      fb1: { id: 'fb1', parentIds: ['c2'], message: 'feat: start feature', branch: 'feature' },
    },
    branches: { ...base.branches, feature: 'fb1' },
  };
};

export const checkout = (
  state: GitState,
  target: string
): { state: GitState; command: string } | null => {
  if (target === state.HEAD) return null;
  if (state.branches[target] === undefined && state.commits[target] === undefined) return null;
  return {
    state: { ...state, HEAD: target },
    command: `git checkout ${target}`,
  };
};

export const getNextBranchName = (existingBranches: string[]): string => {
  let name = 'feature';
  let n = 2;
  while (existingBranches.includes(name)) {
    name = `feature${n++}`;
  }
  return name;
};

export const createBranch = (
  state: GitState,
  commitId: CommitHash,
  branchName: string
): { state: GitState; command: string } => ({
  state: {
    ...state,
    branches: { ...state.branches, [branchName]: commitId },
    HEAD: branchName,
  },
  command: `git checkout -b ${branchName} ${commitId}`,
});

export const addCommit = (state: GitState): { state: GitState; command: string } => {
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
};

export const cherryPick = (
  state: GitState,
  sourceId: CommitHash,
  targetBranch: string
): { state: GitState; command: string } | null => {
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
};

export const merge = (
  state: GitState,
  sourceBranch: string,
  targetBranch: string
): { state: GitState; command: string } | null => {
  if (sourceBranch === targetBranch) return null;
  const sourceTip = state.branches[sourceBranch];
  const targetTip = state.branches[targetBranch];
  if (!sourceTip || !targetTip) return null;
  const newId = Math.random().toString(36).slice(2, 9);
  return {
    state: {
      ...state,
      commits: {
        ...state.commits,
        [newId]: {
          id: newId,
          parentIds: [targetTip, sourceTip],
          message: `Merge branch '${sourceBranch}' into ${targetBranch}`,
          branch: targetBranch,
        },
      },
      branches: { ...state.branches, [targetBranch]: newId },
    },
    command: `git merge ${sourceBranch}`,
  };
};

export const rebase = (
  state: GitState,
  branchToRebase: string,
  ontoBranch: string
): { state: GitState; command: string } | null => {
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
};
