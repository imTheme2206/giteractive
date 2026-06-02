import type { ReactNode } from 'react';
import { cn } from './cn';
import { pillRadius } from './radii';

type ButtonGroupProps = {
  children: ReactNode;
  className?: string;
};

export const ButtonGroup = ({ children, className }: ButtonGroupProps) => (
  <div
    className={cn('flex border border-[var(--hair)] overflow-hidden flex-shrink-0', className)}
    style={{ borderRadius: pillRadius }}
  >
    {children}
  </div>
);
