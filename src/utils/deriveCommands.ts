import type { GitCommandName, GitState, ModuleId } from '../types'

const ALL_KEYS: GitCommandName[] = [
  'commit',
  'checkout_b',
  'checkout',
  'cherry_pick',
  'rebase_i',
  'rebase',
  'merge',
  'reset_hard',
  'stash_pop',
  'stash',
  'reflog',
]

const MODULE_ALLOWED: Record<ModuleId, GitCommandName[]> = {
  module0: ['commit'],
  module1: ['commit'],
  module2: ['checkout_b', 'commit'],
  module3: ['cherry_pick'],
  module4: ['checkout', 'rebase'],
  module5: ['merge'],
  module6: ['merge'],
  module7: ['reset_hard'],
  module8: ['stash', 'checkout', 'stash_pop', 'commit'],
  module9: ['rebase_i'],
  module10: ['checkout'],
  module11: ['reflog', 'reset_hard'],
  sandbox: ALL_KEYS,
}

const MODULE_STATIC: Partial<Record<ModuleId, string[]>> = {
  module0: ['git init', 'git add .'],
}

function generateCommand(
  key: GitCommandName,
  mode: ModuleId,
  gitState: GitState,
  wip: string | null,
  stashStack: Array<{ message: string; fromBranch: string }>
): string[] {
  const { branches, HEAD, commits } = gitState
  const otherBranches = Object.keys(branches).filter((b) => b !== HEAD)

  switch (key) {
    case 'commit':
      if (wip === null) return []
      return [`git commit -m "${wip}"`]

    case 'checkout_b':
      return ['git checkout -b feature']

    case 'checkout':
      return otherBranches.map((b) => `git checkout ${b}`)

    case 'cherry_pick': {
      const source = otherBranches[0]
      if (!source) return []
      const hash = branches[source]
      if (!hash) return []
      return [`git cherry-pick ${hash}`]
    }

    case 'rebase':
      if (HEAD === 'main') return []
      return ['git rebase main']

    case 'rebase_i': {
      const mainTip = branches['main']
      if (!mainTip) return ['git rebase -i HEAD~3']
      const mainCommits = new Set<string>()
      let cur: string | undefined = mainTip
      while (cur) {
        mainCommits.add(cur)
        cur = commits[cur]?.parentIds[0]
      }
      const featureTip = branches[HEAD]
      if (!featureTip) return []
      let count = 0
      cur = featureTip
      while (cur && !mainCommits.has(cur)) {
        count++
        cur = commits[cur]?.parentIds[0]
      }
      if (count < 2) return []
      return [`git rebase -i HEAD~${count}`]
    }

    case 'merge':
      if (otherBranches.length === 0) return []
      return otherBranches.map((b) => `git merge ${b}`)

    case 'reset_hard': {
      if (mode === 'module11') return ['git reset --hard <hash>']
      const tipHash = branches[HEAD]
      if (!tipHash) return []
      const parent = commits[tipHash]?.parentIds[0]
      if (!parent) return []
      return [`git reset --hard ${parent}`]
    }

    case 'stash':
      if (wip === null) return []
      return ['git stash']

    case 'stash_pop':
      if (stashStack.length === 0) return []
      return ['git stash pop']

    case 'reflog':
      return ['git reflog']

    default:
      return []
  }
}

export function deriveCommands(
  mode: ModuleId,
  gitState: GitState,
  wip: string | null,
  stashStack: Array<{ message: string; fromBranch: string }>
): string[] {
  const statics = MODULE_STATIC[mode] ?? []
  const dynamic = MODULE_ALLOWED[mode].flatMap((key) => generateCommand(key, mode, gitState, wip, stashStack))
  return [...statics, ...dynamic]
}
