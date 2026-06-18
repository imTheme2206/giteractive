import type { CommitHash, CommitNode, GitState } from '../types'

export const makeModule0State = (): GitState => ({
  commits: {},
  branches: { main: '' },
  HEAD: 'main',
  nextCommitNum: 1,
})

export const makeModuleState = (): GitState => ({
  commits: {
    c1: {
      id: 'c1',
      parentIds: [],
      message: 'init: initial commit',
      branch: 'main',
    },
    c2: {
      id: 'c2',
      parentIds: ['c1'],
      message: 'feat: add readme',
      branch: 'main',
    },
    c3: {
      id: 'c3',
      parentIds: ['c2'],
      message: 'feat: setup project',
      branch: 'main',
    },
  },
  branches: { main: 'c3' },
  HEAD: 'main',
  nextCommitNum: 4,
})

export const makeModule3State = (): GitState => ({
  commits: {
    c1: {
      id: 'c1',
      parentIds: [],
      message: 'init: initial commit',
      branch: 'main',
    },
    c2: {
      id: 'c2',
      parentIds: ['c1'],
      message: 'feat: add readme',
      branch: 'main',
    },
    c3: {
      id: 'c3',
      parentIds: ['c2'],
      message: 'feat: setup project',
      branch: 'main',
    },
    f1: {
      id: 'f1',
      parentIds: ['c2'],
      message: 'feat: add login page',
      branch: 'feature',
    },
    f2: {
      id: 'f2',
      parentIds: ['f1'],
      message: 'feat: add dashboard',
      branch: 'feature',
    },
  },
  branches: { main: 'c3', feature: 'f2' },
  HEAD: 'main',
  nextCommitNum: 4,
})

// Modules 4 and 5 start from the same diverged graph as module 3
export const makeModule4State = makeModule3State
export const makeModule5State = makeModule3State

// Module 6: same topology but both branches touch "greeting" — signals a conflict
export const makeModule6State = (): GitState => ({
  commits: {
    c1: {
      id: 'c1',
      parentIds: [],
      message: 'init: initial commit',
      branch: 'main',
    },
    c2: {
      id: 'c2',
      parentIds: ['c1'],
      message: 'feat: add readme',
      branch: 'main',
    },
    c3: {
      id: 'c3',
      parentIds: ['c2'],
      message: 'fix: update greeting text',
      branch: 'main',
    },
    f1: {
      id: 'f1',
      parentIds: ['c2'],
      message: 'feat: add login page',
      branch: 'feature',
    },
    f2: {
      id: 'f2',
      parentIds: ['f1'],
      message: 'feat: update greeting for devs',
      branch: 'feature',
    },
  },
  branches: { main: 'c3', feature: 'f2' },
  HEAD: 'main',
  nextCommitNum: 4,
})

export const makeModule7State = (): GitState => ({
  commits: {
    c1: {
      id: 'c1',
      parentIds: [],
      message: 'init: initial commit',
      branch: 'main',
    },
    c2: {
      id: 'c2',
      parentIds: ['c1'],
      message: 'feat: add readme',
      branch: 'main',
    },
    c3: {
      id: 'c3',
      parentIds: ['c2'],
      message: 'feat: setup project',
      branch: 'main',
    },
    c4: {
      id: 'c4',
      parentIds: ['c3'],
      message: 'wip: broken experiment',
      branch: 'main',
    },
    c5: {
      id: 'c5',
      parentIds: ['c4'],
      message: 'wip: still broken',
      branch: 'main',
    },
  },
  branches: { main: 'c5' },
  HEAD: 'main',
  nextCommitNum: 6,
})

export const makeModule8State = (): GitState => ({
  commits: {
    c1: {
      id: 'c1',
      parentIds: [],
      message: 'init: initial commit',
      branch: 'main',
    },
    c2: {
      id: 'c2',
      parentIds: ['c1'],
      message: 'feat: add readme',
      branch: 'main',
    },
    c3: {
      id: 'c3',
      parentIds: ['c2'],
      message: 'feat: setup project',
      branch: 'main',
    },
    f1: {
      id: 'f1',
      parentIds: ['c2'],
      message: 'feat: start feature',
      branch: 'feature',
    },
    f2: {
      id: 'f2',
      parentIds: ['f1'],
      message: 'feat: implement ui',
      branch: 'feature',
    },
  },
  branches: { main: 'c3', feature: 'f2' },
  HEAD: 'feature',
  nextCommitNum: 4,
})

export const makeModule9State = (): GitState => ({
  commits: {
    c1: {
      id: 'c1',
      parentIds: [],
      message: 'init: initial commit',
      branch: 'main',
    },
    c2: {
      id: 'c2',
      parentIds: ['c1'],
      message: 'feat: add readme',
      branch: 'main',
    },
    c3: {
      id: 'c3',
      parentIds: ['c2'],
      message: 'feat: setup project',
      branch: 'main',
    },
    f1: {
      id: 'f1',
      parentIds: ['c3'],
      message: 'wip: start login',
      branch: 'feature',
    },
    f2: {
      id: 'f2',
      parentIds: ['f1'],
      message: 'wip: fix typo',
      branch: 'feature',
    },
    f3: {
      id: 'f3',
      parentIds: ['f2'],
      message: 'wip: cleanup',
      branch: 'feature',
    },
  },
  branches: { main: 'c3', feature: 'f3' },
  HEAD: 'feature',
  nextCommitNum: 4,
})

// All 5 commits exist in the reflog/shadow; the visible state starts after an accidental reset to c3
export const makeModule11ShadowCommits = () => ({
  c1: {
    id: 'c1',
    parentIds: [] as string[],
    message: 'init: initial commit',
    branch: 'main',
  },
  c2: {
    id: 'c2',
    parentIds: ['c1'],
    message: 'feat: add readme',
    branch: 'main',
  },
  c3: {
    id: 'c3',
    parentIds: ['c2'],
    message: 'feat: setup project',
    branch: 'main',
  },
  c4: {
    id: 'c4',
    parentIds: ['c3'],
    message: 'feat: add login',
    branch: 'main',
  },
  c5: {
    id: 'c5',
    parentIds: ['c4'],
    message: 'feat: add dashboard',
    branch: 'main',
  },
})

export const makeModule11State = (): GitState => ({
  commits: {
    c1: {
      id: 'c1',
      parentIds: [],
      message: 'init: initial commit',
      branch: 'main',
    },
    c2: {
      id: 'c2',
      parentIds: ['c1'],
      message: 'feat: add readme',
      branch: 'main',
    },
    c3: {
      id: 'c3',
      parentIds: ['c2'],
      message: 'feat: setup project',
      branch: 'main',
    },
  },
  branches: { main: 'c3' },
  HEAD: 'main',
  nextCommitNum: 6,
})

export const resetHard = (state: GitState, targetId: CommitHash): { state: GitState; command: string } | null => {
  const branch = state.HEAD
  if (!state.branches[branch]) return null

  const newBranches = { ...state.branches, [branch]: targetId }

  const reachable = new Set<string>()
  const walk = (id: string) => {
    if (reachable.has(id)) return
    reachable.add(id)
    state.commits[id]?.parentIds.forEach(walk)
  }
  Object.values(newBranches).forEach((tip) => walk(tip))

  const newCommits: typeof state.commits = {}
  for (const [id, commit] of Object.entries(state.commits)) {
    if (reachable.has(id)) newCommits[id] = commit
  }

  return {
    state: { ...state, commits: newCommits, branches: newBranches },
    command: `git reset --hard ${targetId}`,
  }
}

export const makeSandboxState = (): GitState => {
  const base = makeModuleState()
  return {
    ...base,
    commits: {
      ...base.commits,
      fb1: {
        id: 'fb1',
        parentIds: ['c2'],
        message: 'feat: start feature',
        branch: 'feature',
      },
    },
    branches: { ...base.branches, feature: 'fb1' },
  }
}

export const stageChanges = (state: GitState): { state: GitState; command: string } | null => {
  return {
    state: { ...state, HEAD: state.HEAD },
    command: `git add .`,
  }
}

export const checkout = (state: GitState, target: string): { state: GitState; command: string } | null => {
  if (target === state.HEAD) return null
  if (state.branches[target] === undefined && state.commits[target] === undefined) return null
  return {
    state: { ...state, HEAD: target },
    command: `git checkout ${target}`,
  }
}

export const getNextBranchName = (existingBranches: string[]): string => {
  let name = 'feature'
  let n = 2
  while (existingBranches.includes(name)) {
    name = `feature${n++}`
  }
  return name
}

export const createBranch = (state: GitState, commitId: CommitHash, branchName: string): { state: GitState; command: string } => ({
  state: {
    ...state,
    branches: { ...state.branches, [branchName]: commitId },
    HEAD: branchName,
  },
  command: `git checkout -b ${branchName} ${commitId}`,
})

export const addCommit = (state: GitState, overrideMessage?: string): { state: GitState; command: string } => {
  const id = Math.random().toString(36).slice(2, 9)
  const msg = overrideMessage ?? `feat: new commit ${state.nextCommitNum}`
  const branchTip = state.branches[state.HEAD]
  const isRoot = branchTip === '' || branchTip === undefined
  const headCommit = isRoot ? null : (branchTip ?? state.HEAD)
  const currentBranch = state.branches[state.HEAD] !== undefined ? state.HEAD : null
  const newCommit = {
    id,
    parentIds: headCommit ? [headCommit] : [],
    message: msg,
    branch: currentBranch ?? 'main',
  }
  return {
    state: {
      ...state,
      commits: { ...state.commits, [id]: newCommit },
      branches: currentBranch ? { ...state.branches, [currentBranch]: id } : state.branches,
      nextCommitNum: state.nextCommitNum + 1,
    },
    command: `git commit -m "${msg}"`,
  }
}

export const cherryPick = (state: GitState, sourceId: CommitHash, targetBranch: string): { state: GitState; command: string } | null => {
  const source = state.commits[sourceId]
  if (!source) return null
  const targetTip = state.branches[targetBranch]
  if (!targetTip) return null
  const newId = Math.random().toString(36).slice(2, 9)
  const newCommit = {
    id: newId,
    parentIds: [targetTip],
    message: `${source.message} (cherry-pick)`,
    branch: targetBranch,
  }
  return {
    state: {
      ...state,
      commits: { ...state.commits, [newId]: newCommit },
      branches: { ...state.branches, [targetBranch]: newId },
    },
    command: `git cherry-pick ${sourceId}`,
  }
}

export const merge = (state: GitState, sourceBranch: string, targetBranch: string): { state: GitState; command: string } | null => {
  if (sourceBranch === targetBranch) return null
  const sourceTip = state.branches[sourceBranch]
  const targetTip = state.branches[targetBranch]
  if (!sourceTip || !targetTip) return null
  const newId = Math.random().toString(36).slice(2, 9)
  return {
    state: {
      ...state,
      commits: {
        ...state.commits,
        [newId]: {
          id: newId,
          parentIds: [targetTip, sourceTip],
          message: `Merge branch '${sourceBranch}' into ${targetBranch}`,
          branch: targetBranch,
        },
      },
      branches: { ...state.branches, [targetBranch]: newId },
    },
    command: `git merge ${sourceBranch}`,
  }
}

export const rebase = (state: GitState, branchToRebase: string, ontoBranch: string): { state: GitState; command: string } | null => {
  if (branchToRebase === ontoBranch) return null
  const ontoTip = state.branches[ontoBranch]
  const rebaseTip = state.branches[branchToRebase]
  if (!ontoTip || !rebaseTip) return null

  const ontoAncestors = new Set<string>()
  const walkOnto = (id: string) => {
    if (ontoAncestors.has(id)) return
    ontoAncestors.add(id)
    state.commits[id]?.parentIds.forEach(walkOnto)
  }
  walkOnto(ontoTip)

  const uniqueCommits: CommitHash[] = []
  const walkRebase = (id: string) => {
    if (ontoAncestors.has(id)) return
    uniqueCommits.unshift(id)
    state.commits[id]?.parentIds.forEach(walkRebase)
  }
  walkRebase(rebaseTip)

  if (uniqueCommits.length === 0) return null

  let newCommits = { ...state.commits }
  let currentParent = ontoTip

  for (const oldId of uniqueCommits) {
    const newId = Math.random().toString(36).slice(2, 9)
    const oldCommit = newCommits[oldId]
    if (!oldCommit) continue
    newCommits = {
      ...newCommits,
      [newId]: {
        id: newId,
        parentIds: [currentParent],
        message: oldCommit.message,
        branch: branchToRebase,
      },
    }
    currentParent = newId
  }

  for (const oldId of uniqueCommits) {
    delete newCommits[oldId]
  }

  return {
    state: {
      ...state,
      commits: newCommits,
      branches: { ...state.branches, [branchToRebase]: currentParent },
      HEAD: state.HEAD === branchToRebase ? branchToRebase : state.HEAD,
    },
    command: `git rebase ${ontoBranch}`,
  }
}

export const squashCommits = (
  state: GitState,
  branchName: string,
  count: number,
  newMessage: string
): { state: GitState; command: string } | null => {
  const branchTip = state.branches[branchName]
  if (!branchTip || count < 2) return null

  const commitsToSquash: string[] = []
  let currentId: string | undefined = branchTip

  for (let i = 0; i < count; i++) {
    if (!currentId) return null
    const commit: CommitNode | undefined = state.commits[currentId]
    if (!commit) return null
    commitsToSquash.unshift(currentId)
    currentId = commit.parentIds[0]
  }

  const baseParentId = currentId
  if (!baseParentId) return null

  const newId = Math.random().toString(36).slice(2, 9)
  const newCommit = {
    id: newId,
    parentIds: [baseParentId],
    message: newMessage,
    branch: branchName,
  }

  const newBranches = { ...state.branches, [branchName]: newId }

  const reachable = new Set<string>()
  const walk = (id: string) => {
    if (reachable.has(id)) return
    reachable.add(id)
    state.commits[id]?.parentIds.forEach(walk)
  }
  Object.values(newBranches).forEach((tip) => walk(tip))

  const newCommits: typeof state.commits = {}
  for (const [id, commit] of Object.entries(state.commits)) {
    if (reachable.has(id)) newCommits[id] = commit
  }

  newCommits[newId] = newCommit

  return {
    state: { ...state, commits: newCommits, branches: newBranches },
    command: `git rebase -i HEAD~${count}`,
  }
}

export const makeModule10State = (): GitState => ({
  commits: {
    c1: {
      id: 'c1',
      parentIds: [],
      message: 'init: initial commit',
      branch: 'main',
    },
    c2: {
      id: 'c2',
      parentIds: ['c1'],
      message: 'feat: add readme',
      branch: 'main',
    },
    c3: {
      id: 'c3',
      parentIds: ['c2'],
      message: 'feat: setup project',
      branch: 'main',
    },
    c4: {
      id: 'c4',
      parentIds: ['c3'],
      message: 'feat: add login',
      branch: 'main',
    },
  },
  branches: { main: 'c4' },
  HEAD: 'main',
  nextCommitNum: 5,
})

export const reattachHead = (state: GitState, branchName: string): { state: GitState; command: string } | null => {
  if (!state.branches[branchName]) return null
  if (state.HEAD === branchName) return null
  return {
    state: { ...state, HEAD: branchName },
    command: `git checkout ${branchName}`,
  }
}
