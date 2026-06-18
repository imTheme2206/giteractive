import { useTranslation } from 'react-i18next'
import type { TickerEntry } from '../../types'
import { cardRadius } from '../common/radii'
import { diffStates } from './diffStates'
import { DiffView } from './DiffView'

type HistoryEntryProps = {
  entry: TickerEntry
  isExpanded: boolean
  onToggle: () => void
}

export const HistoryEntry = ({ entry, isExpanded, onToggle }: HistoryEntryProps) => {
  const { t } = useTranslation()
  const diff = diffStates(entry.stateBefore, entry.stateAfter)
  const hasChange = diff.some((l) => l.kind !== 'unchanged')

  return (
    <div style={{ borderRadius: cardRadius, border: '1.5px solid var(--hair)' }} className="overflow-hidden bg-panel">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
        style={{ background: 'transparent', border: 'none', cursor: hasChange ? 'pointer' : 'default' }}
        onClick={() => hasChange && onToggle()}
      >
        <span className="flex-1 font-mono text-xs" style={{ color: 'var(--ink)' }}>
          {entry.command}
        </span>
        {hasChange && (
          <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
            {isExpanded ? '▲' : '▼'}
          </span>
        )}
        {!hasChange && entry.stateBefore && (
          <span className="font-hand text-xs" style={{ color: 'var(--muted)' }}>
            {t('commandHistory.noGraphChange')}
          </span>
        )}
      </button>

      {isExpanded && hasChange && (
        <div className="flex flex-col gap-0.5 border-t px-3 pb-3" style={{ borderColor: 'var(--hair)' }}>
          <div className="pt-2 pb-1 font-hand text-xs" style={{ color: 'var(--muted)' }}>
            {t('commandHistory.graphDiff')}
          </div>
          <DiffView lines={diff} />
        </div>
      )}
    </div>
  )
}
