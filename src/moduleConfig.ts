import {
  LESSON_BRANCH,
  LESSON_CHERRY_PICK,
  LESSON_CONFLICT,
  LESSON_DETACHED_HEAD,
  LESSON_INIT,
  LESSON_LINEAR,
  LESSON_MERGE,
  LESSON_REBASE,
  LESSON_REFLOG,
  LESSON_RESET,
  LESSON_SQUASH,
  LESSON_STASH,
} from './lessons';
import type { LessonGoal, ModuleId } from './types';

export const MODULE_IDS: ModuleId[] = [
  'module0',
  'module1',
  'module2',
  'module3',
  'module4',
  'module5',
  'module6',
  'module7',
  'module8',
  'module9',
  'module10',
  'module11',
  'sandbox',
];

export const MODULE_ACCENT: Record<ModuleId, string> = {
  module0: 'var(--ok)',
  module1: 'var(--ok)',
  module2: 'var(--feat)',
  module3: 'var(--ok)',
  module4: 'var(--head)',
  module5: 'var(--ok)',
  module6: 'var(--conflict)',
  module7: 'var(--head)',
  module8: 'var(--feat)',
  module9: 'var(--feat)',
  module10: 'var(--head)',
  module11: 'var(--ok)',
  sandbox: 'var(--feat)',
};

export const MODULE_LESSONS: Partial<Record<string, LessonGoal>> = {
  module0: LESSON_INIT,
  module1: LESSON_LINEAR,
  module2: LESSON_BRANCH,
  module3: LESSON_CHERRY_PICK,
  module4: LESSON_REBASE,
  module5: LESSON_MERGE,
  module6: LESSON_CONFLICT,
  module7: LESSON_RESET,
  module8: LESSON_STASH,
  module9: LESSON_SQUASH,
  module10: LESSON_DETACHED_HEAD,
  module11: LESSON_REFLOG,
};

export const getCommandType = (command: string): string | null => {
  if (command.startsWith('git add')) return null;
  if (command.startsWith('git push')) return null;
  if (command.startsWith('git pull')) return null;
  if (command.startsWith('git checkout -b')) return 'checkout-b';
  if (command.startsWith('git checkout') && !command.includes('-b')) return 'checkout';
  if (command.startsWith('git commit')) return 'commit';
  if (command.startsWith('git cherry-pick')) return 'cherry-pick';
  if (command.startsWith('git rebase -i')) return 'squash';
  if (command.startsWith('git rebase')) return 'rebase';
  if (command.startsWith('git merge')) return 'merge';
  if (command.startsWith('git reset')) return 'reset';
  if (command.startsWith('git stash')) return command.includes('pop') ? 'stash-pop' : 'stash';
  return null;
};
