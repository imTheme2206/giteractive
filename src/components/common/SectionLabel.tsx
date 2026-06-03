import type { ReactNode } from 'react';
import { cn } from './cn';

type SectionLabelProps = {
  children: ReactNode;
  className?: string;
};

export const SectionLabel = ({ children, className }: SectionLabelProps) => (
  <span className={cn('font-mono text-xs uppercase tracking-widest text-[var(--muted)] mt-3 mb-1 block flex-shrink-0', className)}>
    {children}
  </span>
);
