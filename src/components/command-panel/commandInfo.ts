export type CommandKey =
  | 'gitCommit'
  | 'gitCheckoutB'
  | 'gitCheckout'
  | 'gitCherryPick'
  | 'gitRebaseI'
  | 'gitRebase'
  | 'gitMerge'
  | 'gitResetHard'
  | 'gitStashPop'
  | 'gitStash'
  | 'gitReflog';

export const COMMANDS_WITH_STEPS: ReadonlySet<CommandKey> = new Set([
  'gitCherryPick',
  'gitRebaseI',
  'gitRebase',
  'gitMerge',
  'gitResetHard',
]);

export const matchCommand = (cmd: string): CommandKey | null => {
  if (cmd.startsWith('git rebase -i')) return 'gitRebaseI';
  if (cmd.startsWith('git rebase')) return 'gitRebase';
  if (cmd.startsWith('git checkout -b')) return 'gitCheckoutB';
  if (cmd.startsWith('git checkout')) return 'gitCheckout';
  if (cmd.startsWith('git commit')) return 'gitCommit';
  if (cmd.startsWith('git cherry-pick')) return 'gitCherryPick';
  if (cmd.startsWith('git merge')) return 'gitMerge';
  if (cmd.startsWith('git reset --hard')) return 'gitResetHard';
  if (cmd === 'git stash pop') return 'gitStashPop';
  if (cmd === 'git stash') return 'gitStash';
  if (cmd === 'git reflog') return 'gitReflog';
  return null;
};
