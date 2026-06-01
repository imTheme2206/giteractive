import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

type CommitNodeData = {
  label: string;
  branch?: string;
  isHead?: boolean;
  isGhost?: boolean;
  showBranchBadge?: boolean;
  showCheckout?: boolean;
  [key: string]: unknown;
};

export const CommitGraphNode = ({ data }: { data: CommitNodeData }) => {
  const [hovered, setHovered] = useState(false);

  const branchColor =
    data.branch === 'main'
      ? 'var(--main)'
      : data.branch === 'feature'
        ? 'var(--feat)'
        : 'var(--ink)';
  const borderStyle = data.isGhost ? 'dashed' : 'solid';

  return (
    <div
      className="commit-node-body grid place-items-center select-none font-mono font-bold relative"
      style={{
        width: 46,
        height: 46,
        borderRadius: '50%',
        border: `2.2px ${borderStyle} ${branchColor}`,
        background: data.isGhost ? 'transparent' : 'var(--panel)',
        fontSize: 12,
        color: branchColor,
        boxShadow: data.isHead ? `0 0 0 3px var(--head)` : undefined,
        opacity: data.isGhost ? 0.5 : 1,
        cursor: data.showCheckout ? 'pointer' : undefined,
      }}
      onMouseEnter={() => data.showCheckout && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      {data.label}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
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
      {data.showCheckout && hovered && (
        <div
          data-checkout-commit="true"
          className="absolute -bottom-1 -right-1 text-[8px] leading-none font-bold rounded-full grid place-items-center nodrag"
          style={{
            width: 14,
            height: 14,
            background: 'var(--muted)',
            color: 'var(--panel)',
            cursor: 'pointer',
          }}
        >
          ↩
        </div>
      )}
    </div>
  );
};
