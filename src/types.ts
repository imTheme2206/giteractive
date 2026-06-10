export type CommitHash = string

export type CommitNode = {
  id: CommitHash
  parentIds: CommitHash[]
  message: string
  branch?: string
}

export type BranchName = string

export type GitState = {
  commits: Record<CommitHash, CommitNode>
  branches: Record<BranchName, CommitHash>
  HEAD: string // branch name or detached hash
  nextCommitNum: number
}

export type LessonGoal = {
  id: string
  title: string
  description: string
  hint: string
  chips: string[]
  validate: (state: GitState) => boolean
}

export type Mode =
  | 'module0'
  | 'module1'
  | 'module2'
  | 'module3'
  | 'module4'
  | 'module5'
  | 'module6'
  | 'module7'
  | 'module8'
  | 'module9'
  | 'module10'
  | 'module11'
  | 'sandbox'

export type ModuleId =
  | 'module0'
  | 'module1'
  | 'module2'
  | 'module3'
  | 'module4'
  | 'module5'
  | 'module6'
  | 'module7'
  | 'module8'
  | 'module9'
  | 'module10'
  | 'module11'
  | 'sandbox'

export type ConflictState = {
  sourceBranch: string
  targetBranch: string
}
export type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'complete'

export type ModuleProgress = {
  id: ModuleId
  status: ModuleStatus
}

export type TickerState = 'idle' | 'ghost' | 'flash' | 'logged'

export type TickerData = {
  command: string
  subtitle?: string
  state: 'idle' | 'ghost' | 'flash'
}

export type TickerEntry = {
  id: string
  command: string
  timestamp: number
  stateBefore?: GitState
  stateAfter?: GitState
}

export type ReflogEntry = {
  hash: string
  message: string
  headRef: string
}

export type GitCommandName =
  | 'stage'
  | 'commit'
  | 'checkout_b'
  | 'checkout'
  | 'cherry_pick'
  | 'rebase'
  | 'rebase_i'
  | 'merge'
  | 'reset_hard'
  | 'stash'
  | 'stash_pop'
  | 'reflog'
  | 'reflog_recover'

export type GitCommand =
  | { type: 'commit'; message?: string }
  | { type: 'checkout_b' }
  | { type: 'checkout'; target: string }
  | { type: 'cherry_pick'; sourceId: string }
  | { type: 'rebase'; onto: string }
  | { type: 'rebase_i'; branchName: string; count: number }
  | { type: 'merge'; sourceBranch: string }
  | { type: 'reset_hard'; targetId: string }
  | { type: 'stash' }
  | { type: 'stash_pop' }
  | { type: 'reflog' }
  | { type: 'reflog_recover'; hash: string }
