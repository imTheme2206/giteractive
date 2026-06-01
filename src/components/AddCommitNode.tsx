import { Handle, Position } from '@xyflow/react';

export function AddCommitNode({
  data: _data,
}: {
  data: { [key: string]: unknown };
}) {
  return (
    <div
      className="grid place-items-center select-none cursor-pointer text-[var(--ok)]"
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '2.2px dashed var(--ok)',
        background: 'transparent',
        fontSize: 22,
        fontWeight: 300,
        animation: 'pulse 1.8s ease-in-out infinite',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      +
    </div>
  );
}
