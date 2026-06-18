import type { GitState } from '../types'

export type ParsedCommand =
  | { action: 'init' }
  | { action: 'makeChanges' }
  | { action: 'stage' }
  | { action: 'commit'; message: string }
  | { action: 'createBranch'; name: string }
  | { action: 'checkout'; target: string }
  | { action: 'cherryPick'; sourceId: string }
  | { action: 'rebase'; onto: string }
  | { action: 'squash'; branchName: string; count: number }
  | { action: 'merge'; source: string }
  | { action: 'resetHard'; targetId: string }
  | { action: 'stash' }
  | { action: 'stashPop' }
  | { action: 'reflog' }
  | { action: 'reflogRecover'; hash: string }

type ParseContext = {
  wip: string | null
  staged: string | null
  stashStack: Array<{ message: string; fromBranch: string }>
}

export const parseInput = (raw: string, gitState: GitState, ctx: ParseContext): ParsedCommand | null => {
  const { branches, commits, HEAD } = gitState
  const cmd = raw.trim()

  if (cmd === 'git init') {
    if (Object.keys(commits).length > 0) return null
    return { action: 'init' }
  }

  if (/^(echo\s+.+|touch\s+\S+|mkdir\s+\S+)/.test(cmd)) {
    if (ctx.wip !== null) return null
    return { action: 'makeChanges' }
  }

  if (cmd === 'git add .') {
    if (ctx.wip === null) return null
    return { action: 'stage' }
  }

  // Allow both double and single quotes; staged prereq removed for command-first flow
  const commitMatch = cmd.match(/^git commit -m ["'](.+)["']$/)
  if (commitMatch) {
    return { action: 'commit', message: commitMatch[1]! }
  }

  // Bare `git commit` — auto-generates a message
  if (cmd === 'git commit') {
    return { action: 'commit', message: '' }
  }

  const checkoutBMatch = cmd.match(/^git (?:checkout -b|switch -c) (\S+)$/)
  if (checkoutBMatch) {
    return { action: 'createBranch', name: checkoutBMatch[1]! }
  }

  const checkoutMatch = cmd.match(/^git (?:checkout|switch) (?!-b|-c)(\S+)$/)
  if (checkoutMatch) {
    const target = checkoutMatch[1]!
    if (!branches[target]) return null
    if (target === HEAD) return null
    return { action: 'checkout', target }
  }

  const cherryPickMatch = cmd.match(/^git cherry-pick (\S+)$/)
  if (cherryPickMatch) {
    const prefix = cherryPickMatch[1]!
    const sourceId = Object.keys(commits).find((id) => id.startsWith(prefix))
    if (!sourceId) return null
    if (commits[sourceId]?.branch === HEAD) return null
    return { action: 'cherryPick', sourceId }
  }

  const rebaseIMatch = cmd.match(/^git rebase -i HEAD~(\d+)$/)
  if (rebaseIMatch) {
    const count = parseInt(rebaseIMatch[1]!, 10)
    if (count < 2) return null
    const featureBranch = Object.keys(branches).find((b) => b !== 'main') ?? HEAD
    return { action: 'squash', branchName: featureBranch, count }
  }

  const rebaseMatch = cmd.match(/^git rebase (?!-i)(\S+)$/)
  if (rebaseMatch) {
    const onto = rebaseMatch[1]!
    if (!branches[onto]) return null
    if (onto === HEAD) return null
    return { action: 'rebase', onto }
  }

  const mergeMatch = cmd.match(/^git merge (\S+)$/)
  if (mergeMatch) {
    const source = mergeMatch[1]!
    if (!branches[source]) return null
    if (source === HEAD) return null
    return { action: 'merge', source }
  }

  const resetHardMatch = cmd.match(/^git reset --hard (\S+)$/)
  if (resetHardMatch) {
    const ref = resetHardMatch[1]!
    const targetId = Object.keys(commits).find((id) => id.startsWith(ref))
    if (!targetId) return null
    return { action: 'resetHard', targetId }
  }

  if (cmd === 'git stash') {
    if (ctx.wip === null) return null
    return { action: 'stash' }
  }

  if (cmd === 'git stash pop') {
    if (ctx.stashStack.length === 0) return null
    return { action: 'stashPop' }
  }

  if (cmd === 'git reflog') {
    return { action: 'reflog' }
  }

  return null
}

const GIT_SUBCOMMANDS = [
  'init',
  'add',
  'commit',
  'checkout',
  'switch',
  'cherry-pick',
  'rebase',
  'merge',
  'reset',
  'stash',
  'reflog',
]

export const computeSuggestions = (input: string, gitState: GitState): string[] => {
  const { branches, commits, HEAD } = gitState
  const branchNames = Object.keys(branches)
  const commitIds = Object.keys(commits)

  // Subcommand suggestions: user is still typing the subcommand after "git "
  if (/^git \S*$/.test(input) && !/ .+ /.test(input)) {
    const prefix = input.slice(4) // strip "git "
    const matches = GIT_SUBCOMMANDS.filter((s) => s.startsWith(prefix) && s !== prefix)
    if (matches.length > 0) return matches
  }

  if (/^git checkout (?!-b)(\S*)$/.test(input)) {
    const prefix = input.replace(/^git checkout /, '')
    return branchNames.filter((b) => b !== HEAD && b.startsWith(prefix))
  }

  if (/^git cherry-pick (\S*)$/.test(input)) {
    const prefix = input.replace(/^git cherry-pick /, '')
    return commitIds
      .filter((id) => id.startsWith(prefix) && commits[id]?.branch !== HEAD)
      .map((id) => id.slice(0, 7))
  }

  if (/^git rebase (?!-i)(\S*)$/.test(input)) {
    const prefix = input.replace(/^git rebase /, '')
    return branchNames.filter((b) => b !== HEAD && b.startsWith(prefix))
  }

  if (/^git merge (\S*)$/.test(input)) {
    const prefix = input.replace(/^git merge /, '')
    return branchNames.filter((b) => b !== HEAD && b.startsWith(prefix))
  }

  if (/^git reset --hard (\S*)$/.test(input)) {
    const prefix = input.replace(/^git reset --hard /, '')
    return commitIds.filter((id) => id.startsWith(prefix)).map((id) => id.slice(0, 7))
  }

  return []
}
