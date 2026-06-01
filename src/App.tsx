import { useEffect, useRef, useState } from 'react';
import { useGitStore } from './useGitStore';
import { GitCanvas } from './components/GitCanvas';
import { Sidebar } from './components/Sidebar';
import { CommandTicker } from './components/CommandTicker';
import { ModuleCompleteModal } from './components/ModuleCompleteModal';
import { GoalCard } from './components/GoalCard';
import { ExplainerCard } from './components/ExplainerCard';
import { LESSON_LINEAR, LESSON_BRANCH, LESSON_CHERRY_PICK } from './lessons';
import type { LessonGoal } from './types';

const handBtnRadius = '60px 10px 60px 10px/10px 60px 10px 60px';

const MODULE_LABELS: Record<string, string> = {
  module1: 'Module 1 · The Linear Timeline',
  module2: 'Module 2 · Parallel Universes',
  module3: 'Module 3 · Cherry-pick',
  sandbox: 'Sandbox Mode',
};

const MODULE_LESSONS: Partial<Record<string, LessonGoal>> = {
  module1: LESSON_LINEAR,
  module2: LESSON_BRANCH,
  module3: LESSON_CHERRY_PICK,
};

export const App = () => {
  const store = useGitStore();
  const [explainerCommand, setExplainerCommand] = useState<string | null>(null);
  const explainerKeyRef = useRef(0);

  const currentLesson = MODULE_LESSONS[store.mode];
  const currentModuleProgress = store.moduleProgress.find((p) => p.id === store.mode);
  const currentComplete = currentModuleProgress?.status === 'complete';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', store.theme);
  }, [store.theme]);

  useEffect(() => {
    if (store.ticker.state === 'flash' && store.ticker.command && !explainerCommand) {
      explainerKeyRef.current += 1;
      setExplainerCommand(store.ticker.command);
    }
  }, [store.ticker.state, store.ticker.command]);

  return (
    <div className="flex h-screen overflow-hidden">
      {store.sidebarOpen && (
        <Sidebar
          history={store.history}
          mode={store.mode}
          moduleProgress={store.moduleProgress}
          onEnter={(id) => {
            if (id === 'module1') store.enterModule1();
            else if (id === 'module2') store.enterModule2();
            else if (id === 'module3') store.enterModule3();
            else store.unlockSandbox();
          }}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-dashed border-[var(--hair)] flex-shrink-0">
          <button
            onClick={() => store.setSidebarOpen(o => !o)}
            title="Toggle sidebar"
            className="font-mono text-sm text-[var(--ink)] bg-[var(--panel)] border border-dashed border-[var(--hair)] px-3 py-1 cursor-pointer whitespace-nowrap"
            style={{ fontFamily: 'var(--hand)', borderRadius: handBtnRadius }}
          >
            {store.sidebarOpen ? '◀' : '▶'}
          </button>
          <span className="font-mono text-xs text-[var(--muted)] flex-1">
            {MODULE_LABELS[store.mode] ?? store.mode}
          </span>
          <button
            onClick={store.doReset}
            title="Reset canvas"
            className="font-mono text-sm text-[var(--ink)] bg-[var(--panel)] border border-dashed border-[var(--hair)] px-3 py-1 cursor-pointer whitespace-nowrap"
            style={{ fontFamily: 'var(--hand)', borderRadius: handBtnRadius }}
          >
            ↺ Reset
          </button>
          <button
            onClick={() => store.setTheme(t => (t === 'light' ? 'dark' : 'light'))}
            className="font-mono text-sm text-[var(--ink)] bg-[var(--panel)] border border-dashed border-[var(--hair)] px-3 py-1 cursor-pointer whitespace-nowrap"
            style={{ fontFamily: 'var(--hand)', borderRadius: handBtnRadius }}
          >
            {store.theme === 'light' ? '◑' : '○'} Theme
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <GitCanvas
            gitState={store.gitState}
            mode={store.mode}
            doAddCommit={store.doAddCommit}
            doCherryPick={store.doCherryPick}
            doRebase={store.doRebase}
            doCreateBranch={store.doCreateBranch}
            doCheckout={store.doCheckout}
            setGhostCommand={cmd => store.setTicker({ command: cmd, state: cmd ? 'ghost' : 'idle' })}
          />

          {/* Module goal card */}
          {currentLesson && !currentComplete && (
            <GoalCard
              lesson={currentLesson}
              attempts={store.moduleAttempts}
              guided={store.moduleGuided}
              onToggleGuided={store.setModuleGuided}
            />
          )}

          {/* Completion overlays */}
          {store.showCompletionOverlay && store.mode === 'module1' && (
            <ModuleCompleteModal
              icon="🎉"
              title="Module 1 Complete!"
              body={<p className="text-sm text-[var(--soft)] leading-relaxed m-0" style={{ fontFamily: 'var(--hand)' }}>You've mastered linear history. Ready for branches?</p>}
              buttonLabel="Unlock Sandbox Mode"
              onAction={store.unlockSandbox}
            />
          )}
          {store.showCompletionOverlay && store.mode === 'module2' && (
            <ModuleCompleteModal
              icon="⎇"
              title="Module 2 Complete!"
              accentColor="var(--feat)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-2" style={{ fontFamily: 'var(--hand)' }}>You've seen it: a branch is just a pointer to a commit — no files copied, just a label.</p>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0" style={{ fontFamily: 'var(--hand)' }}>In Sandbox mode you can cherry-pick and rebase across branches.</p>
                </>
              }
              buttonLabel="Unlock Sandbox Mode"
              onAction={store.unlockSandbox}
            />
          )}
          {store.showCompletionOverlay && store.mode === 'module3' && (
            <ModuleCompleteModal
              icon="✓"
              title="Cherry-pick Complete!"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1" style={{ fontFamily: 'var(--hand)' }}>You copied one commit onto main — its hash changed because history was re-applied, not moved.</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono" style={{ fontSize: 11 }}>{store.moduleAttempts} attempt{store.moduleAttempts !== 1 ? 's' : ''}</p>
                </>
              }
              buttonLabel="Back to Sandbox"
              onAction={store.unlockSandbox}
            />
          )}

          {/* Contextual explainer */}
          {explainerCommand && (
            <ExplainerCard
              key={explainerKeyRef.current}
              command={explainerCommand}
              onDismiss={() => setExplainerCommand(null)}
            />
          )}
        </div>

        {/* Ticker */}
        <CommandTicker ticker={store.ticker} history={store.history} />
      </div>
    </div>
  );
}
