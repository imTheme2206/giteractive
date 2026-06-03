import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TickerEntry } from '../../types';
import { HistoryEntry } from './HistoryEntry';

type CommandHistoryTabProps = {
  history: TickerEntry[];
};

export const CommandHistoryTab = ({ history }: CommandHistoryTabProps) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (history.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--muted)] text-sm font-hand">
        {t('commandHistory.empty')}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
      {history.map(entry => (
        <HistoryEntry
          key={entry.id}
          entry={entry}
          isExpanded={expandedId === entry.id}
          onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
        />
      ))}
    </div>
  );
};
