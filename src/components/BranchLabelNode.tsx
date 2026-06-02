import { Handle, Position } from '@xyflow/react';

type BranchLabelData = {
  label: string;
  branch: string;
  showCheckout?: boolean;
  isDetached?: boolean;
  canDrag?: boolean;
  [key: string]: unknown;
};

export const BranchLabelNode = ({ data }: { data: BranchLabelData }) => {
  const color =
    data.branch === 'HEAD'
      ? 'var(--head)'
      : data.branch === 'main'
        ? 'var(--main)'
        : 'var(--feat)';

  const borderStyle = data.branch === 'HEAD' && data.isDetached ? 'dashed' : 'solid';
  const isHead = data.branch === 'HEAD';

  return (
    <div
      data-checkout-branch={data.showCheckout ? data.branch : undefined}
      title={
        data.showCheckout
          ? `Checkout ${data.branch}`
          : data.canDrag && !isHead
            ? `Drag to merge or rebase ${data.branch}`
            : undefined
      }
      className="font-mono font-bold text-xs bg-[var(--panel)] whitespace-nowrap flex items-center gap-1"
      style={{
        padding: '4px 11px',
        borderRadius: '60px 10px 60px 10px/10px 60px 10px 60px',
        border: `2px ${borderStyle} ${color}`,
        color,
        cursor: data.showCheckout ? 'pointer' : data.canDrag && !isHead ? 'grab' : 'default',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      {data.canDrag && !isHead && (
        <span style={{ opacity: 0.45, fontSize: 9, letterSpacing: '-1px' }}>⠿</span>
      )}
      {data.label}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
};
