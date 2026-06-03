import type { CommandKey } from '../components/command-panel/commandInfo';
import type { GitState, ModuleId } from '../types';

const ALL_KEYS: CommandKey[] = [
  'gitCommit', 'gitCheckoutB', 'gitCheckout', 'gitCherryPick',
  'gitRebaseI', 'gitRebase', 'gitMerge', 'gitResetHard',
  'gitStashPop', 'gitStash', 'gitReflog',
];

const MODULE_ALLOWED: Record<ModuleId, CommandKey[]> = {
  module0: ['gitCommit'],
  module1: ['gitCommit'],
  module2: ['gitCheckoutB', 'gitCommit'],
  module3: ['gitCherryPick'],
  module4: ['gitRebase'],
  module5: ['gitMerge'],
  module6: ['gitMerge'],
  module7: ['gitResetHard'],
  module8: ['gitStash', 'gitCheckout', 'gitStashPop'],
  module9: ['gitRebaseI'],
  module10: ['gitCheckout'],
  module11: ['gitReflog', 'gitResetHard'],
  sandbox: ALL_KEYS,
};

const MODULE_STATIC: Partial<Record<ModuleId, string[]>> = {
  module0: ['git init', 'git add .'],
};

function generateCommand(
  key: CommandKey,
  mode: ModuleId,
  gitState: GitState,
  wip: string | null,
  stashStack: Array<{ message: string; fromBranch: string }>,
): string[] {
  const { branches, HEAD, commits } = gitState;
  const otherBranches = Object.keys(branches).filter(b => b !== HEAD);

  switch (key) {
    case 'gitCommit':
      if (wip === null) return [];
      return [`git commit -m "${wip}"`];

    case 'gitCheckoutB':
      return ['git checkout -b feature'];

    case 'gitCheckout':
      return otherBranches.map(b => `git checkout ${b}`);

    case 'gitCherryPick': {
      const source = otherBranches[0];
      if (!source) return [];
      const hash = branches[source];
      if (!hash) return [];
      return [`git cherry-pick ${hash}`];
    }

    case 'gitRebase':
      return ['git rebase main'];

    case 'gitRebaseI': {
      const mainTip = branches['main'];
      if (!mainTip) return ['git rebase -i HEAD~3'];
      const mainCommits = new Set<string>();
      let cur: string | undefined = mainTip;
      while (cur) {
        mainCommits.add(cur);
        cur = commits[cur]?.parentIds[0];
      }
      const featureTip = branches[HEAD];
      if (!featureTip) return [];
      let count = 0;
      cur = featureTip;
      while (cur && !mainCommits.has(cur)) {
        count++;
        cur = commits[cur]?.parentIds[0];
      }
      if (count < 2) return [];
      return [`git rebase -i HEAD~${count}`];
    }

    case 'gitMerge':
      if (otherBranches.length === 0) return [];
      return otherBranches.map(b => `git merge ${b}`);

    case 'gitResetHard': {
      if (mode === 'module11') return ['git reset --hard <hash>'];
      const tipHash = branches[HEAD];
      if (!tipHash) return [];
      const parent = commits[tipHash]?.parentIds[0];
      if (!parent) return [];
      return [`git reset --hard ${parent}`];
    }

    case 'gitStash':
      if (wip === null) return [];
      return ['git stash'];

    case 'gitStashPop':
      if (stashStack.length === 0) return [];
      return ['git stash pop'];

    case 'gitReflog':
      return ['git reflog'];
  }
}

export function deriveCommands(
  mode: ModuleId,
  gitState: GitState,
  wip: string | null,
  stashStack: Array<{ message: string; fromBranch: string }>,
): string[] {
  const statics = MODULE_STATIC[mode] ?? [];
  const dynamic = MODULE_ALLOWED[mode].flatMap(key =>
    generateCommand(key, mode, gitState, wip, stashStack)
  );
  return [...statics, ...dynamic];
}
