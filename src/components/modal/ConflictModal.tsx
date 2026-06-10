import { useTranslation } from 'react-i18next'
import type { ConflictState } from '../../types'
import { ModalBackdrop } from './ModalBackdrop'
import { cardRadius } from '../common/radii'

type ConflictModalProps = {
  conflict: ConflictState
  onResolve: (resolution: 'ours' | 'theirs' | 'both') => void
}

type HunkOption = {
  id: 'ours' | 'theirs' | 'both'
  labelKey: string
  lines: string[]
  color: string
  bg: string
}

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
]

export const ConflictModal = ({ conflict, onResolve }: ConflictModalProps) => {
  const { t } = useTranslation()

  return (
    <ModalBackdrop background="color-mix(in srgb, var(--conflict) 18%, var(--backdrop))">
      <div
        className="w-[480px] max-w-[92vw] border-2 p-5"
        style={{
          borderRadius: cardRadius,
          background: 'var(--panel)',
          borderColor: 'var(--conflict)',
          boxShadow: '0 8px 40px color-mix(in srgb, var(--conflict) 30%, transparent)',
        }}
      >
        <div className="mb-1 flex items-center gap-2">
          <span style={{ color: 'var(--conflict)', fontSize: 18 }}>⚡</span>
          <span className="font-hand text-base font-bold text-[var(--ink)]">{t('conflict.title')}</span>
        </div>
        <p className="mb-4 font-mono text-xs text-[var(--muted)]">
          {conflict.sourceBranch} ↔ {conflict.targetBranch} both modified <span style={{ color: 'var(--conflict)' }}>greeting.txt</span>
        </p>

        {/* Conflict diff */}
        <div
          className="mb-4 border p-3 font-mono text-xs"
          style={{ borderRadius: '8px', borderColor: 'var(--hair)', background: 'var(--panel2)' }}
        >
          <div style={{ color: 'var(--muted)' }}># greeting.txt</div>
          <div style={{ color: 'var(--conflict)' }}>{'<<<<<<< HEAD (main)'}</div>
          <div style={{ color: 'var(--main)' }}>{'greeting = "Hello, World!"'}</div>
          <div style={{ color: 'var(--conflict)' }}>{'======='}</div>
          <div style={{ color: 'var(--feat)' }}>{'greeting = "Hello, Developer!"'}</div>
          <div style={{ color: 'var(--conflict)' }}>{`>>>>>>> ${conflict.sourceBranch}`}</div>
        </div>

        <p className="mb-2 font-mono text-xs tracking-widest text-[var(--muted)] uppercase">{t('conflict.chooseResolution')}</p>
        <div className="mb-4 flex flex-col gap-2">
          {HUNK_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onResolve(opt.id)}
              className="cursor-pointer border p-3 text-left"
              style={{
                borderRadius: cardRadius,
                borderColor: opt.color,
                background: opt.bg,
              }}
            >
              <div className="mb-1 font-hand text-sm font-bold" style={{ color: opt.color }}>
                {t(opt.labelKey)}
              </div>
              {opt.lines.map((line, i) => (
                <div key={i} className="font-mono text-xs" style={{ color: 'var(--ink)' }}>
                  {line}
                </div>
              ))}
            </button>
          ))}
        </div>

        <div className="text-center font-mono text-xs text-[var(--muted)]">{t('conflict.footer')}</div>
      </div>
    </ModalBackdrop>
  )
}
