import { useState } from 'react';
import type { TickerEntry, GitState } from '../types';

type CommandTickerProps = {
  ticker: { command: string; subtitle?: string; state: 'idle' | 'ghost' | 'flash' };
  history: TickerEntry[];
  gitState: GitState;
  onTokenHover: (nodeIds: string[]) => void;
};

type TokenType = 'git' | 'subcommand' | 'branch' | 'hash' | 'flag' | 'string' | 'space';

type ParsedToken = {
  text: string;
  type: TokenType;
  nodeId?: string;
  tip?: string;
};

const SUBCOMMAND_TIPS: Record<string, string> = {
  commit: 'Snapshots staged changes into a new node in the graph.',
  'cherry-pick': 'Copies one commit onto the current branch — the hash changes on re-apply.',
  rebase: 'Lifts commits off their base and re-applies them atop another branch. History is rewritten.',
  merge: 'Joins two branch histories with a new merge commit. Original hashes are preserved.',
  reset: 'Moves the branch pointer backward, permanently erasing commits after the target.',
  stash: 'Saves uncommitted changes to a temporary stack; leaves a clean working tree.',
  checkout: 'Moves HEAD to a branch or commit, updating what you\'re working on.',
};

const parseCommand = (command: string, gitState: GitState): ParsedToken[] => {
  if (!command) return [];
  const parts = command.split(/(\s+)/);
  const branches = Object.keys(gitState.branches);
  const commitIds = Object.keys(gitState.commits);

  let nonSpaceIdx = 0;
  return parts.map(text => {
    if (/^\s+$/.test(text)) return { text, type: 'space' };
    const idx = nonSpaceIdx++;
    if (idx === 0) return { text, type: 'git' };
    if (idx === 1) {
      const tip = SUBCOMMAND_TIPS[text];
      return { text, type: 'subcommand', tip };
    }
    if (text.startsWith('-')) return { text, type: 'flag' };
    if (text.startsWith('"') || text.startsWith("'")) return { text, type: 'string' };
    if (text === 'HEAD') return { text, type: 'branch', nodeId: 'label-HEAD' };
    if (branches.includes(text)) return { text, type: 'branch', nodeId: `branch-${text}` };
    const matchId = commitIds.find(id => id.startsWith(text));
    if (matchId) return { text, type: 'hash', nodeId: matchId };
    return { text, type: 'string' };
  });
};

const argNodeIds = (tokens: ParsedToken[]) =>
  tokens.filter(t => t.nodeId && t.type !== 'subcommand').map(t => t.nodeId!);

type TokenSpanProps = {
  token: ParsedToken;
  allTokens: ParsedToken[];
  onEnter: (ids: string[]) => void;
  onLeave: () => void;
  baseColor: string;
};

const TokenSpan = ({ token, allTokens, onEnter, onLeave, baseColor }: TokenSpanProps) => {
  const [hovered, setHovered] = useState(false);

  if (token.type === 'space') return <span>{token.text}</span>;

  const isInteractive = token.type === 'branch' || token.type === 'hash' || (token.type === 'subcommand' && (!!token.nodeId || !!token.tip));
  const isBranchOrHash = token.type === 'branch' || token.type === 'hash';

  const color = hovered && isBranchOrHash
    ? token.type === 'hash'
      ? 'var(--head)'
      : token.text === 'main'
        ? 'var(--main)'
        : 'var(--feat)'
    : token.type === 'flag'
      ? 'var(--muted)'
      : baseColor;

  const handleEnter = () => {
    setHovered(true);
    if (token.type === 'subcommand') {
      onEnter(argNodeIds(allTokens));
    } else if (token.nodeId) {
      onEnter([token.nodeId]);
    }
  };

  const handleLeave = () => {
    setHovered(false);
    onLeave();
  };

  return (
    <span
      style={{
        position: 'relative',
        color,
        cursor: isInteractive ? 'help' : undefined,
        textDecoration: isInteractive ? 'underline dotted' : undefined,
        textUnderlineOffset: '3px',
        transition: 'color 0.15s',
      }}
      onMouseEnter={isInteractive ? handleEnter : undefined}
      onMouseLeave={isInteractive ? handleLeave : undefined}
    >
      {token.text}
      {hovered && token.tip && (
        <span
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0,
            width: 220,
            background: 'var(--panel)',
            border: '1.5px solid var(--hair)',
            borderRadius: '8px 3px 8px 3px / 3px 8px 3px 8px',
            padding: '6px 10px',
            fontSize: 11,
            fontFamily: 'var(--hand)',
            color: 'var(--ink)',
            lineHeight: 1.5,
            pointerEvents: 'none',
            zIndex: 50,
            boxShadow: '0 4px 16px color-mix(in srgb, var(--ink) 12%, transparent)',
            whiteSpace: 'normal',
          }}
        >
          {token.tip}
        </span>
      )}
    </span>
  );
};

const TokenizedCommand = ({
  command,
  gitState,
  baseColor,
  onTokenHover,
}: {
  command: string;
  gitState: GitState;
  baseColor: string;
  onTokenHover: (ids: string[]) => void;
}) => {
  const tokens = parseCommand(command, gitState);
  return (
    <>
      {tokens.map((token, i) => (
        <TokenSpan
          key={i}
          token={token}
          allTokens={tokens}
          onEnter={onTokenHover}
          onLeave={() => onTokenHover([])}
          baseColor={baseColor}
        />
      ))}
    </>
  );
};

export const CommandTicker = ({ ticker, history, gitState, onTokenHover }: CommandTickerProps) => {
  const isIdle = ticker.state === 'idle';
  const isGhost = ticker.state === 'ghost';
  const isFlash = ticker.state === 'flash';

  const latestHistory = history[0];

  const lineColor = isFlash
    ? 'var(--ok)'
    : isGhost
      ? 'var(--ghost)'
      : 'var(--soft)';

  const hasSubtitle = isGhost && !!ticker.subtitle;

  return (
    <div
      className={[
        'flex flex-col justify-center px-4 gap-0.5 flex-shrink-0 font-mono text-sm',
        isFlash
          ? 'border-t border-[var(--ok)] text-[var(--ok)]'
          : isGhost
            ? 'border-t border-dashed border-[var(--hair)] text-[var(--ghost)]'
            : 'border-t border-[var(--hair)] text-[var(--soft)]',
      ].join(' ')}
      style={{
        minHeight: 56,
        paddingTop: hasSubtitle ? 8 : undefined,
        paddingBottom: hasSubtitle ? 8 : undefined,
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
              <TokenizedCommand
                command={latestHistory.command}
                gitState={gitState}
                baseColor="var(--soft)"
                onTokenHover={onTokenHover}
              />
            </>
          ) : (
            <>
              <span className="text-[var(--muted)]">$</span>{' '}
              <span className="inline-block w-2 h-3.5 bg-[var(--muted)] animate-pulse align-middle" />
            </>
          )
        ) : (
          <>
            <span className="text-[var(--muted)]">$</span>{' '}
            <TokenizedCommand
              command={ticker.command}
              gitState={gitState}
              baseColor={lineColor}
              onTokenHover={onTokenHover}
            />
            {isFlash && <span className="ml-1.5">✓</span>}
          </>
        )}
      </span>
      {hasSubtitle && (
        <span
          className="text-xs text-[var(--muted)] leading-tight"
          style={{ fontFamily: 'var(--hand)', paddingLeft: '1.1em' }}
        >
          {ticker.subtitle}
        </span>
      )}
    </div>
  );
};
