import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import { cn } from './cn';
import { pillRadius } from './radii';

export type ButtonVariant = 'toolbar' | 'primary' | 'ghost' | 'icon' | 'sharp';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  color?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  toolbar: 'font-mono text-sm text-[var(--ink)] bg-[var(--panel)] border border-dashed border-[var(--hair)] px-3 py-1 cursor-pointer whitespace-nowrap font-hand',
  primary: 'font-hand font-bold text-sm px-5 py-2 cursor-pointer border-2 text-[var(--panel)]',
  ghost:   'font-mono text-xs text-[var(--muted)] cursor-pointer bg-transparent border-0 underline underline-offset-2',
  icon:    'font-hand text-lg leading-none cursor-pointer bg-transparent border-0 flex-shrink-0 text-[var(--muted)]',
  sharp:   'font-mono text-xs px-2 py-0.5 cursor-pointer border-0',
};

export const Button = ({ variant = 'toolbar', color, className, style, children, ...props }: ButtonProps) => {
  const hasRadius = variant === 'toolbar' || variant === 'primary';

  const resolvedStyle: CSSProperties = {
    ...(hasRadius && { borderRadius: pillRadius }),
    ...(variant === 'primary' && color && { background: color, borderColor: color }),
    ...style,
  };

  return (
    <button
      className={cn(variantClasses[variant], className)}
      style={resolvedStyle}
      {...props}
    >
      {children}
    </button>
  );
};
