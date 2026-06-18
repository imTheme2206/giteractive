import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../common/cn'
import { cardRadius } from '../common/radii'
import { ModalBackdrop } from './ModalBackdrop'

type ModalProps = {
  children: ReactNode
  maxWidth?: number
  borderColor?: string
  backdropBackground?: string
  className?: string
  style?: CSSProperties
}

export const Modal = ({
  children,
  maxWidth = 480,
  borderColor = 'var(--ink)',
  backdropBackground,
  className,
  style,
}: ModalProps) => (
  <ModalBackdrop background={backdropBackground}>
    <div
      className={cn('mx-6 w-full bg-panel shadow-2xl', className)}
      style={{ maxWidth, border: `2px solid ${borderColor}`, borderRadius: cardRadius, ...style }}
    >
      {children}
    </div>
  </ModalBackdrop>
)
