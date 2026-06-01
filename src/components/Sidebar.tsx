import type { Mode, ModuleId, ModuleProgress, ModuleStatus, TickerEntry } from '../types';

type SidebarProps = {
  history: TickerEntry[];
  mode: Mode;
  moduleProgress: ModuleProgress[];
  onEnter: (id: ModuleId) => void;
};

const levelCardRadius = '255px 14px 225px 16px/16px 225px 14px 255px';
const pillRadius = '60px 10px 60px 10px/10px 60px 10px 60px';

const timeAgo = (ts: number): string => {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

type CardDisplayStatus = 'active' | 'locked' | 'available' | 'in_progress' | 'complete';

type ModuleCardProps = {
  id: ModuleId;
  number?: string;
  title: string;
  subtitle: string;
  status: CardDisplayStatus;
  onClick?: () => void;
};

const ModuleCard = ({ id, number, title, subtitle, status, onClick }: ModuleCardProps) => {
  const isSandbox = id === 'sandbox';
  const isActive = status === 'active';
  const isComplete = status === 'complete';
  const isLocked = status === 'locked';
  const isInProgress = status === 'in_progress';

  const accent = isSandbox ? 'var(--feat)' : 'var(--main)';

  const borderColor = isActive
    ? accent
    : isComplete
      ? 'var(--ok)'
      : 'var(--hair)';

  const bg = isActive
    ? `color-mix(in srgb, ${accent} 8%, var(--panel))`
    : isComplete
      ? 'color-mix(in srgb, var(--ok) 5%, var(--panel))'
      : 'var(--panel)';

  const statusLabel = isActive
    ? 'active'
    : isComplete
      ? '✓ done'
      : isLocked
        ? 'locked'
        : isInProgress
          ? 'in progress'
          : 'click to enter';

  const statusColor = isActive
    ? accent
    : isComplete
      ? 'var(--ok)'
      : isLocked
        ? 'var(--hair)'
        : isInProgress
          ? accent
          : 'var(--muted)';

  const marginLeft = !isSandbox && number ? 'ml-6' : '';

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
        {!isSandbox && number && (
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
            {isComplete ? '✓' : number}
          </span>
        )}
        <div
          className="text-[var(--ink)] text-[13px]"
          style={{ fontFamily: 'var(--hand)', fontWeight: isActive ? 700 : 400 }}
        >
          {title}
        </div>
      </div>
      <div className={`font-mono text-[10px] text-[var(--soft)] mt-0.5 ${marginLeft}`}>
        {subtitle}
      </div>
      <div className={`mt-1 ${marginLeft}`}>
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

const getCardStatus = (id: ModuleId, mode: Mode, moduleProgress: ModuleProgress[]): CardDisplayStatus => {
  if (mode === id) return 'active';
  const p = moduleProgress.find((prog) => prog.id === id);
  if (!p) return 'available';
  return p.status as CardDisplayStatus;
}

export const Sidebar = ({ history, mode, moduleProgress, onEnter }: SidebarProps) => {
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

      <div className="mt-1">
        <ModuleCard
          id="sandbox"
          title="Sandbox Mode"
          subtitle="Free canvas · all ops"
          status={getCardStatus('sandbox', mode, moduleProgress)}
          onClick={() => onEnter('sandbox')}
        />
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
          history.map((entry) => (
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
        {(['git commit', 'git checkout -b', 'git cherry-pick', 'git rebase'] as const).map((doc) => (
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
