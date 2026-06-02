import type { ConflictState } from '../types';

type ConflictModalProps = {
  conflict: ConflictState;
  onResolve: (resolution: 'ours' | 'theirs' | 'both') => void;
};

const pillRadius = '60px 10px 60px 10px/10px 60px 10px 60px';
const cardRadius = '255px 14px 225px 16px/16px 225px 14px 255px';

type HunkOption = {
  id: 'ours' | 'theirs' | 'both';
  label: string;
  lines: string[];
  color: string;
  bg: string;
};

const HUNK_OPTIONS: HunkOption[] = [
  {
    id: 'ours',
    label: 'Keep Ours (main)',
    lines: ['greeting = "Hello, World!"'],
    color: 'var(--main)',
    bg: 'color-mix(in srgb, var(--main) 8%, var(--panel))',
  },
  {
    id: 'theirs',
    label: 'Keep Theirs (feature)',
    lines: ['greeting = "Hello, Developer!"'],
    color: 'var(--feat)',
    bg: 'color-mix(in srgb, var(--feat) 8%, var(--panel))',
  },
  {
    id: 'both',
    label: 'Keep Both',
    lines: ['greeting = "Hello, World!"', 'greeting_dev = "Hello, Developer!"'],
    color: 'var(--ok)',
    bg: 'color-mix(in srgb, var(--ok) 8%, var(--panel))',
  },
];

export const ConflictModal = ({ conflict, onResolve }: ConflictModalProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50"
      style={{ background: 'color-mix(in srgb, var(--conflict) 18%, transparent)' }}
    >
      <div
        className="w-[480px] max-w-[92vw] p-5 border-2"
        style={{
          borderRadius: cardRadius,
          background: 'var(--panel)',
          borderColor: 'var(--conflict)',
          boxShadow: '0 8px 40px color-mix(in srgb, var(--conflict) 30%, transparent)',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span style={{ color: 'var(--conflict)', fontSize: 18 }}>⚡</span>
          <span
            className="font-bold text-base text-[var(--ink)]"
            style={{ fontFamily: 'var(--hand)' }}
          >
            Merge Conflict Detected
          </span>
        </div>
        <p className="font-mono text-[11px] text-[var(--muted)] mb-4">
          {conflict.sourceBranch} ↔ {conflict.targetBranch} both modified{' '}
          <span style={{ color: 'var(--conflict)' }}>greeting.txt</span>
        </p>

        {/* Conflict diff */}
        <div
          className="font-mono text-[11px] mb-4 p-3 border"
          style={{ borderRadius: '8px', borderColor: 'var(--hair)', background: 'var(--panel2)' }}
        >
          <div style={{ color: 'var(--muted)' }}># greeting.txt</div>
          <div style={{ color: 'var(--conflict)' }}>{'<<<<<<< HEAD (main)'}</div>
          <div style={{ color: 'var(--main)' }}>{'greeting = "Hello, World!"'}</div>
          <div style={{ color: 'var(--conflict)' }}>{'======='}</div>
          <div style={{ color: 'var(--feat)' }}>{'greeting = "Hello, Developer!"'}</div>
          <div style={{ color: 'var(--conflict)' }}>{`>>>>>>> ${conflict.sourceBranch}`}</div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-2">
          Choose resolution
        </p>
        <div className="flex flex-col gap-2 mb-4">
          {HUNK_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onResolve(opt.id)}
              className="text-left p-3 border cursor-pointer"
              style={{
                borderRadius: cardRadius,
                borderColor: opt.color,
                background: opt.bg,
              }}
            >
              <div
                className="font-bold text-[12px] mb-1"
                style={{ fontFamily: 'var(--hand)', color: opt.color }}
              >
                {opt.label}
              </div>
              {opt.lines.map((line, i) => (
                <div key={i} className="font-mono text-[11px]" style={{ color: 'var(--ink)' }}>
                  {line}
                </div>
              ))}
            </button>
          ))}
        </div>

        <div className="font-mono text-[10px] text-[var(--muted)] text-center">
          Choosing a resolution will create the merge commit
        </div>
      </div>
    </div>
  );
};
