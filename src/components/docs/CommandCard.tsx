type CommandCardProps = {
  commandStr: string;
  description: string;
  steps?: string[];
  accent: string;
};

export const CommandCard = ({ commandStr, description, steps, accent }: CommandCardProps) => (
  <div
    className="rounded-lg overflow-hidden"
    style={{ border: '1px solid var(--hair)', background: 'var(--panel2)' }}
  >
    <div
      className="px-2.5 py-1.5 flex items-center gap-1.5"
      style={{
        borderBottom: '1px solid var(--hair)',
        background: `color-mix(in srgb, ${accent} 6%, var(--panel2))`,
      }}
    >
      <span className="font-mono text-xs" style={{ color: accent }}>$</span>
      <code className="font-mono text-xs text-[var(--ink)]">{commandStr}</code>
    </div>
    <div className="px-2.5 py-2 flex flex-col gap-1.5">
      <p className="font-hand text-xs text-[var(--soft)] leading-snug m-0">
        {description}
      </p>
      {steps && (
        <ol className="m-0 pl-0 list-none flex flex-col gap-1">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-1.5 items-start">
              <span className="font-mono text-xs font-bold flex-shrink-0 mt-0.5" style={{ color: accent }}>
                {i + 1}
              </span>
              <span className="font-hand text-xs text-[var(--muted)] leading-snug">
                {step}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  </div>
);
