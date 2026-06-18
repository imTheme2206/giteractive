import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CommandHistoryTab } from './components/command-history/CommandHistoryTab'
import { CommandPanel } from './components/command-panel/CommandPanel'
import { CommandTicker } from './components/CommandTicker'
import { Toast } from './components/common/Toast'
import { DocsPanel } from './components/docs/DocsPanel'
import { ExplainerCard } from './components/ExplainerCard'
import { GitCanvas } from './components/GitCanvas'
import { GoalCard } from './components/GoalCard'
import { ConflictModal } from './components/modal/ConflictModal'
import { IntroModal } from './components/modal/IntroModal'
import { LevelCompleteOverlay } from './components/modal/LevelCompleteOverlay'
import { ReflogPanel } from './components/ReflogPanel'
import { Sidebar } from './components/sidebar/Sidebar'
import { SidebarPanel } from './components/sidebar/SidebarPanel'
import { Toolbar } from './components/toolbar/Toolbar'
import { WelcomeOverlay } from './components/WelcomeOverlay'
import { useCommandInput } from './hooks/useCommandInput'
import { useDocsPanelResize } from './hooks/useDocsPanelResize'
import { useExplainerCommand } from './hooks/useExplainerCommand'
import { useGitActions } from './hooks/useGitActions'
import { useModuleCompletion } from './hooks/useModuleCompletion'
import { useUIPreferences } from './hooks/useUIPreferences'
import { MODULE_REGISTRY } from './moduleRegistry'
import { useGitEngine } from './store/git-engine-store'
import { useInteraction } from './store/interaction-store'
import { useModuleFlow } from './store/module-flow-store'
import { useUIFeedback } from './store/ui-feedback-store'
import type { ModuleId } from './types'
import { deriveCommands } from './utils/deriveCommands'

export const App = () => {
  const engine = useGitEngine()
  const moduleFlow = useModuleFlow()
  const feedback = useUIFeedback()
  const interaction = useInteraction()
  const actions = useGitActions()

  const { t } = useTranslation()
  const { sidebarOpen, setSidebarOpen } = useUIPreferences()
  const [highlightNodeIds, setHighlightNodeIds] = useState<string[]>([])
  const [pendingModule, setPendingModule] = useState<ModuleId | null>(null)
  const [activeTab, setActiveTab] = useState<'graph' | 'history'>('graph')

  const { docsOpen, docsPanelWidth, toggleDocs, onResizeMouseDown } = useDocsPanelResize()
  const { explainerCommand, explainerKey, dismissExplainer } = useExplainerCommand(feedback.ticker)
  const { toastModuleId, levelCompleteId, justUnlockedId, dismissToast, dismissLevelComplete } = useModuleCompletion(
    moduleFlow.showCompletionOverlay,
    moduleFlow.isFirstCompletion,
    moduleFlow.mode
  )

  const currentLesson = MODULE_REGISTRY[moduleFlow.mode]?.lesson
  const currentComplete = moduleFlow.moduleProgress.find((p) => p.id === moduleFlow.mode)?.status === 'complete'

  const handleReflog = () => {
    feedback.setTicker({ command: 'git reflog', state: 'flash' })
    setTimeout(() => feedback.setTicker({ command: '', state: 'idle' }), 1200)
  }

  const handleInit = () => {
    feedback.flashAndLog('git init', engine.gitState, engine.gitState)
  }

  const commandInput = useCommandInput({
    gitState: engine.gitState,
    actions,
    staged: interaction.staged,
    wip: interaction.wip,
    stashStack: interaction.stashStack,
    onReflog: handleReflog,
    onInit: handleInit,
  })

  const enterModule = (id: ModuleId) => {
    const def = MODULE_REGISTRY[id]
    moduleFlow.setMode(id)
    moduleFlow.dismissOverlay()
    moduleFlow.setModuleAttempts(0)
    moduleFlow.setModuleGuided(true)
    moduleFlow.setModuleProgress((prev) => prev.map((p) => (p.id === id && p.status === 'available' ? { ...p, status: 'in_progress' } : p)))
    engine.resetToState(def.makeState(), def.getShadowCommits?.() ?? {}, def.getInitialReflog?.() ?? [])
    engine.clearUndoHistory()
    interaction.reset(def.initialWip)
    feedback.clear()
  }

  const doReset = () => {
    const def = MODULE_REGISTRY[moduleFlow.mode]
    engine.resetToState(def.makeState(), def.getShadowCommits?.() ?? {}, def.getInitialReflog?.() ?? [])
    if (moduleFlow.mode !== 'sandbox' && moduleFlow.mode !== 'module0') {
      moduleFlow.setModuleStatus(moduleFlow.mode, 'in_progress')
    }
    moduleFlow.dismissOverlay()
    moduleFlow.setModuleAttempts(0)
    engine.clearUndoHistory()
    interaction.reset(def.initialWip)
    feedback.clear()
  }

  const unlockSandbox = () => {
    moduleFlow.dismissOverlay()
    moduleFlow.setMode('sandbox')
    engine.unlockSandbox()
  }

  const handleEnterModule = (id: ModuleId) => {
    setPendingModule(null)
    enterModule(id)
  }

  const canUndo = engine.undoStack.length > 0
  const canRedo = engine.redoStack.length > 0

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        useGitEngine.getState().undo()
      } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault()
        useGitEngine.getState().redo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const previewCommand = commandInput.isValid ? commandInput.inputValue : null

  return (
    <div className="relative flex h-screen overflow-hidden">
      {sidebarOpen && (
        <Sidebar
          history={feedback.history}
          mode={moduleFlow.mode}
          moduleProgress={moduleFlow.moduleProgress}
          justUnlockedId={justUnlockedId}
          onEnter={(id) => {
            if (id === moduleFlow.mode) return
            if (id === 'sandbox') {
              unlockSandbox()
              return
            }
            const progress = moduleFlow.moduleProgress.find((p) => p.id === id)
            const isFirstModuleVisit = !progress || progress.status === 'available'
            if (isFirstModuleVisit) {
              setPendingModule(id)
            } else {
              handleEnterModule(id)
            }
          }}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Toolbar
          mode={moduleFlow.mode}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          docsOpen={docsOpen}
          onToggleDocs={toggleDocs}
          wip={interaction.wip}
          stashStack={interaction.stashStack}
          onStash={actions.doStash}
          onStashPop={actions.doStashPop}
          onReset={doReset}
          onUndo={actions.doUndo}
          onRedo={actions.doRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          historyCount={feedback.history.length}
        />

        <div className="relative flex flex-1 flex-col overflow-hidden">
          {activeTab === 'history' && <CommandHistoryTab history={feedback.history} />}
          <div className={activeTab === 'graph' ? 'relative flex-1' : 'hidden'}>
            <GitCanvas
              gitState={engine.gitState}
              mode={moduleFlow.mode}
              doAddCommit={actions.doAddCommit}
              doStartWip={actions.doStartWip}
              doCreateBranch={actions.doCreateBranch}
              doCheckout={actions.doCheckout}
              doResetHard={actions.doResetHard}
              doSquash={actions.doSquash}
              doStageChanges={actions.doStageChanges}
              wip={interaction.wip}
              staged={interaction.staged}
              highlightNodeIds={highlightNodeIds}
              previewCommand={previewCommand}
            />

            {currentLesson && !currentComplete && (
              <GoalCard
                lesson={currentLesson}
                attempts={moduleFlow.moduleAttempts}
                guided={moduleFlow.moduleGuided}
                onToggleGuided={moduleFlow.setModuleGuided}
                onPasteCommand={commandInput.pasteCommand}
              />
            )}

            <ReflogPanel
              visible={moduleFlow.mode === 'module11' || moduleFlow.mode === 'sandbox'}
              reflog={engine.reflog}
              onRecover={actions.doReflogRecover}
              currentCommits={new Set(Object.keys(engine.gitState.commits))}
            />

            {interaction.conflictFlash && (
              <div
                className="pointer-events-none absolute inset-0 z-40"
                style={{
                  background: 'color-mix(in srgb, var(--conflict) 35%, transparent)',
                }}
              />
            )}

            {interaction.conflictState && <ConflictModal conflict={interaction.conflictState} onResolve={actions.resolveConflict} />}

            {explainerCommand && <ExplainerCard key={explainerKey} command={explainerCommand} onDismiss={dismissExplainer} />}

            {pendingModule && pendingModule !== 'sandbox' && (
              <IntroModal
                moduleId={pendingModule}
                onStart={() => handleEnterModule(pendingModule)}
                onSkip={() => handleEnterModule(pendingModule)}
              />
            )}
          </div>
        </div>

        <CommandPanel
          commands={deriveCommands(moduleFlow.mode as ModuleId, engine.gitState, interaction.wip, interaction.staged, interaction.stashStack)}
          onPaste={commandInput.pasteCommand}
        />

        <CommandTicker
          inputValue={commandInput.inputValue}
          isValid={commandInput.isValid}
          suggestions={commandInput.suggestions}
          activeSuggestionIdx={commandInput.activeSuggestionIdx}
          onInputChange={commandInput.handleChange}
          onKeyDown={commandInput.handleKeyDown}
          onSuggestionSelect={commandInput.acceptSuggestion}
          ticker={feedback.ticker}
          history={feedback.history}
          gitState={engine.gitState}
          onTokenHover={setHighlightNodeIds}
        />
      </div>

      {docsOpen && (
        <SidebarPanel
          alignment="right"
          resizable
          closeable
          title={t('sidebar.docs')}
          width={docsPanelWidth}
          onClose={toggleDocs}
          onResizeMouseDown={onResizeMouseDown}
        >
          <DocsPanel currentModuleId={moduleFlow.mode} isOpen={docsOpen} />
        </SidebarPanel>
      )}

      {levelCompleteId && (
        <LevelCompleteOverlay
          moduleId={levelCompleteId}
          onDismiss={() => {
            dismissLevelComplete()
            moduleFlow.dismissOverlay()
          }}
          onNext={() => {
            const nextId = levelCompleteId === 'module11' ? 'sandbox' : MODULE_REGISTRY[levelCompleteId]?.next
            dismissLevelComplete()
            moduleFlow.dismissOverlay()
            if (nextId) {
              const progress = moduleFlow.moduleProgress.find((p) => p.id === nextId)
              if (!progress || progress.status === 'available') {
                setPendingModule(nextId as ModuleId)
              } else {
                handleEnterModule(nextId as ModuleId)
              }
            }
          }}
        />
      )}

      {toastModuleId && <Toast moduleId={toastModuleId} accentColor="var(--ok)" onDismiss={dismissToast} />}

      <WelcomeOverlay />
    </div>
  )
}
