import { useEffect, useRef, useState } from 'react';
import { useGitStore } from './useGitStore';
import { GitCanvas } from './components/GitCanvas';
import { Sidebar } from './components/sidebar/Sidebar';
import { CommandTicker } from './components/CommandTicker';
import { ModuleCompleteModal } from './components/ModuleCompleteModal';
import { GoalCard } from './components/GoalCard';
import { ExplainerCard } from './components/ExplainerCard';
import { ConflictModal } from './components/ConflictModal';
import { LESSON_LINEAR, LESSON_BRANCH, LESSON_CHERRY_PICK, LESSON_REBASE, LESSON_MERGE, LESSON_CONFLICT, LESSON_RESET, LESSON_STASH } from './lessons';
import type { LessonGoal } from './types';

const handBtnRadius = '60px 10px 60px 10px/10px 60px 10px 60px';

const MODULE_LABELS: Record<string, string> = {
  module1: 'Module 1 · The Linear Timeline',
  module2: 'Module 2 · Parallel Universes',
  module3: 'Module 3 · Cherry-pick',
  module4: 'Module 4 · Rebase',
  module5: 'Module 5 · Merge',
  module6: 'Module 6 · Merge Conflicts',
  module7: 'Module 7 · git reset',
  module8: 'Module 8 · git stash',
  sandbox: 'Sandbox Mode',
};

const MODULE_LESSONS: Partial<Record<string, LessonGoal>> = {
  module1: LESSON_LINEAR,
  module2: LESSON_BRANCH,
  module3: LESSON_CHERRY_PICK,
  module4: LESSON_REBASE,
  module5: LESSON_MERGE,
  module6: LESSON_CONFLICT,
  module7: LESSON_RESET,
  module8: LESSON_STASH,
};

const getCommandType = (command: string): string | null => {
  if (command.startsWith('git checkout -b')) return 'checkout-b';
  if (command.startsWith('git commit')) return 'commit';
  if (command.startsWith('git cherry-pick')) return 'cherry-pick';
  if (command.startsWith('git rebase')) return 'rebase';
  if (command.startsWith('git merge')) return 'merge';
  if (command.startsWith('git reset')) return 'reset';
  if (command.startsWith('git stash')) return command.includes('pop') ? 'stash-pop' : 'stash';
  return null;
};

export const App = () => {
  const store = useGitStore();
  const [explainerCommand, setExplainerCommand] = useState<string | null>(null);
  const [highlightNodeIds, setHighlightNodeIds] = useState<string[]>([]);
  const explainerKeyRef = useRef(0);
  const seenCommandTypesRef = useRef(new Set<string>());

  const currentLesson = MODULE_LESSONS[store.mode];
  const currentModuleProgress = store.moduleProgress.find(p => p.id === store.mode);
  const currentComplete = currentModuleProgress?.status === 'complete';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', store.theme);
  }, [store.theme]);

  useEffect(() => {
    if (store.ticker.state === 'flash' && store.ticker.command && !explainerCommand) {
      const type = getCommandType(store.ticker.command);
      if (type && !seenCommandTypesRef.current.has(type)) {
        seenCommandTypesRef.current.add(type);
        explainerKeyRef.current += 1;
        setExplainerCommand(store.ticker.command);
      }
    }
  }, [store.ticker.state, store.ticker.command]);

  return (
    <div className="flex h-screen overflow-hidden">
      {store.sidebarOpen && (
        <Sidebar
          history={store.history}
          mode={store.mode}
          moduleProgress={store.moduleProgress}
          onEnter={id => {
            if (id === 'module1') store.enterModule1();
            else if (id === 'module2') store.enterModule2();
            else if (id === 'module3') store.enterModule3();
            else if (id === 'module4') store.enterModule4();
            else if (id === 'module5') store.enterModule5();
            else if (id === 'module6') store.enterModule6();
            else if (id === 'module7') store.enterModule7();
            else if (id === 'module8') store.enterModule8();
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
          {(store.mode === 'module8' || (store.mode === 'sandbox' && store.wip)) && (
            <button
              onClick={store.doStash}
              disabled={!store.wip}
              title="git stash"
              className="font-mono text-sm bg-[var(--panel)] border border-dashed border-[var(--hair)] px-3 py-1 cursor-pointer whitespace-nowrap"
              style={{ fontFamily: 'var(--hand)', borderRadius: handBtnRadius, color: store.wip ? 'var(--feat)' : 'var(--muted)', opacity: store.wip ? 1 : 0.5 }}
            >
              ⬇ Stash
            </button>
          )}
          {(store.mode === 'module8' || store.mode === 'sandbox') && store.stashStack.length > 0 && (
            <button
              onClick={store.doStashPop}
              title="git stash pop"
              className="font-mono text-sm bg-[var(--panel)] border border-dashed border-[var(--hair)] px-3 py-1 cursor-pointer whitespace-nowrap"
              style={{ fontFamily: 'var(--hand)', borderRadius: handBtnRadius, color: 'var(--feat)' }}
            >
              ⬆ Pop ({store.stashStack.length})
            </button>
          )}
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
          <button
            onClick={store.unlockAll}
            title="Unlock all modules (dev mode)"
            className="font-mono text-xs bg-[var(--panel)] border border-dashed px-2 py-1 cursor-pointer whitespace-nowrap"
            style={{
              fontFamily: 'var(--hand)',
              borderRadius: handBtnRadius,
              borderColor: store.devMode ? 'var(--feat)' : 'var(--hair)',
              color: store.devMode ? 'var(--feat)' : 'var(--muted)',
            }}
          >
            {store.devMode ? '⚙ dev' : '⚙'}
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
            doMerge={store.doMerge}
            doStartWip={store.doStartWip}
            doCreateBranch={store.doCreateBranch}
            doCheckout={store.doCheckout}
            doResetHard={store.doResetHard}
            setGhostCommand={cmd => store.setTicker({ command: cmd, state: cmd ? 'ghost' : 'idle' })}
            wip={store.wip}
            highlightNodeIds={highlightNodeIds}
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
              body={
                <p className="text-sm text-[var(--soft)] leading-relaxed m-0" style={{ fontFamily: 'var(--hand)' }}>
                  You've mastered linear history. Ready for branches?
                </p>
              }
              buttonLabel="Unlock Module 2"
              onAction={store.enterModule2}
            />
          )}
          {store.showCompletionOverlay && store.mode === 'module2' && (
            <ModuleCompleteModal
              icon="⎇"
              title="Module 2 Complete!"
              accentColor="var(--feat)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-2" style={{ fontFamily: 'var(--hand)' }}>
                    A branch is just a pointer to a commit — no files copied, just a label.
                  </p>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0" style={{ fontFamily: 'var(--hand)' }}>
                    Next: cherry-pick a single commit across branches.
                  </p>
                </>
              }
              buttonLabel="Unlock Module 3"
              onAction={store.enterModule3}
            />
          )}
          {store.showCompletionOverlay && store.mode === 'module3' && (
            <ModuleCompleteModal
              icon="✓"
              title="Cherry-pick Complete!"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1" style={{ fontFamily: 'var(--hand)' }}>
                    You copied one commit onto main — its hash changed because it was re-applied, not moved.
                  </p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono" style={{ fontSize: 11 }}>
                    {store.moduleAttempts} attempt{store.moduleAttempts !== 1 ? 's' : ''}
                  </p>
                </>
              }
              buttonLabel="Unlock Module 4"
              onAction={store.enterModule4}
            />
          )}
          {store.showCompletionOverlay && store.mode === 'module4' && (
            <ModuleCompleteModal
              icon="⟳"
              title="Rebase Complete!"
              accentColor="var(--head)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1" style={{ fontFamily: 'var(--hand)' }}>
                    The feature commits were lifted off their old base and re-applied on top of main. Notice the IDs changed — history was rewritten.
                  </p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono" style={{ fontSize: 11 }}>
                    {store.moduleAttempts} attempt{store.moduleAttempts !== 1 ? 's' : ''}
                  </p>
                </>
              }
              buttonLabel="Unlock Module 5"
              onAction={store.enterModule5}
            />
          )}
          {store.showCompletionOverlay && store.mode === 'module5' && (
            <ModuleCompleteModal
              icon="⊕"
              title="Merge Complete!"
              accentColor="var(--ok)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1" style={{ fontFamily: 'var(--hand)' }}>
                    You created a merge commit with two parents — both histories are preserved. Unlike rebase, the original commit IDs don't change.
                  </p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono" style={{ fontSize: 11 }}>
                    {store.moduleAttempts} attempt{store.moduleAttempts !== 1 ? 's' : ''}
                  </p>
                </>
              }
              buttonLabel="Unlock Module 6"
              onAction={store.enterModule6}
            />
          )}
          {store.showCompletionOverlay && store.mode === 'module6' && (
            <ModuleCompleteModal
              icon="⚡"
              title="Conflict Resolved!"
              accentColor="var(--conflict)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1" style={{ fontFamily: 'var(--hand)' }}>
                    You navigated a merge conflict — choosing which version of the file to keep before committing. Real git conflict resolution works the same way.
                  </p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono" style={{ fontSize: 11 }}>
                    {store.moduleAttempts} attempt{store.moduleAttempts !== 1 ? 's' : ''}
                  </p>
                </>
              }
              buttonLabel="Unlock Module 7"
              onAction={store.enterModule7}
            />
          )}
          {store.showCompletionOverlay && store.mode === 'module7' && (
            <ModuleCompleteModal
              icon="↺"
              title="Reset Complete!"
              accentColor="var(--head)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1" style={{ fontFamily: 'var(--hand)' }}>
                    git reset --hard moved the branch pointer back and permanently erased the commits after it. Unlike revert, there's no "undo" commit — the history is gone.
                  </p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono" style={{ fontSize: 11 }}>
                    {store.moduleAttempts} attempt{store.moduleAttempts !== 1 ? 's' : ''}
                  </p>
                </>
              }
              buttonLabel="Unlock Module 8"
              onAction={store.enterModule8}
            />
          )}
          {store.showCompletionOverlay && store.mode === 'module8' && (
            <ModuleCompleteModal
              icon="⬇"
              title="Stash Mastered!"
              accentColor="var(--feat)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1" style={{ fontFamily: 'var(--hand)' }}>
                    You saved uncommitted work to the stash, switched contexts to fix main, then popped it back. The stash is a stack — you can push multiple times.
                  </p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono" style={{ fontSize: 11 }}>
                    {store.moduleAttempts} attempt{store.moduleAttempts !== 1 ? 's' : ''}
                  </p>
                </>
              }
              buttonLabel="Go to Sandbox"
              onAction={store.unlockSandbox}
            />
          )}

          {/* Orange conflict flash */}
          {store.conflictFlash && (
            <div
              className="absolute inset-0 pointer-events-none z-40"
              style={{ background: 'color-mix(in srgb, var(--conflict) 35%, transparent)' }}
            />
          )}

          {/* Conflict resolution modal */}
          {store.conflictState && (
            <ConflictModal
              conflict={store.conflictState}
              onResolve={store.resolveConflict}
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
        <CommandTicker
          ticker={store.ticker}
          history={store.history}
          gitState={store.gitState}
          onTokenHover={setHighlightNodeIds}
        />
      </div>
    </div>
  );
};
