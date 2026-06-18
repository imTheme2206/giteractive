import type { ReactNode } from 'react'
import { cn } from '../common/cn'

type SidebarPanelProps = {
  alignment?: 'left' | 'right'
  width?: number
  resizable?: boolean
  closeable?: boolean
  title?: string
  onClose?: () => void
  onResizeMouseDown?: (e: React.MouseEvent) => void
  className?: string
  children: ReactNode
}

export const SidebarPanel = ({
  alignment = 'left',
  width,
  resizable,
  closeable,
  title,
  onClose,
  onResizeMouseDown,
  className,
  children,
}: SidebarPanelProps) => {
  const isRight = alignment === 'right'

  return (
    <div
      className={cn(
        'relative flex flex-shrink-0',
        isRight ? 'flex-row border-l border-dashed border-hair' : 'flex-col border-r-2 border-dashed border-hair'
      )}
      style={width ? { width } : undefined}
    >
      {resizable && (
        <div
          className={cn(
            'absolute top-0 bottom-0 z-10 w-1 cursor-col-resize opacity-0 transition-opacity hover:bg-feat hover:opacity-30',
            isRight ? 'left-0' : 'right-0'
          )}
          onMouseDown={onResizeMouseDown}
        />
      )}
      <div className={cn('flex flex-1 flex-col overflow-hidden', className)}>
        {closeable && (
          <div
            className="flex flex-shrink-0 items-center justify-between border-b border-dashed border-hair px-3 py-2"
            style={{ background: 'var(--panel)' }}
          >
            <span className="font-mono text-xs tracking-widest text-muted uppercase">{title}</span>
            <button
              type="button"
              className="font-mono text-xs text-muted transition-colors hover:text-ink"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
