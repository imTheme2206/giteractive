import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TickerEntry } from '../../types'
import { HistoryEntry } from './HistoryEntry'

type CommandHistoryTabProps = {
  history: TickerEntry[]
}

export const CommandHistoryTab = ({ history }: CommandHistoryTabProps) => {
  const { t } = useTranslation()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (history.length === 0) {
    return <div className="flex flex-1 items-center justify-center font-hand text-sm text-[var(--muted)]">{t('commandHistory.empty')}</div>
  }

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
      {history.map((entry) => (
        <HistoryEntry
          key={entry.id}
          entry={entry}
          isExpanded={expandedId === entry.id}
          onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
        />
      ))}
    </div>
  )
}
