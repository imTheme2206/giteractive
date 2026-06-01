import { Handle, Position } from '@xyflow/react';

interface BranchLabelData {
  label: string;
  branch: string;
  [key: string]: unknown;
}

export function BranchLabelNode({ data }: { data: BranchLabelData }) {
  const color =
    data.branch === 'HEAD'
      ? 'var(--head)'
      : data.branch === 'main'
        ? 'var(--main)'
        : 'var(--feat)';
  return (
    <div
      className="font-mono font-bold text-xs bg-[var(--panel)] whitespace-nowrap cursor-grab"
      style={{
        padding: '4px 11px',
        borderRadius: '60px 10px 60px 10px/10px 60px 10px 60px',
        border: `2px solid ${color}`,
        color,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      {data.label}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}
