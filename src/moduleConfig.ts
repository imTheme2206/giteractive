import { MODULE_REGISTRY } from './moduleRegistry';
import type { LessonGoal, ModuleId } from './types';

export const MODULE_IDS: ModuleId[] = Object.keys(MODULE_REGISTRY) as ModuleId[];

export const MODULE_ACCENT: Record<ModuleId, string> = Object.fromEntries(
  Object.entries(MODULE_REGISTRY).map(([id, def]) => [id, def.accent])
) as Record<ModuleId, string>;

export const MODULE_LESSONS: Partial<Record<ModuleId, LessonGoal>> = Object.fromEntries(
  Object.entries(MODULE_REGISTRY)
    .filter(([, def]) => def.lesson)
    .map(([id, def]) => [id, def.lesson])
);

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
