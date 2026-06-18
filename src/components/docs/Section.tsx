type SectionProps = { label: string; children: React.ReactNode }

export const Section = ({ label, children }: SectionProps) => (
  <div>
    <span className="mb-1.5 block font-mono text-xs tracking-widest text-muted uppercase">{label}</span>
    {children}
  </div>
)
