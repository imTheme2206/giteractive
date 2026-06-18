import type { ReactNode } from 'react'
import { cn } from './cn'
import { pillRadius } from './radii'

type ButtonGroupProps = {
  children: ReactNode
  className?: string
}

export const ButtonGroup = ({ children, className }: ButtonGroupProps) => (
  <div className={cn('flex flex-shrink-0 overflow-hidden border border-hair', className)} style={{ borderRadius: pillRadius }}>
    {children}
  </div>
)
