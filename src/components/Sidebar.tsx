import type { Mode, TickerEntry } from '../types';

interface SidebarProps {
  history: TickerEntry[];
  mode: Mode;
  module1Complete: boolean;
  module2Complete: boolean;
  module3Complete: boolean;
  onEnterModule1: () => void;
  onEnterModule2: () => void;
  onEnterModule3: () => void;
  onEnterSandbox: () => void;
}

const levelCardRadius = '255px 14px 225px 16px/16px 225px 14px 255px';
const pillRadius = '60px 10px 60px 10px/10px 60px 10px 60px';

function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

interface LevelCardProps {
  number: string;
  title: string;
  subtitle: string;
  status: 'done' | 'active' | 'locked' | 'available';
  onClick?: () => void;
}

function LevelCard({ number, title, subtitle, status, onClick }: LevelCardProps) {
  const isDone = status === 'done';
  const isActive = status === 'active';
  const isLocked = status === 'locked';

  const borderColor = isActive
    ? 'var(--main)'
    : isDone
      ? 'var(--ok)'
      : isLocked
        ? 'var(--hair)'
        : 'var(--hair)';

  const bg = isActive
    ? 'color-mix(in srgb, var(--main) 8%, var(--panel))'
    : isDone
      ? 'color-mix(in srgb, var(--ok) 5%, var(--panel))'
      : 'var(--panel)';

  const statusLabel = isActive ? 'active' : isDone ? '✓ done' : isLocked ? 'locked' : 'click to enter';
  const statusColor = isActive ? 'var(--main)' : isDone ? 'var(--ok)' : isLocked ? 'var(--hair)' : 'var(--muted)';

  return (
    <div
      className="p-2 mb-1.5 border text-sm"
      onClick={isLocked ? undefined : onClick}
      style={{
        borderRadius: levelCardRadius,
        border: `1.4px solid ${borderColor}`,
        background: bg,
        cursor: isLocked ? 'default' : 'pointer',
        opacity: isLocked ? 0.5 : 1,
      }}
    >
      <div className="flex items-center gap-1.5">
        <span
          className="font-mono text-[10px] grid place-items-center flex-shrink-0"
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: `1.2px solid ${statusColor}`,
            color: statusColor,
            fontWeight: 700,
          }}
        >
          {isDone ? '✓' : number}
        </span>
        <div
          className="text-[var(--ink)] text-[13px]"
          style={{ fontFamily: 'var(--hand)', fontWeight: isActive ? 700 : 400 }}
        >
          {title}
        </div>
      </div>
      <div className="font-mono text-[10px] text-[var(--soft)] mt-0.5 ml-6">{subtitle}</div>
      <div className="mt-1 ml-6">
        <span
          className="font-mono text-[10px] px-1.5 py-px"
          style={{
            borderRadius: pillRadius,
            color: statusColor,
            border: `1px solid ${statusColor}`,
          }}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

export function Sidebar({
  history,
  mode,
  module1Complete,
  module2Complete,
  module3Complete,
  onEnterModule1,
  onEnterModule2,
  onEnterModule3,
  onEnterSandbox,
}: SidebarProps) {
  return (
    <div className="w-56 flex-shrink-0 flex flex-col bg-[var(--panel2)] border-r-2 border-dashed border-[var(--hair)] p-3 overflow-hidden h-full">
      <div
        className="font-bold text-lg text-[var(--ink)] mb-1"
        style={{ fontFamily: 'var(--hand)' }}
      >
        Giteractive
      </div>

      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mt-3 mb-1 block">
        Levels
      </span>

      <LevelCard
        number="1"
        title="Module 1"
        subtitle="The Linear Timeline"
        status={mode === 'module1' ? 'active' : module1Complete ? 'done' : 'available'}
        onClick={onEnterModule1}
      />

      <LevelCard
        number="2"
        title="Module 2"
        subtitle="Parallel Universes"
        status={
          mode === 'module2'
            ? 'active'
            : module2Complete
              ? 'done'
              : !module1Complete
                ? 'locked'
                : 'available'
        }
        onClick={onEnterModule2}
      />

      <LevelCard
        number="3"
        title="Module 3"
        subtitle="Cherry-pick"
        status={
          mode === 'module3'
            ? 'active'
            : module3Complete
              ? 'done'
              : !module2Complete
                ? 'locked'
                : 'available'
        }
        onClick={onEnterModule3}
      />

      <div
        className="p-2 mb-1.5 text-sm mt-1"
        onClick={onEnterSandbox}
        style={{
          borderRadius: levelCardRadius,
          border: `1.6px solid ${mode === 'sandbox' ? 'var(--feat)' : 'var(--hair)'}`,
          background: mode === 'sandbox' ? 'color-mix(in srgb, var(--feat) 8%, var(--panel))' : 'var(--panel)',
          cursor: 'pointer',
        }}
      >
        <div
          className="text-[var(--ink)]"
          style={{ fontFamily: 'var(--hand)', fontWeight: mode === 'sandbox' ? 700 : 400 }}
        >
          Sandbox Mode
        </div>
        <div className="font-mono text-[10px] text-[var(--soft)] mt-0.5">
          Free canvas · all ops
        </div>
        <div className="mt-1">
          <span
            className="font-mono text-[10px] px-1.5 py-px"
            style={{
              borderRadius: pillRadius,
              color: mode === 'sandbox' ? 'var(--feat)' : 'var(--muted)',
              border: `1px solid ${mode === 'sandbox' ? 'var(--feat)' : 'var(--muted)'}`,
            }}
          >
            {mode === 'sandbox' ? 'active' : 'click to enter'}
          </span>
        </div>
      </div>

      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mt-3 mb-1 block">
        Session
      </span>
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 min-h-0">
        {history.length === 0 ? (
          <div className="text-[var(--muted)] text-xs py-1" style={{ fontFamily: 'var(--hand)' }}>
            No commands yet
          </div>
        ) : (
          history.map(entry => (
            <div
              key={entry.id}
              className="p-1.5 border border-[var(--hair)] bg-[var(--panel)]"
              style={{ borderRadius: levelCardRadius }}
            >
              <div className="font-mono text-[11px] text-[var(--ink)]">{entry.command}</div>
              <div className="font-mono text-[9px] text-[var(--muted)] mt-px">{timeAgo(entry.timestamp)}</div>
            </div>
          ))
        )}
      </div>

      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mt-3 mb-1 block">
        Docs
      </span>
      <div>
        {(['git commit', 'git checkout -b', 'git cherry-pick', 'git rebase'] as const).map(doc => (
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
}
