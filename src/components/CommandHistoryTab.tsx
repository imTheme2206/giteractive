import { useState } from 'react';
import type { GitState, TickerEntry } from '../types';
import { cardRadius } from './common/radii';

type DiffLine = {
  kind: 'added' | 'removed' | 'unchanged';
  text: string;
};

const diffStates = (before: GitState | undefined, after: GitState | undefined): DiffLine[] => {
  if (!before || !after) return [];

  const lines: DiffLine[] = [];

  const allBranches = new Set([...Object.keys(before.branches), ...Object.keys(after.branches)]);
  for (const branch of allBranches) {
    const tipBefore = before.branches[branch];
    const tipAfter = after.branches[branch];
    if (tipBefore === tipAfter) {
      if (tipBefore) lines.push({ kind: 'unchanged', text: `${branch} → ${tipBefore}` });
    } else if (!tipBefore) {
      lines.push({ kind: 'added', text: `${branch} → ${tipAfter}` });
    } else if (!tipAfter) {
      lines.push({ kind: 'removed', text: `${branch} → ${tipBefore}` });
    } else {
      lines.push({ kind: 'removed', text: `${branch} → ${tipBefore}` });
      lines.push({ kind: 'added', text: `${branch} → ${tipAfter}` });
    }
  }

  const addedCommits = Object.keys(after.commits).filter(id => !before.commits[id]);
  const removedCommits = Object.keys(before.commits).filter(id => !after.commits[id]);

  for (const id of removedCommits) {
    const c = before.commits[id];
    if (c) lines.push({ kind: 'removed', text: `commit ${id}: ${c.message}` });
  }
  for (const id of addedCommits) {
    const c = after.commits[id];
    if (c) lines.push({ kind: 'added', text: `commit ${id}: ${c.message}` });
  }

  if (before.HEAD !== after.HEAD) {
    lines.push({ kind: 'removed', text: `HEAD → ${before.HEAD}` });
    lines.push({ kind: 'added', text: `HEAD → ${after.HEAD}` });
  }

  return lines;
};

const hasDiff = (entry: TickerEntry): boolean => {
  if (!entry.stateBefore || !entry.stateAfter) return false;
  const diff = diffStates(entry.stateBefore, entry.stateAfter);
  return diff.some(l => l.kind !== 'unchanged');
};

type CommandHistoryTabProps = {
  history: TickerEntry[];
};

export const CommandHistoryTab = ({ history }: CommandHistoryTabProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (history.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--muted)] text-sm font-hand">
        No commands yet — interact with the canvas to see history here.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
      {history.map(entry => {
        const isExpanded = expandedId === entry.id;
        const diff = diffStates(entry.stateBefore, entry.stateAfter);
        const hasChange = diff.some(l => l.kind !== 'unchanged');

        return (
          <div
            key={entry.id}
            style={{ borderRadius: cardRadius, border: '1.5px solid var(--hair)' }}
            className="bg-[var(--panel)] overflow-hidden"
          >
            <button
              type="button"
              className="w-full text-left px-3 py-2 flex items-center gap-2"
              style={{ background: 'transparent', border: 'none', cursor: hasChange ? 'pointer' : 'default' }}
              onClick={() => hasChange && setExpandedId(isExpanded ? null : entry.id)}
            >
              <span
                className="font-mono text-xs flex-1"
                style={{ color: 'var(--ink)' }}
              >
                {entry.command}
              </span>
              {hasChange && (
                <span
                  className="text-[10px] font-mono"
                  style={{ color: 'var(--muted)' }}
                >
                  {isExpanded ? '▲' : '▼'}
                </span>
              )}
              {!hasChange && entry.stateBefore && (
                <span
                  className="text-[10px] font-hand"
                  style={{ color: 'var(--muted)' }}
                >
                  no graph change
                </span>
              )}
            </button>

            {isExpanded && hasChange && (
              <div
                className="px-3 pb-3 flex flex-col gap-0.5 border-t"
                style={{ borderColor: 'var(--hair)' }}
              >
                <div
                  className="text-[10px] font-hand pt-2 pb-1"
                  style={{ color: 'var(--muted)' }}
                >
                  graph diff
                </div>
                {diff.map((line, i) => (
                  <div
                    key={i}
                    className="font-mono text-[11px] px-2 py-0.5 rounded"
                    style={{
                      background: line.kind === 'added'
                        ? 'color-mix(in srgb, var(--ok) 12%, transparent)'
                        : line.kind === 'removed'
                          ? 'color-mix(in srgb, var(--conflict) 12%, transparent)'
                          : 'transparent',
                      color: line.kind === 'added'
                        ? 'var(--ok)'
                        : line.kind === 'removed'
                          ? 'var(--conflict)'
                          : 'var(--muted)',
                    }}
                  >
                    {line.kind === 'added' ? '+ ' : line.kind === 'removed' ? '− ' : '  '}
                    {line.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
