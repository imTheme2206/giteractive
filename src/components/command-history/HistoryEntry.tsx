import { useTranslation } from 'react-i18next';
import type { TickerEntry } from '../../types';
import { cardRadius } from '../common/radii';
import { diffStates } from './diffStates';
import { DiffView } from './DiffView';

type HistoryEntryProps = {
  entry: TickerEntry;
  isExpanded: boolean;
  onToggle: () => void;
};

export const HistoryEntry = ({ entry, isExpanded, onToggle }: HistoryEntryProps) => {
  const { t } = useTranslation();
  const diff = diffStates(entry.stateBefore, entry.stateAfter);
  const hasChange = diff.some(l => l.kind !== 'unchanged');

  return (
    <div
      style={{ borderRadius: cardRadius, border: '1.5px solid var(--hair)' }}
      className="bg-[var(--panel)] overflow-hidden"
    >
      <button
        type="button"
        className="w-full text-left px-3 py-2 flex items-center gap-2"
        style={{ background: 'transparent', border: 'none', cursor: hasChange ? 'pointer' : 'default' }}
        onClick={() => hasChange && onToggle()}
      >
        <span className="font-mono text-xs flex-1" style={{ color: 'var(--ink)' }}>
          {entry.command}
        </span>
        {hasChange && (
          <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
            {isExpanded ? '▲' : '▼'}
          </span>
        )}
        {!hasChange && entry.stateBefore && (
          <span className="text-xs font-hand" style={{ color: 'var(--muted)' }}>
            {t('commandHistory.noGraphChange')}
          </span>
        )}
      </button>

      {isExpanded && hasChange && (
        <div className="px-3 pb-3 flex flex-col gap-0.5 border-t" style={{ borderColor: 'var(--hair)' }}>
          <div className="text-xs font-hand pt-2 pb-1" style={{ color: 'var(--muted)' }}>
            {t('commandHistory.graphDiff')}
          </div>
          <DiffView lines={diff} />
        </div>
      )}
    </div>
  );
};
