import type { Mode, ModuleId, ModuleProgress, TickerEntry } from '../../types';
import { ModuleCard, getCardStatus, levelCardRadius, pillRadius } from './ModuleCard';

type SidebarProps = {
  history: TickerEntry[];
  mode: Mode;
  moduleProgress: ModuleProgress[];
  onEnter: (id: ModuleId) => void;
};

const timeAgo = (ts: number): string => {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
};

export const Sidebar = ({ history, mode, moduleProgress, onEnter }: SidebarProps) => {
  return (
    <div className="w-56 flex-shrink-0 flex flex-col bg-[var(--panel2)] border-r-2 border-dashed border-[var(--hair)] p-3 h-full overflow-hidden">
      <div
        className="font-bold text-lg text-[var(--ink)] mb-1 flex-shrink-0"
        style={{ fontFamily: 'var(--hand)' }}
      >
        Giteractive
      </div>

      {/* Levels — scrollable, takes all available space above session */}
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mt-3 mb-1 block flex-shrink-0">
        Levels
      </span>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ModuleCard
          id="module1"
          number="1"
          title="Module 1"
          subtitle="The Linear Timeline"
          status={getCardStatus('module1', mode, moduleProgress)}
          onClick={() => onEnter('module1')}
        />
        <ModuleCard
          id="module2"
          number="2"
          title="Module 2"
          subtitle="Parallel Universes"
          status={getCardStatus('module2', mode, moduleProgress)}
          onClick={() => onEnter('module2')}
        />
        <ModuleCard
          id="module3"
          number="3"
          title="Module 3"
          subtitle="Cherry-pick"
          status={getCardStatus('module3', mode, moduleProgress)}
          onClick={() => onEnter('module3')}
        />
        <ModuleCard
          id="module4"
          number="4"
          title="Module 4"
          subtitle="Rebase"
          status={getCardStatus('module4', mode, moduleProgress)}
          onClick={() => onEnter('module4')}
        />
        <ModuleCard
          id="module5"
          number="5"
          title="Module 5"
          subtitle="Merge"
          status={getCardStatus('module5', mode, moduleProgress)}
          onClick={() => onEnter('module5')}
        />
        <ModuleCard
          id="module6"
          number="6"
          title="Module 6"
          subtitle="Merge Conflicts"
          status={getCardStatus('module6', mode, moduleProgress)}
          onClick={() => onEnter('module6')}
        />
        <ModuleCard
          id="module7"
          number="7"
          title="Module 7"
          subtitle="git reset"
          status={getCardStatus('module7', mode, moduleProgress)}
          onClick={() => onEnter('module7')}
        />
        <ModuleCard
          id="module8"
          number="8"
          title="Module 8"
          subtitle="git stash"
          status={getCardStatus('module8', mode, moduleProgress)}
          onClick={() => onEnter('module8')}
        />
        <ModuleCard
          id="sandbox"
          title="Sandbox Mode"
          subtitle="Free canvas · all ops"
          status={getCardStatus('sandbox', mode, moduleProgress)}
          onClick={() => onEnter('sandbox')}
        />
      </div>

      {/* Session — fixed height, always visible */}
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mt-3 mb-1 block flex-shrink-0">
        Session
      </span>
      <div className="flex-shrink-0 overflow-y-auto flex flex-col gap-1" style={{ maxHeight: 128 }}>
        {history.length === 0 ? (
          <div className="text-[var(--muted)] text-xs py-1" style={{ fontFamily: 'var(--hand)' }}>
            No commands yet
          </div>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              className="p-1.5 border border-[var(--hair)] bg-[var(--panel)] flex-shrink-0"
              style={{ borderRadius: levelCardRadius }}
            >
              <div className="font-mono text-[11px] text-[var(--ink)]">{entry.command}</div>
              <div className="font-mono text-[9px] text-[var(--muted)] mt-px">{timeAgo(entry.timestamp)}</div>
            </div>
          ))
        )}
      </div>

      {/* Docs */}
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mt-3 mb-1 block flex-shrink-0">
        Docs
      </span>
      <div className="flex-shrink-0">
        {(['git commit', 'git checkout -b', 'git cherry-pick', 'git rebase', 'git merge', 'git reset', 'git stash'] as const).map((doc) => (
          <span
            key={doc}
            className="inline-flex items-center px-2 py-0.5 border border-[var(--hair)] font-mono text-[10px] text-[var(--soft)] mr-1 mb-1 bg-[var(--panel)]"
            style={{ borderRadius: pillRadius }}
          >
            {doc}
          </span>
        ))}
      </div>
    </div>
  );
};
