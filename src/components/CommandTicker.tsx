import type { TickerEntry } from '../types';

interface CommandTickerProps {
  ticker: { command: string; state: 'idle' | 'ghost' | 'flash' };
  history: TickerEntry[];
}

export function CommandTicker({ ticker, history }: CommandTickerProps) {
  const isIdle = ticker.state === 'idle';
  const isGhost = ticker.state === 'ghost';
  const isFlash = ticker.state === 'flash';

  const latestHistory = history[0];

  return (
    <div
      className={[
        'h-14 flex items-center px-4 gap-2 flex-shrink-0 font-mono text-sm',
        isFlash
          ? 'border-t border-[var(--ok)] text-[var(--ok)]'
          : isGhost
            ? 'border-t border-dashed border-[var(--hair)] text-[var(--ghost)]'
            : 'border-t border-[var(--hair)] text-[var(--soft)]',
      ].join(' ')}
      style={{
        background: isFlash
          ? 'color-mix(in srgb, var(--ok) 8%, var(--panel))'
          : 'var(--panel)',
        transition: 'background 0.4s, border-color 0.3s',
        animation: isFlash ? 'tickerFlash 1.2s ease-out' : undefined,
      }}
    >
      <span>
        {isIdle ? (
          latestHistory ? (
            <>
              <span className="text-[var(--muted)]">$</span>{' '}
              <span className="text-[var(--soft)]">{latestHistory.command}</span>
            </>
          ) : (
            <>
              <span className="text-[var(--muted)]">$</span>{' '}
              <span
                className="inline-block w-2 h-3.5 bg-[var(--muted)] animate-pulse align-middle"
              />
            </>
          )
        ) : (
          <>
            <span className="text-[var(--muted)]">$</span>{' '}
            <span>{ticker.command}</span>
            {isFlash && <span className="ml-1.5">✓</span>}
          </>
        )}
      </span>
    </div>
  );
}
