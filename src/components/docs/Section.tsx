type SectionProps = { label: string; children: React.ReactNode };

export const Section = ({ label, children }: SectionProps) => (
  <div>
    <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--muted)] block mb-1.5">
      {label}
    </span>
    {children}
  </div>
);
