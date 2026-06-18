import type { LessonGoal } from './types'

export const LESSON_INIT: LessonGoal = {
  id: 'init',
  title: 'Level 00 — Your First Commit',
  description: 'You have an empty repository. Make your first commit to start tracking history.',
  hint: 'Type `git commit -m "init: first commit"` in the terminal below and press Enter.',
  chips: ['action: first commit'],
  command: 'git commit -m "init: first commit"',
  validate: (state) => Object.keys(state.commits).length >= 1,
}

export const LESSON_LINEAR: LessonGoal = {
  id: 'linear',
  title: 'Level 01 — The Linear Timeline',
  description: 'Add 4 more commits to reach 7 total and see how git builds a linear history.',
  hint: 'Type `git commit -m "feat: ..."` in the terminal below. Repeat until you reach 7 commits.',
  chips: ['target: 7 commits', 'action: commit'],
  command: 'git commit -m "feat: update"',
  validate: (state) => state.nextCommitNum >= 7,
}

export const LESSON_BRANCH: LessonGoal = {
  id: 'branch',
  title: 'Level 02 — Parallel Universes',
  description: 'Create a new branch and add a commit to it — without touching main.',
  hint: 'Type `git checkout -b feature` to create a branch, then `git commit -m "feat: ..."` on it.',
  chips: ['action: branch + commit'],
  command: 'git checkout -b feature',
  validate: (state) =>
    Object.entries(state.branches).some(([name, tipId]) => {
      if (name === 'main') return false
      const tip = state.commits[tipId]
      return tip?.branch === name
    }),
}

export const LESSON_REBASE: LessonGoal = {
  id: 'rebase',
  title: 'Level 04 — Rebase',
  description: "Move the entire feature branch on top of main's tip — rewriting its history so it looks like it was always based there.",
  hint: "First `git checkout feature`, then type `git rebase main`. Watch commit IDs change — that's history being rewritten.",
  chips: ['onto: main', 'branch: feature'],
  command: 'git rebase main',
  validate: (state) => {
    const mainTip = state.branches['main']
    const featureTip = state.branches['feature']
    if (!mainTip || !featureTip || featureTip === mainTip) return false
    // After rebase, walking back from featureTip must reach mainTip
    const visited = new Set<string>()
    const walk = (id: string): boolean => {
      if (id === mainTip) return true
      if (visited.has(id)) return false
      visited.add(id)
      return (state.commits[id]?.parentIds ?? []).some(walk)
    }
    return walk(featureTip)
  },
}

export const LESSON_MERGE: LessonGoal = {
  id: 'merge',
  title: 'Level 05 — Merge',
  description:
    'Merge the feature branch into main — creating a merge commit that ties both histories together without rewriting any commit IDs.',
  hint: "Switch to main (`git checkout main`), then type `git merge feature`. Watch the merge commit appear with two parent edges.",
  chips: ['target: main', 'branch: feature', 'result: merge commit'],
  command: 'git merge feature',
  validate: (state) => {
    const mainTip = state.branches['main']
    if (!mainTip) return false
    return (state.commits[mainTip]?.parentIds.length ?? 0) >= 2
  },
}

export const LESSON_RESET: LessonGoal = {
  id: 'reset',
  title: 'Level 07 — git reset',
  description: 'Two broken WIP commits slipped onto main. Roll main back to c3 — erasing the broken commits from history.',
  hint: 'Type `git reset --hard c3`. The broken commits disappear entirely.',
  chips: ['mode: --hard', 'target: c3', 'lost: c4, c5'],
  command: 'git reset --hard c3',
  validate: (state) => {
    const mainTip = state.branches['main']
    if (!mainTip) return false
    const reachable = new Set<string>()
    const walk = (id: string) => {
      if (reachable.has(id)) return
      reachable.add(id)
      state.commits[id]?.parentIds.forEach(walk)
    }
    walk(mainTip)
    return reachable.size <= 3
  },
}

export const LESSON_STASH: LessonGoal = {
  id: 'stash',
  title: 'Level 08 — git stash',
  description:
    'You have uncommitted work on feature, but main needs an urgent fix. Stash your WIP, fix main, then pop the stash back on feature.',
  hint: 'Type `git stash`, then `git checkout main`, then `git commit -m "fix: hotfix"`, then `git checkout feature`, then `git stash pop`.',
  chips: ['stash WIP', 'fix main', 'pop stash'],
  command: 'git stash',
  validate: (state) => {
    const mainTip = state.branches['main']
    return !!mainTip && mainTip !== 'c3'
  },
}

export const LESSON_CONFLICT: LessonGoal = {
  id: 'conflict',
  title: 'Level 06 — Merge Conflicts',
  description: 'Both branches edited the same file. Merge feature into main — then resolve the conflict by choosing which version to keep.',
  hint: "Switch to main (`git checkout main`), then type `git merge feature`. An orange flash means conflict — pick a resolution in the modal.",
  chips: ['conflict: greeting.txt', 'resolve: choose version'],
  command: 'git merge feature',
  validate: (state) => {
    const mainTip = state.branches['main']
    if (!mainTip) return false
    return (state.commits[mainTip]?.parentIds.length ?? 0) >= 2
  },
}

export const LESSON_CHERRY_PICK: LessonGoal = {
  id: 'cherry-pick',
  title: 'Level 03 — Cherry-pick',
  description: 'Move just the f2 commit from feature onto main — without bringing the whole branch along.',
  hint: "Switch to main (`git checkout main`), then type `git cherry-pick f2`. The f2 commit is copied onto main.",
  chips: ['target: main', 'commits to move: 1'],
  command: 'git cherry-pick f2',
  validate: (state) => Object.values(state.commits).some((c) => c.branch === 'main' && c.message.includes('cherry-pick')),
}

export const LESSON_SQUASH: LessonGoal = {
  id: 'squash',
  title: 'Level 09 — Interactive Squash',
  description: 'Three messy WIP commits are on feature. Squash them into one clean commit before merging.',
  hint: 'Type `git rebase -i HEAD~3` to squash the 3 WIP commits on feature into one clean commit.',
  chips: ['mode: -i squash', 'target: feature', 'before: 3 commits', 'after: 1 commit'],
  command: 'git rebase -i HEAD~3',
  validate: (state) => {
    const featureTip = state.branches['feature']
    if (!featureTip) return false
    const tip = state.commits[featureTip]
    if (!tip) return false
    const parent = state.commits[tip.parentIds[0] ?? '']
    return parent?.id === 'c3' && tip.message.includes('squash')
  },
}

export const LESSON_DETACHED_HEAD: LessonGoal = {
  id: 'detached-head',
  title: 'Level 10 — Detached HEAD',
  description: 'Checkout commit c2 directly to explore the past — then reattach HEAD to main to get back to safety.',
  hint: "Type `git checkout c2` to detach HEAD, then `git checkout main` to reattach.",
  chips: ['step 1: checkout c2', 'step 2: reattach to main'],
  command: 'git checkout c2',
  validate: (state) => {
    return state.HEAD === 'main'
  },
}

export const LESSON_REFLOG: LessonGoal = {
  id: 'reflog',
  title: 'Level 11 — Reflog Recovery',
  description: 'You accidentally reset --hard to c3, losing c4 and c5. Use the reflog to find and restore the lost commits.',
  hint: 'Type `git reflog` to see the history, then `git reset --hard c5` to restore the lost commits.',
  chips: ['lost: c4, c5', 'tool: git reflog', 'action: reset --hard <hash>'],
  command: 'git reset --hard c5',
  validate: (state) => {
    const mainTip = state.branches['main']
    return mainTip === 'c5'
  },
}
