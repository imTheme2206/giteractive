import { useTranslation } from 'react-i18next';
import type { ConflictState } from '../../types';
import { ModalBackdrop } from './ModalBackdrop';

type ConflictModalProps = {
  conflict: ConflictState;
  onResolve: (resolution: 'ours' | 'theirs' | 'both') => void;
};

const pillRadius = '60px 10px 60px 10px/10px 60px 10px 60px';
const cardRadius = '255px 14px 225px 16px/16px 225px 14px 255px';

type HunkOption = {
  id: 'ours' | 'theirs' | 'both';
  labelKey: string;
  lines: string[];
  color: string;
  bg: string;
};

const HUNK_OPTIONS: HunkOption[] = [
  {
    id: 'ours',
    labelKey: 'conflict.keepOurs',
    lines: ['greeting = "Hello, World!"'],
    color: 'var(--main)',
    bg: 'color-mix(in srgb, var(--main) 8%, var(--panel))',
  },
  {
    id: 'theirs',
    labelKey: 'conflict.keepTheirs',
    lines: ['greeting = "Hello, Developer!"'],
    color: 'var(--feat)',
    bg: 'color-mix(in srgb, var(--feat) 8%, var(--panel))',
  },
  {
    id: 'both',
    labelKey: 'conflict.keepBoth',
    lines: ['greeting = "Hello, World!"', 'greeting_dev = "Hello, Developer!"'],
    color: 'var(--ok)',
    bg: 'color-mix(in srgb, var(--ok) 8%, var(--panel))',
  },
];

export const ConflictModal = ({ conflict, onResolve }: ConflictModalProps) => {
  const { t } = useTranslation();

  return (
    <ModalBackdrop background="color-mix(in srgb, var(--conflict) 18%, var(--backdrop))">
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
            {t('conflict.title')}
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
          {t('conflict.chooseResolution')}
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
                {t(opt.labelKey)}
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
          {t('conflict.footer')}
        </div>
      </div>
    </ModalBackdrop>
  );
};
