import type { GitCommandName } from '../../types'

export type { GitCommandName as CommandKey }

export const COMMANDS_WITH_STEPS: ReadonlySet<GitCommandName> = new Set(['cherry_pick', 'rebase_i', 'rebase', 'merge', 'reset_hard'])

export const matchCommand = (cmd: string): GitCommandName | null => {
  if (cmd.startsWith('git rebase -i')) return 'rebase_i'
  if (cmd.startsWith('git rebase')) return 'rebase'
  if (cmd.startsWith('git checkout -b')) return 'checkout_b'
  if (cmd.startsWith('git checkout')) return 'checkout'
  if (cmd.startsWith('git commit')) return 'commit'
  if (cmd.startsWith('git cherry-pick')) return 'cherry_pick'
  if (cmd.startsWith('git merge')) return 'merge'
  if (cmd.startsWith('git reset --hard')) return 'reset_hard'
  if (cmd === 'git stash pop') return 'stash_pop'
  if (cmd === 'git stash') return 'stash'
  if (cmd === 'git reflog') return 'reflog'
  return null
}
