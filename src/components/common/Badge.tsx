import type { CSSProperties, ReactNode } from 'react';
import { cn } from './cn';
import { chipRadius, pillRadius } from './radii';

type BadgeProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: 'pill' | 'chip';
};

export const Badge = ({ children, className, style, variant = 'pill' }: BadgeProps) => (
  <span
    className={cn('font-mono text-xs', className)}
    style={{ borderRadius: variant === 'chip' ? chipRadius : pillRadius, ...style }}
  >
    {children}
  </span>
);
