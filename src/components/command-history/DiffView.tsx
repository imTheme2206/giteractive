import type { DiffLine } from './diffStates'

type DiffViewProps = {
  lines: DiffLine[]
}

export const DiffView = ({ lines }: DiffViewProps) => (
  <div className="flex flex-col gap-0.5">
    {lines.map((line, i) => (
      <div
        key={i}
        className="rounded px-2 py-0.5 font-mono text-xs"
        style={{
          background:
            line.kind === 'added'
              ? 'color-mix(in srgb, var(--ok) 12%, transparent)'
              : line.kind === 'removed'
                ? 'color-mix(in srgb, var(--conflict) 12%, transparent)'
                : 'transparent',
          color: line.kind === 'added' ? 'var(--ok)' : line.kind === 'removed' ? 'var(--conflict)' : 'var(--muted)',
        }}
      >
        {line.kind === 'added' ? '+ ' : line.kind === 'removed' ? '− ' : '  '}
        {line.text}
      </div>
    ))}
  </div>
)
