import type { ReactNode } from 'react'
import { cn } from './cn'

type SectionLabelProps = {
  children: ReactNode
  className?: string
}

export const SectionLabel = ({ children, className }: SectionLabelProps) => (
  <span className={cn('mt-3 mb-1 block flex-shrink-0 font-mono text-xs tracking-widest text-muted uppercase', className)}>
    {children}
  </span>
)
