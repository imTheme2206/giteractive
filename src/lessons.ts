import type { LessonGoal } from './types';

export const LESSON_LINEAR: LessonGoal = {
  id: 'linear',
  title: 'Level 01 — The Linear Timeline',
  description: 'Add 4 more commits to reach 7 total and see how git builds a linear history.',
  hint: 'Click the + button to add a commit. Watch HEAD and main move forward each time.',
  chips: ['target: 7 commits', 'action: commit'],
  validate: (state) => state.nextCommitNum >= 7,
};

export const LESSON_BRANCH: LessonGoal = {
  id: 'branch',
  title: 'Level 02 — Parallel Universes',
  description: 'Create a new branch and add a commit to it — without touching main.',
  hint: 'Click the ⎇ badge on the HEAD commit to branch, then click + to commit on it.',
  chips: ['action: branch + commit'],
  validate: (state) =>
    Object.entries(state.branches).some(([name, tipId]) => {
      if (name === 'main') return false;
      const tip = state.commits[tipId];
      return tip?.branch === name;
    }),
};

export const LESSON_REBASE: LessonGoal = {
  id: 'rebase',
  title: 'Level 04 — Rebase',
  description: "Move the entire feature branch on top of main's tip — rewriting its history so it looks like it was always based there.",
  hint: "Drag the feature branch label onto main's tip. Watch the commit IDs change — that's history being rewritten.",
  chips: ['onto: main', 'branch: feature'],
  validate: (state) => {
    const mainTip = state.branches['main'];
    const featureTip = state.branches['feature'];
    if (!mainTip || !featureTip || featureTip === mainTip) return false;
    // After rebase, walking back from featureTip must reach mainTip
    const visited = new Set<string>();
    const walk = (id: string): boolean => {
      if (id === mainTip) return true;
      if (visited.has(id)) return false;
      visited.add(id);
      return (state.commits[id]?.parentIds ?? []).some(walk);
    };
    return walk(featureTip);
  },
};

export const LESSON_MERGE: LessonGoal = {
  id: 'merge',
  title: 'Level 05 — Merge',
  description: "Merge the feature branch into main — creating a merge commit that ties both histories together without rewriting any commit IDs.",
  hint: "Drag the feature branch label onto main's branch label badge. Watch the merge commit appear with two parent edges.",
  chips: ['target: main', 'branch: feature', 'result: merge commit'],
  validate: (state) => {
    const mainTip = state.branches['main'];
    if (!mainTip) return false;
    return (state.commits[mainTip]?.parentIds.length ?? 0) >= 2;
  },
};

export const LESSON_RESET: LessonGoal = {
  id: 'reset',
  title: 'Level 07 — git reset',
  description: "Two broken WIP commits slipped onto main. Roll main back to c3 — erasing the broken commits from history.",
  hint: "Hover over c3 and click the ↺ reset button. The broken commits disappear entirely (--hard mode).",
  chips: ['mode: --hard', 'target: c3', 'lost: c4, c5'],
  validate: (state) => {
    const mainTip = state.branches['main'];
    if (!mainTip) return false;
    const reachable = new Set<string>();
    const walk = (id: string) => {
      if (reachable.has(id)) return;
      reachable.add(id);
      state.commits[id]?.parentIds.forEach(walk);
    };
    walk(mainTip);
    return reachable.size <= 3;
  },
};

export const LESSON_STASH: LessonGoal = {
  id: 'stash',
  title: 'Level 08 — git stash',
  description: "You have uncommitted work on feature, but main needs an urgent fix. Stash your WIP, fix main, then pop the stash back on feature.",
  hint: "Click ⬇ Stash to save WIP. Switch to main, add a commit, switch back to feature, then pop the stash.",
  chips: ['stash WIP', 'fix main', 'pop stash'],
  validate: (state) => {
    const mainTip = state.branches['main'];
    return !!mainTip && mainTip !== 'c3';
  },
};

export const LESSON_CONFLICT: LessonGoal = {
  id: 'conflict',
  title: 'Level 06 — Merge Conflicts',
  description: "Both branches edited the same file. Merge feature into main — then resolve the conflict by choosing which version to keep.",
  hint: "Drag the feature branch label onto main's label. An orange flash means conflict detected. Pick a resolution in the modal.",
  chips: ['conflict: greeting.txt', 'resolve: choose version'],
  validate: (state) => {
    const mainTip = state.branches['main'];
    if (!mainTip) return false;
    return (state.commits[mainTip]?.parentIds.length ?? 0) >= 2;
  },
};

export const LESSON_CHERRY_PICK: LessonGoal = {
  id: 'cherry-pick',
  title: 'Level 03 — Cherry-pick',
  description:
    'Move just the f2 commit from feature onto main — without bringing the whole branch along.',
  hint: "Drag the f2 commit node onto c3 (main's tip). The ticker will preview git cherry-pick f2 before you release.",
  chips: ['target: main', 'commits to move: 1'],
  validate: (state) =>
    Object.values(state.commits).some(
      c => c.branch === 'main' && c.message.includes('cherry-pick')
    ),
};

export const LESSON_SQUASH: LessonGoal = {
  id: 'squash',
  title: 'Level 09 — Interactive Squash',
  description: 'Three messy WIP commits are on feature. Squash them into one clean commit before merging.',
  hint: 'Click the ⊕ squash button on the feature branch tip. Watch 3 commits collapse into 1.',
  chips: ['mode: -i squash', 'target: feature', 'before: 3 commits', 'after: 1 commit'],
  validate: (state) => {
    const featureTip = state.branches['feature'];
    if (!featureTip) return false;
    const tip = state.commits[featureTip];
    if (!tip) return false;
    const parent = state.commits[tip.parentIds[0] ?? ''];
    return parent?.id === 'c3' && tip.message.includes('squash');
  },
};

export const LESSON_DETACHED_HEAD: LessonGoal = {
  id: 'detached-head',
  title: 'Level 10 — Detached HEAD',
  description: "Checkout commit c2 directly to explore the past — then reattach HEAD to main to get back to safety.",
  hint: "Click on commit c2 to check it out (HEAD detaches). Then click main's branch label to reattach HEAD.",
  chips: ['step 1: checkout c2', 'step 2: reattach to main'],
  validate: (state) => {
    return state.HEAD === 'main';
  },
};

export const LESSON_REFLOG: LessonGoal = {
  id: 'reflog',
  title: 'Level 11 — Reflog Recovery',
  description: "You accidentally reset --hard to c3, losing c4 and c5. Use the reflog to find and restore the lost commits.",
  hint: "Click the reflog entry for c5 to run git reset --hard c5. The lost commits come back!",
  chips: ['lost: c4, c5', 'tool: git reflog', 'action: reset --hard <hash>'],
  validate: (state) => {
    const mainTip = state.branches['main'];
    return mainTip === 'c5';
  },
};
