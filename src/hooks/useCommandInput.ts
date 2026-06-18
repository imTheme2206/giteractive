import { useCallback, useMemo, useState } from 'react'
import type { GitState } from '../types'
import { computeSuggestions, parseInput, type ParsedCommand } from '../utils/parseInput'

type GitActions = {
  doStartWip: () => void
  doStageChanges: () => void
  doAddCommit: (messageOverride?: string) => void
  doCreateBranch: (commitId: string, branchName?: string) => void
  doCheckout: (target: string) => void
  doCherryPick: (sourceId: string, targetBranch: string) => void
  doRebase: (branch: string, onto: string) => void
  doMerge: (source: string, target: string) => void
  doResetHard: (targetId: string) => void
  doStash: () => void
  doStashPop: () => void
  doSquash: (branchName: string, count: number, message: string) => void
  doReflogRecover: (hash: string) => void
}

type Params = {
  gitState: GitState
  actions: GitActions
  staged: string | null
  wip: string | null
  stashStack: Array<{ message: string; fromBranch: string }>
  onReflog: () => void
  onInit: () => void
}

const executeCommand = (parsed: ParsedCommand, gitState: GitState, actions: GitActions, onReflog: () => void, onInit: () => void) => {
  const { HEAD, branches } = gitState

  switch (parsed.action) {
    case 'init':
      onInit()
      break
    case 'makeChanges':
      actions.doStartWip()
      break
    case 'stage':
      actions.doStageChanges()
      break
    case 'commit':
      actions.doAddCommit(parsed.message)
      break
    case 'createBranch': {
      const headTip = branches[HEAD] ?? HEAD
      actions.doCreateBranch(headTip, parsed.name)
      break
    }
    case 'checkout':
      actions.doCheckout(parsed.target)
      break
    case 'cherryPick':
      actions.doCherryPick(parsed.sourceId, HEAD)
      break
    case 'rebase':
      actions.doRebase(HEAD, parsed.onto)
      break
    case 'squash':
      actions.doSquash(parsed.branchName, parsed.count, 'feat: squashed')
      break
    case 'merge':
      actions.doMerge(parsed.source, HEAD)
      break
    case 'resetHard':
      actions.doResetHard(parsed.targetId)
      break
    case 'stash':
      actions.doStash()
      break
    case 'stashPop':
      actions.doStashPop()
      break
    case 'reflog':
      onReflog()
      break
    case 'reflogRecover':
      actions.doReflogRecover(parsed.hash)
      break
  }
}

export const useCommandInput = ({ gitState, actions, staged, wip, stashStack, onReflog, onInit }: Params) => {
  const [inputValue, setInputValue] = useState('')
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(-1)

  const ctx = useMemo(() => ({ wip, staged, stashStack }), [wip, staged, stashStack])

  const parsed = useMemo(() => parseInput(inputValue, gitState, ctx), [inputValue, gitState, ctx])
  const isValid = parsed !== null

  const suggestions = useMemo(() => computeSuggestions(inputValue, gitState), [inputValue, gitState])

  const handleChange = useCallback((val: string) => {
    setInputValue(val)
    setActiveSuggestionIdx(-1)
  }, [])

  const acceptSuggestion = useCallback(
    (suggestion: string) => {
      // Replace the last space-separated token (which may be empty if input ends with space)
      const lastSpace = inputValue.lastIndexOf(' ')
      const base = lastSpace >= 0 ? inputValue.slice(0, lastSpace + 1) : ''
      setInputValue(base + suggestion)
      setActiveSuggestionIdx(-1)
    },
    [inputValue]
  )

  const handleSubmit = useCallback(() => {
    if (!parsed) return
    executeCommand(parsed, gitState, actions, onReflog, onInit)
    setInputValue('')
    setActiveSuggestionIdx(-1)
  }, [parsed, gitState, actions, onReflog, onInit])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (activeSuggestionIdx >= 0 && suggestions[activeSuggestionIdx]) {
          acceptSuggestion(suggestions[activeSuggestionIdx]!)
        } else {
          handleSubmit()
        }
        return
      }

      if (e.key === 'Tab') {
        e.preventDefault()
        if (suggestions.length === 0) return
        if (activeSuggestionIdx >= 0 && suggestions[activeSuggestionIdx]) {
          acceptSuggestion(suggestions[activeSuggestionIdx]!)
        } else {
          acceptSuggestion(suggestions[0]!)
        }
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (suggestions.length > 0) setActiveSuggestionIdx((prev) => (prev + 1) % suggestions.length)
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (suggestions.length > 0) setActiveSuggestionIdx((prev) => (prev - 1 + suggestions.length) % suggestions.length)
        return
      }

      if (e.key === 'Escape') {
        setInputValue('')
        setActiveSuggestionIdx(-1)
        return
      }
    },
    [suggestions, activeSuggestionIdx, acceptSuggestion, handleSubmit]
  )

  const pasteCommand = useCallback((cmd: string) => {
    setInputValue(cmd)
    setActiveSuggestionIdx(-1)
  }, [])

  return {
    inputValue,
    suggestions,
    activeSuggestionIdx,
    isValid,
    parsed,
    handleChange,
    handleKeyDown,
    handleSubmit,
    pasteCommand,
    acceptSuggestion,
  }
}
