import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

type CommitNodeData = {
  label: string;
  branch?: string;
  isHead?: boolean;
  isMerge?: boolean;
  isGhost?: boolean;
  showBranchBadge?: boolean;
  showCheckout?: boolean;
  showReset?: boolean;
  [key: string]: unknown;
};

export const CommitGraphNode = ({ data }: { data: CommitNodeData }) => {
  const [hovered, setHovered] = useState(false);

  const branchColor =
    data.isMerge
      ? 'var(--ok)'
      : data.branch === 'main'
        ? 'var(--main)'
        : data.branch === 'feature'
          ? 'var(--feat)'
          : 'var(--ink)';
  const borderStyle = data.isGhost ? 'dashed' : 'solid';
  const bg = data.isGhost
    ? 'transparent'
    : data.isMerge
      ? 'color-mix(in srgb, var(--ok) 12%, var(--panel))'
      : 'var(--panel)';

  return (
    <div
      className="commit-node-body grid place-items-center select-none font-mono font-bold relative"
      style={{
        width: 46,
        height: 46,
        borderRadius: '50%',
        border: `2.2px ${borderStyle} ${branchColor}`,
        background: bg,
        fontSize: data.isMerge ? 18 : 12,
        color: branchColor,
        boxShadow: data.isHead ? `0 0 0 3px var(--head)` : undefined,
        opacity: data.isGhost ? 0.5 : 1,
        cursor: (data.showCheckout || data.showReset) ? 'pointer' : undefined,
      }}
      onMouseEnter={() => (data.showCheckout || data.showReset) && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      {data.label}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      {data.isMerge && (
        <div
          className="absolute whitespace-nowrap font-mono select-none pointer-events-none"
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
          className="absolute -top-1 -right-1 text-[8px] leading-none font-bold rounded-full grid place-items-center nodrag"
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
          className="absolute -bottom-1 -right-1 text-[8px] leading-none font-bold rounded-full grid place-items-center nodrag"
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
          className="absolute -bottom-1 -right-1 text-[8px] leading-none font-bold rounded-full grid place-items-center nodrag"
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
    </div>
  );
};
