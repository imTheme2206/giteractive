import type { ReactNode } from 'react';
import { cn } from '../common/cn';

type SidebarPanelProps = {
  alignment?: 'left' | 'right';
  width?: number;
  resizable?: boolean;
  closeable?: boolean;
  title?: string;
  onClose?: () => void;
  onResizeMouseDown?: (e: React.MouseEvent) => void;
  className?: string;
  children: ReactNode;
};

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
  const isRight = alignment === 'right';

  return (
    <div
      className={cn(
        'flex-shrink-0 flex relative',
        isRight
          ? 'flex-row border-l border-dashed border-[var(--hair)]'
          : 'flex-col border-r-2 border-dashed border-[var(--hair)]',
      )}
      style={width ? { width } : undefined}
    >
      {resizable && (
        <div
          className={cn(
            'absolute top-0 bottom-0 w-1 cursor-col-resize z-10 hover:bg-[var(--feat)] opacity-0 hover:opacity-30 transition-opacity',
            isRight ? 'left-0' : 'right-0',
          )}
          onMouseDown={onResizeMouseDown}
        />
      )}
      <div className={cn('flex-1 overflow-hidden flex flex-col', className)}>
        {closeable && (
          <div
            className="px-3 py-2 border-b border-dashed border-[var(--hair)] flex items-center justify-between flex-shrink-0"
            style={{ background: 'var(--panel)' }}
          >
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
              {title}
            </span>
            <button
              type="button"
              className="font-mono text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
