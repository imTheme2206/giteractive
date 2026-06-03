import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Handle, NodeToolbar, Position } from '@xyflow/react';

type BranchLabelData = {
  label: string;
  branch: string;
  showCheckout?: boolean;
  isDetached?: boolean;
  attachedBranch?: string;
  canDrag?: boolean;
  highlighted?: boolean;
  tipHash?: string;
  isCurrentHead?: boolean;
  [key: string]: unknown;
};

export const BranchLabelNode = ({ data }: { data: BranchLabelData }) => {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const color =
    data.branch === 'HEAD'
      ? 'var(--head)'
      : data.branch === 'main'
        ? 'var(--main)'
        : 'var(--feat)';

  const borderStyle = data.branch === 'HEAD' && data.isDetached ? 'dashed' : 'solid';
  const isHead = data.branch === 'HEAD';

  const tooltipVisible = hovered || pinned;

  const onMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setHovered(true), 150);
  };

  const onMouseLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setHovered(false);
  };

  const onInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPinned(prev => !prev);
  };

  const tooltipContent = isHead ? (
    <div>
      <div
        className="font-mono font-bold text-xs mb-1"
        style={{ color: 'var(--head)' }}
      >
        {t('tooltips.head.title')}
      </div>
      <div
        className="font-mono text-xs leading-snug mb-1"
        style={{ color: 'var(--ink)' }}
      >
        {t('tooltips.head.body')}
      </div>
      {data.isDetached ? (
        <div
          className="font-mono text-xs leading-snug mt-1 pt-1"
          style={{ color: 'var(--head)', borderTop: '1px solid color-mix(in srgb, var(--head) 30%, transparent)' }}
        >
          {t('tooltips.head.detached')}
        </div>
      ) : (
        <div
          className="font-mono text-xs leading-snug mt-1 pt-1"
          style={{ color: 'var(--muted)', borderTop: '1px solid color-mix(in srgb, var(--muted) 25%, transparent)' }}
        >
          {t('tooltips.head.attached', { branch: data.attachedBranch ?? '?' })}
        </div>
      )}
    </div>
  ) : (
    <div>
      <div
        className="font-mono font-bold text-xs mb-1"
        style={{ color }}
      >
        {t('tooltips.branch.title', { name: data.label })}
      </div>
      {data.tipHash && (
        <div
          className="font-mono text-xs leading-snug"
          style={{ color: 'var(--muted)' }}
        >
          {t('tooltips.branch.pointer', { hash: data.tipHash.slice(0, 7) })}
        </div>
      )}
      {data.isCurrentHead && (
        <div
          className="font-mono text-xs leading-snug mt-1 pt-1"
          style={{ color: 'var(--head)', borderTop: '1px solid color-mix(in srgb, var(--head) 30%, transparent)' }}
        >
          {t('tooltips.branch.headHere')}
        </div>
      )}
    </div>
  );

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-checkout-branch={data.showCheckout ? data.branch : undefined}
      title={
        data.showCheckout
          ? `Checkout ${data.branch}`
          : data.canDrag && !isHead
            ? `Drag to merge or rebase ${data.branch}`
            : undefined
      }
      className="font-mono font-bold text-xs bg-[var(--panel)] whitespace-nowrap flex items-center gap-1"
      style={{
        padding: '4px 11px',
        borderRadius: '60px 10px 60px 10px/10px 60px 10px 60px',
        border: `2px ${borderStyle} ${color}`,
        color,
        cursor: data.showCheckout ? 'pointer' : data.canDrag && !isHead ? 'grab' : 'default',
        boxShadow: data.highlighted ? `0 0 0 4px color-mix(in srgb, ${color} 40%, transparent)` : undefined,
        transition: 'box-shadow 0.2s',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      {data.canDrag && !isHead && (
        <span style={{ opacity: 0.45, fontSize: 9, letterSpacing: '-1px' }}>⠿</span>
      )}
      {data.label}
      <button
        className="nodrag nopan"
        onClick={onInfoClick}
        style={{
          background: 'none',
          border: 'none',
          padding: '0 0 0 2px',
          cursor: 'pointer',
          color: pinned ? color : `color-mix(in srgb, ${color} 55%, transparent)`,
          fontSize: 9,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          transition: 'color 0.15s',
        }}
        aria-label={`Info about ${data.label}`}
      >
        ⓘ
      </button>
      <NodeToolbar isVisible={tooltipVisible} position={isHead ? Position.Left : Position.Top} offset={10}>
        <div
          className="pointer-events-none"
          style={{
            width: 200,
            background: 'var(--panel)',
            border: `1.5px solid ${color}`,
            borderRadius: '12px 4px 12px 4px/4px 12px 4px 12px',
            padding: '7px 10px',
            boxShadow: '0 4px 16px color-mix(in srgb, var(--ink) 12%, transparent)',
          }}
        >
          {tooltipContent}
        </div>
      </NodeToolbar>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
};
