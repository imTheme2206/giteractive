import type { LessonGoal, GitState } from './types';

export const LESSON_CHERRY_PICK: LessonGoal = {
  id: 'cherry-pick',
  title: 'Level 03 — Cherry-pick',
  description:
    'Move just the f2 commit from feature onto main — without bringing the whole branch along.',
  hint: 'Drag the f2 commit node onto c3 (main\'s tip). The ticker will preview git cherry-pick f2 before you release.',
  chips: ['target: main', 'commits to move: 1'],
  validate: (state: GitState) =>
    Object.values(state.commits).some(
      c => c.branch === 'main' && c.message.includes('cherry-pick')
    ),
};
