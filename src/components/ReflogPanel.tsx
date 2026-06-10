import type { ReflogEntry } from '../types'

type ReflogPanelProps = {
  reflog: ReflogEntry[]
  onRecover: (hash: string) => void
  visible: boolean
  currentCommits: Set<string>
}

export const ReflogPanel = ({ reflog, onRecover, visible, currentCommits }: ReflogPanelProps) => {
  if (!visible || reflog.length === 0) return null

  return (
    <div
      className="absolute right-4 bottom-4 flex flex-col gap-2 border-2 border-dashed border-[var(--hair)] bg-[var(--panel)] p-3"
      style={{
        borderRadius: '12px 4px 12px 4px/4px 12px 4px 12px',
        maxWidth: 280,
        boxShadow: '0 4px 16px color-mix(in srgb, var(--ink) 12%, transparent)',
        zIndex: 30,
      }}
    >
      <div className="mb-1 font-mono text-xs font-bold text-[var(--ink)]">git reflog</div>
      {reflog.map((entry, i) => {
        const isLost = !currentCommits.has(entry.hash)
        return (
          <div key={`${entry.hash}-${i}`} className="flex items-start gap-2 font-mono text-xs leading-tight">
            <div className="flex-shrink-0 text-[var(--muted)]">HEAD@{`{${i}}`}</div>
            <div className="flex-1 text-[var(--soft)]">
              <div className="text-[var(--ink)]">{entry.hash.slice(0, 7)}</div>
              <div>{entry.message}</div>
            </div>
            {isLost && (
              <button
                onClick={() => onRecover(entry.hash)}
                className="flex-shrink-0 rounded bg-[var(--head)] px-2 py-0.5 text-xs font-bold text-[var(--panel)] transition-opacity hover:opacity-80"
                style={{ cursor: 'pointer' }}
              >
                Recover
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
