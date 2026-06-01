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
