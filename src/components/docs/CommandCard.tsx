type CommandCardProps = {
  commandStr: string
  description: string
  steps?: string[]
  accent: string
}

export const CommandCard = ({ commandStr, description, steps, accent }: CommandCardProps) => (
  <div className="overflow-hidden rounded-lg" style={{ border: '1px solid var(--hair)', background: 'var(--panel2)' }}>
    <div
      className="flex items-center gap-1.5 px-2.5 py-1.5"
      style={{
        borderBottom: '1px solid var(--hair)',
        background: `color-mix(in srgb, ${accent} 6%, var(--panel2))`,
      }}
    >
      <span className="font-mono text-xs" style={{ color: accent }}>
        $
      </span>
      <code className="font-mono text-xs text-[var(--ink)]">{commandStr}</code>
    </div>
    <div className="flex flex-col gap-1.5 px-2.5 py-2">
      <p className="m-0 font-hand text-xs leading-snug text-[var(--soft)]">{description}</p>
      {steps && (
        <ol className="m-0 flex list-none flex-col gap-1 pl-0">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="mt-0.5 flex-shrink-0 font-mono text-xs font-bold" style={{ color: accent }}>
                {i + 1}
              </span>
              <span className="font-hand text-xs leading-snug text-[var(--muted)]">{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  </div>
)
