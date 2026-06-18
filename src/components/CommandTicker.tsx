import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TickerEntry, GitState } from '../types'

type TokenType = 'git' | 'subcommand' | 'branch' | 'hash' | 'flag' | 'string' | 'space'

type ParsedToken = {
  text: string
  type: TokenType
  nodeId?: string
  tip?: string
}

const SUBCOMMAND_TIP_KEYS: Record<string, string> = {
  commit: 'subcommandTips.commit',
  'cherry-pick': 'subcommandTips.cherryPick',
  rebase: 'subcommandTips.rebase',
  merge: 'subcommandTips.merge',
  reset: 'subcommandTips.reset',
  stash: 'subcommandTips.stash',
  checkout: 'subcommandTips.checkout',
}

const parseCommand = (command: string, gitState: GitState): ParsedToken[] => {
  if (!command) return []
  const parts = command.split(/(\s+)/)
  const branches = Object.keys(gitState.branches)
  const commitIds = Object.keys(gitState.commits)

  let nonSpaceIdx = 0
  return parts.map((text) => {
    if (/^\s+$/.test(text)) return { text, type: 'space' }
    const idx = nonSpaceIdx++
    if (idx === 0) return { text, type: 'git' }
    if (idx === 1) {
      const tipKey = SUBCOMMAND_TIP_KEYS[text]
      return { text, type: 'subcommand', tip: tipKey }
    }
    if (text.startsWith('-')) return { text, type: 'flag' }
    if (text.startsWith('"') || text.startsWith("'")) return { text, type: 'string' }
    if (text === 'HEAD') return { text, type: 'branch', nodeId: 'label-HEAD' }
    if (branches.includes(text)) return { text, type: 'branch', nodeId: `branch-${text}` }
    const matchId = commitIds.find((id) => id.startsWith(text))
    if (matchId) return { text, type: 'hash', nodeId: matchId }
    return { text, type: 'string' }
  })
}

const argNodeIds = (tokens: ParsedToken[]) =>
  tokens.filter((t) => t.nodeId && t.type !== 'subcommand').map((t) => t.nodeId!)

type TokenSpanProps = {
  token: ParsedToken
  allTokens: ParsedToken[]
  onEnter: (ids: string[]) => void
  onLeave: () => void
  baseColor: string
}

const TokenSpan = ({ token, allTokens, onEnter, onLeave, baseColor }: TokenSpanProps) => {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(false)

  if (token.type === 'space') return <span>{token.text}</span>

  const isInteractive =
    token.type === 'branch' || token.type === 'hash' || (token.type === 'subcommand' && (!!token.nodeId || !!token.tip))
  const isBranchOrHash = token.type === 'branch' || token.type === 'hash'

  const color =
    hovered && isBranchOrHash
      ? token.type === 'hash'
        ? 'var(--head)'
        : token.text === 'main'
          ? 'var(--main)'
          : 'var(--feat)'
      : token.type === 'flag'
        ? 'var(--muted)'
        : baseColor

  const handleEnter = () => {
    setHovered(true)
    if (token.type === 'subcommand') {
      onEnter(argNodeIds(allTokens))
    } else if (token.nodeId) {
      onEnter([token.nodeId])
    }
  }

  const handleLeave = () => {
    setHovered(false)
    onLeave()
  }

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
          {t(token.tip as Parameters<typeof t>[0])}
        </span>
      )}
    </span>
  )
}

const TokenizedCommand = ({
  command,
  gitState,
  baseColor,
  onTokenHover,
}: {
  command: string
  gitState: GitState
  baseColor: string
  onTokenHover: (ids: string[]) => void
}) => {
  const tokens = parseCommand(command, gitState)
  return (
    <>
      {tokens.map((token, i) => (
        <TokenSpan key={i} token={token} allTokens={tokens} onEnter={onTokenHover} onLeave={() => onTokenHover([])} baseColor={baseColor} />
      ))}
    </>
  )
}

const COMMAND_SUBTITLE_KEYS: Array<[string, string]> = [
  ['git commit', 'tickerSubtitles.commit'],
  ['git checkout -b', 'tickerSubtitles.checkoutB'],
  ['git switch -c', 'tickerSubtitles.switchC'],
  ['git checkout', 'tickerSubtitles.checkout'],
  ['git switch', 'tickerSubtitles.switch'],
  ['git cherry-pick', 'tickerSubtitles.cherryPick'],
  ['git rebase -i', 'tickerSubtitles.rebaseI'],
  ['git rebase', 'tickerSubtitles.rebase'],
  ['git merge', 'tickerSubtitles.merge'],
  ['git reset --hard', 'tickerSubtitles.resetHard'],
  ['git stash pop', 'tickerSubtitles.stashPop'],
  ['git stash', 'tickerSubtitles.stash'],
  ['git reflog', 'tickerSubtitles.reflog'],
]

const getCommandSubtitleKey = (input: string): string | null => {
  for (const [prefix, key] of COMMAND_SUBTITLE_KEYS) {
    if (input.startsWith(prefix)) return key
  }
  return null
}

type CommandTickerProps = {
  inputValue: string
  isValid: boolean
  suggestions: string[]
  activeSuggestionIdx: number
  onInputChange: (val: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onSuggestionSelect: (s: string) => void
  ticker: { command: string; subtitle?: string; state: 'idle' | 'ghost' | 'flash' }
  history: TickerEntry[]
  gitState: GitState
  onTokenHover: (nodeIds: string[]) => void
}

export const CommandTicker = ({
  inputValue,
  isValid,
  suggestions,
  activeSuggestionIdx,
  onInputChange,
  onKeyDown,
  onSuggestionSelect,
  ticker,
  history,
  gitState,
  onTokenHover,
}: CommandTickerProps) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const isFlash = ticker.state === 'flash'
  const isGhost = ticker.state === 'ghost'
  const latestHistory = history[0]
  const showSuggestions = suggestions.length > 0 && !isFlash

  useEffect(() => {
    if (!isFlash) inputRef.current?.focus()
  }, [isFlash])

  const inputColor = isValid ? 'var(--ok)' : inputValue ? 'var(--ink)' : 'var(--soft)'
  const inputSubtitleKey = isValid && inputValue ? getCommandSubtitleKey(inputValue) : null
  const inputSubtitle = inputSubtitleKey ? t(inputSubtitleKey as Parameters<typeof t>[0]) : null

  return (
    <div
      className="shrink-0"
      style={{
        background: isFlash
          ? 'color-mix(in srgb, var(--ok) 8%, var(--panel))'
          : isGhost
            ? 'color-mix(in srgb, var(--ghost) 6%, var(--panel))'
            : 'var(--panel)',
        borderTop: isFlash
          ? '1px solid var(--ok)'
          : isGhost
            ? '1px solid color-mix(in srgb, var(--ghost) 40%, transparent)'
            : '1px solid var(--hair)',
        transition: 'background 0.4s, border-color 0.3s',
        animation: isFlash ? 'tickerFlash 1.2s ease-out' : undefined,
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Suggestions — normal flow, above input line */}
      {showSuggestions && !isGhost && (
        <div className="flex flex-wrap gap-1 px-4 pt-2 pb-0">
          {suggestions.map((s, i) => {
            const isActive = i === activeSuggestionIdx
            return (
              <button
                key={s}
                className="font-mono text-xs px-2 py-0.5 rounded"
                style={{
                  background: isActive
                    ? 'color-mix(in srgb, var(--ok) 18%, var(--panel2))'
                    : 'var(--panel2)',
                  color: isActive ? 'var(--ok)' : 'var(--soft)',
                  border: `1px solid ${isActive ? 'var(--ok)' : 'var(--hair)'}`,
                  cursor: 'pointer',
                  transition: 'background 0.1s, color 0.1s, border-color 0.1s',
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onSuggestionSelect(s)
                }}
              >
                {s}
              </button>
            )
          })}
          <span className="font-mono text-xs self-center" style={{ color: 'var(--muted)', opacity: 0.6 }}>
            tab
          </span>
        </div>
      )}

      {/* Ghost state — dim command preview + subtitle, replaces input */}
      {isGhost ? (
        <div>
          <div className="flex items-center px-4 font-mono text-sm" style={{ minHeight: 44 }}>
            <span style={{ color: 'var(--muted)', flexShrink: 0 }}>$</span>
            <span style={{ marginLeft: '0.35em', flexShrink: 0 }} />
            <span style={{ opacity: 0.55 }}>
              <TokenizedCommand
                command={ticker.command}
                gitState={gitState}
                baseColor="var(--ghost)"
                onTokenHover={onTokenHover}
              />
            </span>
          </div>
          {(ticker.subtitle ?? (getCommandSubtitleKey(ticker.command) ? t(getCommandSubtitleKey(ticker.command)! as Parameters<typeof t>[0]) : null)) && (
            <div className="px-4 pb-2 font-hand text-xs" style={{ color: 'var(--muted)' }}>
              {ticker.subtitle ?? t(getCommandSubtitleKey(ticker.command)! as Parameters<typeof t>[0])}
            </div>
          )}
        </div>
      ) : (
        /* Input / flash line */
        <div
          className="flex flex-col"
          style={{ paddingTop: showSuggestions ? 6 : undefined, paddingBottom: showSuggestions ? 8 : undefined }}
        >
          <div className="flex items-center px-4 font-mono text-sm" style={{ minHeight: 44 }}>
            <span style={{ color: 'var(--muted)', flexShrink: 0 }}>$</span>
            <span style={{ marginLeft: '0.35em', flexShrink: 0 }} />

            {isFlash ? (
              <span style={{ color: 'var(--ok)' }}>
                <TokenizedCommand command={ticker.command} gitState={gitState} baseColor="var(--ok)" onTokenHover={onTokenHover} />
                <span className="ml-1.5">✓</span>
              </span>
            ) : (
              <span className="relative flex min-w-0 flex-1 items-center">
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none"
                  style={{
                    color: inputColor,
                    caretColor: 'var(--ink)',
                    border: 'none',
                    padding: 0,
                    transition: 'color 0.15s',
                  }}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                />
                {!inputValue && (
                  <span
                    className="pointer-events-none absolute inset-0 font-mono text-sm"
                    style={{ color: 'var(--muted)', opacity: 0.45 }}
                    aria-hidden
                  >
                    {latestHistory ? (
                      <TokenizedCommand
                        command={latestHistory.command}
                        gitState={gitState}
                        baseColor="var(--muted)"
                        onTokenHover={() => {}}
                      />
                    ) : (
                      t('ticker.placeholder')
                    )}
                  </span>
                )}
              </span>
            )}
          </div>
          {/* Valid-command subtitle — shown while user has typed a complete command */}
          {inputSubtitle && (
            <div
              className="px-4 pb-2 font-hand text-xs"
              style={{ color: 'var(--ok)', opacity: 0.75, marginTop: -8 }}
            >
              ↵ {inputSubtitle}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
