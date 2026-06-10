import { useGitEngine } from '../store/git-engine-store'
import { useInteraction } from '../store/interaction-store'
import { useModuleFlow } from '../store/module-flow-store'
import { useUIFeedback } from '../store/ui-feedback-store'

export const useGitActions = () => ({
  doAddCommit: () => {
    const { wip } = useInteraction.getState()
    const engine = useGitEngine.getState()
    const before = engine.gitState
    const message = wip ?? `feat: new commit ${before.nextCommitNum}`
    const result = engine.doAddCommit(message)
    if (!result) return
    useInteraction.getState().setWip(null)
    useUIFeedback.getState().flashAndLogCommit(result.command, before.HEAD, before, result.state)
    useModuleFlow.getState().checkCompletion('addCommit', result.state)
  },

  doCherryPick: (sourceId: string, targetBranch: string) => {
    const before = useGitEngine.getState().gitState
    const result = useGitEngine.getState().doCherryPick(sourceId, targetBranch)
    if (!result) return
    useUIFeedback.getState().flashAndLog(result.command, before, result.state)
    useModuleFlow.getState().checkCompletion('cherryPick', result.state)
  },

  doRebase: (branch: string, onto: string) => {
    const before = useGitEngine.getState().gitState
    const result = useGitEngine.getState().doRebase(branch, onto)
    if (!result) return
    useUIFeedback.getState().flashAndLog(result.command, before, result.state)
    useModuleFlow.getState().checkCompletion('rebase', result.state)
  },

  doMerge: (source: string, target: string) => {
    if (useModuleFlow.getState().mode === 'module6') {
      useInteraction.getState().triggerConflict(source, target)
      return
    }
    const before = useGitEngine.getState().gitState
    const result = useGitEngine.getState().doMerge(source, target)
    if (!result) return
    useUIFeedback.getState().flashAndLog(result.command, before, result.state)
    useModuleFlow.getState().checkCompletion('merge', result.state)
  },

  doCheckout: (target: string) => {
    const { mode } = useModuleFlow.getState()
    const { wip, hasDetached } = useInteraction.getState()

    if (wip && mode === 'module8') {
      useUIFeedback.getState().setTicker({
        command: '⚠  Stash your work first: git stash',
        state: 'flash',
      })
      return
    }

    const before = useGitEngine.getState().gitState
    const result = useGitEngine.getState().doCheckout(target)
    if (!result) return

    if (mode === 'module10') {
      const isDetaching = !before.branches[target]
      if (isDetaching) useInteraction.getState().setHasDetached(true)
      useUIFeedback.getState().flashAndLog(result.command, before, result.state)
      if (hasDetached && target === 'main') {
        useModuleFlow.getState().checkCompletion('checkout', result.state)
      }
      return
    }

    useUIFeedback.getState().flashAndLog(result.command, before, result.state)
  },

  doCreateBranch: (commitId: string) => {
    const before = useGitEngine.getState().gitState
    const result = useGitEngine.getState().doCreateBranch(commitId)
    if (!result) return
    useUIFeedback.getState().flashAndLog(result.command, before, result.state)
    if (useModuleFlow.getState().mode === 'module2') {
      useModuleFlow.getState().setModuleAttempts((n) => n + 1)
    }
  },

  doResetHard: (targetId: string) => {
    if (useModuleFlow.getState().mode === 'module11') {
      useGitEngine.getState().pushReflogEntry({
        hash: targetId,
        message: `reset: moving to ${targetId}`,
        headRef: 'main',
      })
    }
    const before = useGitEngine.getState().gitState
    const result = useGitEngine.getState().doResetHard(targetId)
    if (!result) return
    useUIFeedback.getState().flashAndLog(result.command, before, result.state)
    useModuleFlow.getState().checkCompletion('resetHard', result.state)
  },

  doSquash: (branch: string, count: number, message: string) => {
    const before = useGitEngine.getState().gitState
    const result = useGitEngine.getState().doSquash(branch, count, message)
    if (!result) return
    useUIFeedback.getState().flashAndLog(result.command, before, result.state)
    useModuleFlow.getState().checkCompletion('squash', result.state)
  },

  doReflogRecover: (hash: string) => {
    const result = useGitEngine.getState().doReflogRecover(hash)
    if (!result) return
    useUIFeedback.getState().flashAndLog(`git reset --hard ${hash}`, result.before, result.after)
    useModuleFlow.getState().checkCompletion('reflogRecover', result.after)
  },

  resolveConflict: (resolution: 'ours' | 'theirs' | 'both') => {
    const { pendingConflictMerge } = useInteraction.getState()
    if (!pendingConflictMerge) return
    const { sourceBranch, targetBranch } = pendingConflictMerge
    const result = useGitEngine.getState().applyMergeResolution(sourceBranch, targetBranch, resolution)
    if (!result) return
    useUIFeedback.getState().flashAndLog(result.command, result.before, result.after)
    useInteraction.getState().clearConflict()
    useModuleFlow.getState().checkCompletion('resolveConflict', result.after)
  },

  doStartWip: () => {
    const { nextCommitNum } = useGitEngine.getState().gitState
    useInteraction.getState().setWip(`feat: new commit ${nextCommitNum}`)
  },

  doStash: () => {
    const { wip } = useInteraction.getState()
    if (!wip) return
    const { gitState } = useGitEngine.getState()
    useInteraction.getState().pushStash(wip, gitState.HEAD)
    useUIFeedback.getState().flashAndLog('git stash', gitState, gitState)
  },

  doStashPop: () => {
    const top = useInteraction.getState().popStash()
    if (!top) return
    const { gitState } = useGitEngine.getState()
    useUIFeedback.getState().flashAndLog('git stash pop', gitState, gitState)
    useModuleFlow.getState().checkCompletion('stashPop', gitState)
  },
})
