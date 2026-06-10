import { create } from 'zustand'
import type { CommitHash, CommitNode, GitState, ReflogEntry } from '../types'
import * as git from './gitState'

type GitMutation<TArgs extends unknown[]> = (state: GitState, ...args: TArgs) => { state: GitState; command: string } | null

const runMutation = <TArgs extends unknown[]>(
  get: () => GitEngineStore,
  set: (partial: Partial<GitEngineStore>) => void,
  mutation: GitMutation<TArgs>,
  ...args: TArgs
): { state: GitState; command: string } | null => {
  const before = get().gitState
  const result = mutation(before, ...args)
  if (!result) return null
  set({ gitState: result.state })
  return result
}

type GitEngineStore = {
  gitState: GitState
  reflog: ReflogEntry[]
  shadowCommits: Record<CommitHash, CommitNode>
  doStageChanges: () => void
  doAddCommit: (message: string) => { state: GitState; command: string } | null
  doCherryPick: (sourceId: string, targetBranch: string) => { state: GitState; command: string } | null
  doRebase: (branch: string, onto: string) => { state: GitState; command: string } | null
  doMerge: (source: string, target: string) => { state: GitState; command: string } | null
  doCheckout: (target: string) => { state: GitState; command: string } | null
  doCreateBranch: (commitId: string) => { state: GitState; command: string } | null
  doResetHard: (targetId: string) => { state: GitState; command: string } | null
  doSquash: (branch: string, count: number, message: string) => { state: GitState; command: string } | null
  doReflogRecover: (hash: string) => { before: GitState; after: GitState } | null
  applyMergeResolution: (
    source: string,
    target: string,
    resolution: 'ours' | 'theirs' | 'both'
  ) => { before: GitState; after: GitState; command: string } | null
  pushReflogEntry: (entry: ReflogEntry) => void
  unlockSandbox: () => void
  resetToState: (state: GitState, shadow?: Record<string, CommitNode>, reflog?: ReflogEntry[]) => void
}

const isFirstVisit = !localStorage.getItem('giteractive_welcomed')

export const useGitEngine = create<GitEngineStore>((set, get) => ({
  gitState: isFirstVisit ? git.makeModule0State() : git.makeSandboxState(),
  reflog: [],
  shadowCommits: {},
  doStageChanges: () => {
    const before = get().gitState
    const result = git.stageChanges(before)
    if (!result) return null
    set({ gitState: result.state })
    return result
  },
  doAddCommit: (message) => {
    const before = get().gitState
    const result = git.addCommit(before, message)
    if (!result) return null
    set({ gitState: result.state })
    return result
  },

  doCherryPick: (sourceId, targetBranch) => runMutation(get, set, git.cherryPick, sourceId, targetBranch),

  doRebase: (branch, onto) => runMutation(get, set, git.rebase, branch, onto),

  doMerge: (source, target) => runMutation(get, set, git.merge, source, target),

  doCheckout: (target) => {
    const before = get().gitState
    const result = git.checkout(before, target)
    if (!result) return null
    set({ gitState: result.state })
    return result
  },

  doCreateBranch: (commitId) => {
    const branchName = git.getNextBranchName(Object.keys(get().gitState.branches))
    return runMutation(get, set, git.createBranch, commitId, branchName)
  },

  doResetHard: (targetId) => runMutation(get, set, git.resetHard, targetId),

  doSquash: (branch, count, message) => runMutation(get, set, git.squashCommits, branch, count, message),

  doReflogRecover: (hash) => {
    const { shadowCommits } = get()
    if (!shadowCommits[hash]) return null

    const reachableCommits: Record<string, CommitNode> = {}
    const walk = (id: string) => {
      if (reachableCommits[id]) return
      const commit = shadowCommits[id]
      if (!commit) return
      reachableCommits[id] = commit
      commit.parentIds.forEach(walk)
    }
    walk(hash)

    const before = get().gitState
    const after = {
      ...before,
      commits: reachableCommits,
      branches: { ...before.branches, main: hash },
    }
    set({ gitState: after })
    return { before, after }
  },

  applyMergeResolution: (source, target, resolution) => {
    const before = get().gitState
    const result = git.merge(before, source, target)
    if (!result) return null

    const [mergeId, mergeCommit] = Object.entries(result.state.commits).find(([id]) => !before.commits[id]) ?? []
    if (!mergeId || !mergeCommit) return null

    const after = {
      ...result.state,
      commits: {
        ...result.state.commits,
        [mergeId]: {
          ...mergeCommit,
          message: `Merge branch '${source}' into ${target} [resolved: ${resolution}]`,
        },
      },
    }
    set({ gitState: after })
    return {
      before,
      after,
      command: `git merge ${source} # conflict resolved (${resolution})`,
    }
  },

  pushReflogEntry: (entry) => set((s) => ({ reflog: [entry, ...s.reflog] })),

  unlockSandbox: () => {
    set((s) => {
      if (s.gitState.branches['feature']) {
        return { gitState: { ...s.gitState, HEAD: 'main' } }
      }
      return {
        gitState: {
          ...s.gitState,
          commits: {
            ...s.gitState.commits,
            fb1: {
              id: 'fb1',
              parentIds: [s.gitState.branches['main'] ?? 'c3'],
              message: 'feat: feature branch start',
              branch: 'feature',
            },
          },
          branches: { ...s.gitState.branches, feature: 'fb1' },
          HEAD: 'main',
        },
      }
    })
  },

  resetToState: (state, shadow = {}, reflog = []) => set({ gitState: state, shadowCommits: shadow, reflog }),
}))
