import { Handle, Position } from '@xyflow/react'

export const AddCommitNode = ({ data }: { data: { disabled?: boolean; [key: string]: unknown } }) => {
  return (
    <div
      className="grid place-items-center select-none"
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: `2.2px dashed ${data.disabled ? 'var(--muted)' : 'var(--ok)'}`,
        background: 'transparent',
        fontSize: 22,
        fontWeight: 300,
        color: data.disabled ? 'var(--muted)' : 'var(--ok)',
        cursor: data.disabled ? 'not-allowed' : 'pointer',
        animation: data.disabled ? 'none' : 'pulse 1.8s ease-in-out infinite',
        opacity: data.disabled ? 0.5 : 1,
      }}
      title={data.disabled ? 'Detached HEAD — create a branch first to commit' : undefined}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />+
    </div>
  )
}
