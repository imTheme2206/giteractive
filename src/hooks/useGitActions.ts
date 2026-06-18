import type { GitState } from '../types'
import { useGitEngine } from '../store/git-engine-store'
import { useInteraction } from '../store/interaction-store'
import { useModuleFlow } from '../store/module-flow-store'
import { useUIFeedback } from '../store/ui-feedback-store'

const pushSandboxReflog = (state: GitState, message: string) => {
  if (useModuleFlow.getState().mode !== 'sandbox') return
  const hash = state.branches[state.HEAD] ?? state.HEAD
  useGitEngine.getState().pushReflogEntry({ hash, message, headRef: state.HEAD })
}

export const useGitActions = () => ({
  doStageChanges: () => {
    const engine = useGitEngine.getState()
    const before = engine.gitState
    const { wip } = useInteraction.getState()
    const message = wip ?? `feat: new commit ${before.nextCommitNum}`
    useInteraction.getState().setWip(null)
    useInteraction.getState().setStaged(message)
  },

  doAddCommit: (messageOverride?: string) => {
    const engine = useGitEngine.getState()
    engine.saveUndoCheckpoint()
    const before = engine.gitState

    const { staged } = useInteraction.getState()
    // Empty string from bare `git commit` falls through to auto-generated message
    const message = (messageOverride || null) ?? staged ?? `feat: new commit ${before.nextCommitNum}`
    const result = engine.doAddCommit(message)
    if (!result) {
      return
    }
    // When coming from direct command input, clear wip too and use simple log
    if (messageOverride !== undefined) {
      useInteraction.getState().setWip(null)
      useInteraction.getState().setStaged(null)
      useUIFeedback.getState().flashAndLog(result.command, before, result.state)
    } else {
      // Click-based flow: keep the add→commit→push history entries for teaching
      useInteraction.getState().setStaged(null)
      useUIFeedback.getState().flashAndLogCommit(result.command, before.HEAD, before, result.state)
    }
    pushSandboxReflog(result.state, `commit: ${message}`)
    useModuleFlow.getState().checkCompletion('addCommit', result.state)
  },

  doCherryPick: (sourceId: string, targetBranch: string) => {
    useGitEngine.getState().saveUndoCheckpoint()
    const before = useGitEngine.getState().gitState
    const result = useGitEngine.getState().doCherryPick(sourceId, targetBranch)
    if (!result) return
    useUIFeedback.getState().flashAndLog(result.command, before, result.state)
    pushSandboxReflog(result.state, `cherry-pick: ${sourceId}`)
    useModuleFlow.getState().checkCompletion('cherryPick', result.state)
  },

  doRebase: (branch: string, onto: string) => {
    useGitEngine.getState().saveUndoCheckpoint()
    const before = useGitEngine.getState().gitState
    const result = useGitEngine.getState().doRebase(branch, onto)
    if (!result) return
    useUIFeedback.getState().flashAndLog(result.command, before, result.state)
    pushSandboxReflog(result.state, `rebase: rebased ${branch} onto ${onto}`)
    useModuleFlow.getState().checkCompletion('rebase', result.state)
  },

  doMerge: (source: string, target: string) => {
    if (useModuleFlow.getState().mode === 'module6') {
      useInteraction.getState().triggerConflict(source, target)
      return
    }
    useGitEngine.getState().saveUndoCheckpoint()
    const before = useGitEngine.getState().gitState
    const result = useGitEngine.getState().doMerge(source, target)
    if (!result) return
    useUIFeedback.getState().flashAndLog(result.command, before, result.state)
    pushSandboxReflog(result.state, `merge: merged ${source} into ${target}`)
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

    useGitEngine.getState().saveUndoCheckpoint()
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

    pushSandboxReflog(result.state, `checkout: moving to ${target}`)
    useUIFeedback.getState().flashAndLog(result.command, before, result.state)
  },

  doCreateBranch: (commitId: string, branchName?: string) => {
    useGitEngine.getState().saveUndoCheckpoint()
    const before = useGitEngine.getState().gitState
    const result = useGitEngine.getState().doCreateBranch(commitId, branchName)
    if (!result) return
    useUIFeedback.getState().flashAndLog(result.command, before, result.state)
    if (useModuleFlow.getState().mode === 'module2') {
      useModuleFlow.getState().setModuleAttempts((n) => n + 1)
    }
  },

  doResetHard: (targetId: string) => {
    useGitEngine.getState().saveUndoCheckpoint()
    const mode = useModuleFlow.getState().mode
    if (mode === 'module11') {
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
    if (mode === 'sandbox') {
      pushSandboxReflog(result.state, `reset: moving to ${targetId}`)
    }
    useModuleFlow.getState().checkCompletion('resetHard', result.state)
  },

  doSquash: (branch: string, count: number, message: string) => {
    useGitEngine.getState().saveUndoCheckpoint()
    const before = useGitEngine.getState().gitState
    const result = useGitEngine.getState().doSquash(branch, count, message)
    if (!result) return
    useUIFeedback.getState().flashAndLog(result.command, before, result.state)
    useModuleFlow.getState().checkCompletion('squash', result.state)
  },

  doReflogRecover: (hash: string) => {
    useGitEngine.getState().saveUndoCheckpoint()
    const result = useGitEngine.getState().doReflogRecover(hash)
    if (!result) return
    useUIFeedback.getState().flashAndLog(`git reset --hard ${hash}`, result.before, result.after)
    useModuleFlow.getState().checkCompletion('reflogRecover', result.after)
  },

  resolveConflict: (resolution: 'ours' | 'theirs' | 'both') => {
    useGitEngine.getState().saveUndoCheckpoint()
    const { pendingConflictMerge } = useInteraction.getState()
    if (!pendingConflictMerge) return
    const { sourceBranch, targetBranch } = pendingConflictMerge
    const result = useGitEngine.getState().applyMergeResolution(sourceBranch, targetBranch, resolution)
    if (!result) return
    useUIFeedback.getState().flashAndLog(result.command, result.before, result.after)
    useInteraction.getState().clearConflict()
    pushSandboxReflog(result.after, `merge: merged ${sourceBranch} into ${targetBranch}`)
    useModuleFlow.getState().checkCompletion('resolveConflict', result.after)
  },

  doUndo: () => {
    const ok = useGitEngine.getState().undo()
    if (ok) useUIFeedback.getState().setTicker({ command: '', state: 'idle' })
  },

  doRedo: () => {
    const ok = useGitEngine.getState().redo()
    if (ok) useUIFeedback.getState().setTicker({ command: '', state: 'idle' })
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
