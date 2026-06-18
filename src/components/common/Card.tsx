import type { CSSProperties, ReactNode } from 'react'
import { cn } from './cn'
import { cardRadius } from './radii'

type CardProps = {
  borderColor?: string
  borderWidth?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export const Card = ({ borderColor = 'var(--hair)', borderWidth = 2, className, style, children }: CardProps) => (
  <div
    className={cn('bg-panel shadow-lg', className)}
    style={{ border: `${borderWidth}px solid ${borderColor}`, borderRadius: cardRadius, ...style }}
  >
    {children}
  </div>
)

type CardTitleProps = {
  className?: string
  children: ReactNode
}

export const CardTitle = ({ className, children }: CardTitleProps) => (
  <span className={cn('font-hand text-sm font-bold text-ink', className)}>{children}</span>
)

type CardBodyProps = {
  className?: string
  children: ReactNode
}

export const CardBody = ({ className, children }: CardBodyProps) => (
  <p className={cn('m-0 font-hand text-sm leading-snug text-soft', className)}>{children}</p>
)
