import { Handle, NodeToolbar, Position } from '@xyflow/react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type CommitNodeData = {
  label: string
  branch?: string
  isHead?: boolean
  isMerge?: boolean
  isGhost?: boolean
  isWip?: boolean
  wipMessage?: string
  message?: string
  hash?: string
  parentIds?: string[]
  showBranchBadge?: boolean
  showCheckout?: boolean
  showReset?: boolean
  showSquash?: boolean
  highlighted?: boolean
  [key: string]: unknown
}

export const CommitGraphNode = ({ data }: { data: CommitNodeData }) => {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setTooltipVisible(true), 150)
  }

  const onMouseLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
    setTooltipVisible(false)
  }

  const branchColor = data.isMerge
    ? 'var(--ok)'
    : data.branch === 'main'
      ? 'var(--main)'
      : data.branch === 'feature'
        ? 'var(--feat)'
        : 'var(--ink)'
  const borderStyle = data.isGhost ? 'dashed' : 'solid'
  const bg = data.isGhost
    ? hovered && data.isWip
      ? `color-mix(in srgb, ${branchColor} 8%, var(--panel))`
      : 'transparent'
    : data.isMerge
      ? 'color-mix(in srgb, var(--ok) 12%, var(--panel))'
      : 'var(--panel)'

  return (
    <div
      className="commit-node-body relative grid place-items-center font-mono font-bold select-none"
      style={{
        width: 46,
        height: 46,
        borderRadius: '50%',
        border: `2.2px ${borderStyle} ${branchColor}`,
        background: bg,
        fontSize: data.isMerge ? 18 : 12,
        color: branchColor,
        boxShadow:
          [
            data.isHead ? '0 0 0 3px var(--head)' : null,
            data.highlighted ? `0 0 0 ${data.isHead ? 6 : 4}px color-mix(in srgb, ${branchColor} 45%, transparent)` : null,
          ]
            .filter(Boolean)
            .join(', ') || undefined,
        opacity: data.isGhost ? (hovered && data.isWip ? 0.85 : 0.5) : 1,
        cursor: data.showCheckout || data.showReset || data.isWip ? 'pointer' : undefined,
        transition: 'opacity 0.15s, background 0.15s',
      }}
      onMouseEnter={() => {
        setHovered(true)
        onMouseEnter()
      }}
      onMouseLeave={() => {
        setHovered(false)
        onMouseLeave()
      }}
      title={data.isWip ? 'Click to commit (git commit)' : undefined}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      {data.label}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      {data.isWip && (
        <div
          className="pointer-events-none absolute font-mono whitespace-nowrap select-none"
          style={{
            bottom: -18,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 9,
            color: branchColor,
            letterSpacing: '0.04em',
            opacity: hovered ? 1 : 0.55,
            transition: 'opacity 0.15s',
          }}
        >
          {hovered
            ? 'click to commit'
            : data.wipMessage
              ? data.wipMessage.length > 18
                ? `${data.wipMessage.slice(0, 16)}…`
                : data.wipMessage
              : 'click to commit'}
        </div>
      )}
      {!data.isGhost && data.message && (
        <NodeToolbar isVisible={tooltipVisible} position={Position.Right} offset={14}>
          <div
            className="pointer-events-none"
            style={{
              width: 200,
              background: 'var(--panel)',
              border: `1.5px solid ${branchColor}`,
              borderRadius: '12px 4px 12px 4px/4px 12px 4px 12px',
              padding: '7px 10px',
              boxShadow: '0 4px 16px color-mix(in srgb, var(--ink) 12%, transparent)',
            }}
          >
            <div className="mb-0.5 font-mono text-xs" style={{ color: 'var(--muted)' }}>
              <span style={{ color: branchColor }}>{t('tooltips.commit.hash')}:</span> {data.hash ? (data.hash as string).slice(0, 7) : ''}
            </div>
            <div className="mb-0.5 font-mono text-xs" style={{ color: 'var(--muted)' }}>
              <span style={{ color: branchColor }}>{t('tooltips.commit.branch')}:</span> {data.branch as string}
            </div>
            {Array.isArray(data.parentIds) && (data.parentIds as string[]).length > 0 && (
              <div className="mb-0.5 font-mono text-xs" style={{ color: 'var(--muted)' }}>
                <span style={{ color: branchColor }}>{t('tooltips.commit.parents')}:</span>{' '}
                {(data.parentIds as string[]).map((p) => p.slice(0, 7)).join(', ')}
              </div>
            )}
            <div
              className="mt-1 pt-1 font-mono text-xs leading-snug"
              style={{
                color: 'var(--ink)',
                wordBreak: 'break-word',
                borderTop: `1px solid color-mix(in srgb, ${branchColor} 25%, transparent)`,
              }}
            >
              {data.message as string}
            </div>
          </div>
        </NodeToolbar>
      )}
      {data.isMerge && (
        <div
          className="pointer-events-none absolute font-mono whitespace-nowrap select-none"
          style={{
            bottom: -18,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 9,
            color: 'var(--ok)',
            letterSpacing: '0.05em',
          }}
        >
          merge
        </div>
      )}
      {data.showBranchBadge && (
        <div
          data-branch-badge="true"
          className="nodrag absolute -top-1 -right-1 grid place-items-center rounded-full text-xs leading-none font-bold"
          style={{
            width: 14,
            height: 14,
            background: 'var(--feat)',
            color: 'var(--panel)',
            cursor: 'pointer',
          }}
        >
          ⎇
        </div>
      )}
      {data.showCheckout && (
        <div
          data-checkout-commit="true"
          title="Checkout this commit"
          className="nodrag absolute -right-1 -bottom-1 grid place-items-center rounded-full text-xs leading-none font-bold"
          style={{
            width: 14,
            height: 14,
            background: hovered ? 'var(--muted)' : 'color-mix(in srgb, var(--muted) 55%, transparent)',
            color: 'var(--panel)',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
        >
          ↩
        </div>
      )}
      {data.showReset && (
        <div
          data-reset-commit="true"
          title="git reset --hard to here"
          className="nodrag absolute -right-1 -bottom-1 grid place-items-center rounded-full text-xs leading-none font-bold"
          style={{
            width: 14,
            height: 14,
            background: hovered ? 'var(--head)' : 'color-mix(in srgb, var(--head) 50%, transparent)',
            color: 'var(--panel)',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
        >
          ↺
        </div>
      )}
      {data.showSquash && (
        <div
          data-squash-commit="true"
          title="Squash commits (git rebase -i)"
          className="nodrag absolute -right-1 -bottom-1 grid place-items-center rounded-full text-xs leading-none font-bold"
          style={{
            width: 14,
            height: 14,
            background: hovered ? 'var(--feat)' : 'color-mix(in srgb, var(--feat) 50%, transparent)',
            color: 'var(--panel)',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
        >
          ⊕
        </div>
      )}
    </div>
  )
}
