import { useEffect, useRef, useState } from 'react';
import { useGitStore } from './useGitStore';
import { GitCanvas } from './components/GitCanvas';
import { Sidebar } from './components/Sidebar';
import { CommandTicker } from './components/CommandTicker';
import { Module1Complete } from './components/Module1Complete';
import { Module2Complete } from './components/Module2Complete';
import { Module3Complete } from './components/Module3Complete';
import { GoalCard } from './components/GoalCard';
import { ExplainerCard } from './components/ExplainerCard';
import { LESSON_CHERRY_PICK } from './lessons';

const handBtnRadius = '60px 10px 60px 10px/10px 60px 10px 60px';

const MODULE_LABELS: Record<string, string> = {
  module1: 'Module 1 · The Linear Timeline',
  module2: 'Module 2 · Parallel Universes',
  module3: 'Module 3 · Cherry-pick',
  sandbox: 'Sandbox Mode',
};

export function App() {
  const store = useGitStore();
  const [explainerCommand, setExplainerCommand] = useState<string | null>(null);
  const explainerKeyRef = useRef(0);

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
          module1Complete={store.module1Complete}
          module2Complete={store.module2Complete}
          module3Complete={store.module3Complete}
          onEnterModule1={store.enterModule1}
          onEnterModule2={store.enterModule2}
          onEnterModule3={store.enterModule3}
          onEnterSandbox={store.unlockSandbox}
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
            setGhostCommand={cmd => store.setTicker({ command: cmd, state: cmd ? 'ghost' : 'idle' })}
          />

          {/* Module goal card */}
          {store.mode === 'module3' && !store.module3Complete && (
            <GoalCard
              lesson={LESSON_CHERRY_PICK}
              attempts={store.module3Attempts}
              guided={store.module3Guided}
              onToggleGuided={store.setModule3Guided}
            />
          )}

          {/* Completion overlays */}
          {store.module1Complete && store.mode === 'module1' && (
            <Module1Complete onUnlock={store.unlockSandbox} />
          )}
          {store.module2Complete && store.mode === 'module2' && (
            <Module2Complete onUnlock={store.unlockSandbox} />
          )}
          {store.module3Complete && store.mode === 'module3' && (
            <Module3Complete attempts={store.module3Attempts} onUnlock={store.unlockSandbox} />
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
