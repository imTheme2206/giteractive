import { useTranslation } from 'react-i18next';
import type { Mode, ModuleId, ModuleProgress } from '../../types';

export const levelCardRadius = '255px 14px 225px 16px/16px 225px 14px 255px';
export const pillRadius = '60px 10px 60px 10px/10px 60px 10px 60px';

type CardDisplayStatus = 'active' | 'locked' | 'available' | 'in_progress' | 'complete';

type ModuleCardProps = {
  id: ModuleId;
  number?: string;
  title: string;
  subtitle: string;
  status: CardDisplayStatus;
  onClick?: () => void;
};

export const ModuleCard = ({ id, number, title, subtitle, status, onClick }: ModuleCardProps) => {
  const { t } = useTranslation();
  const isSandbox = id === 'sandbox';
  const isActive = status === 'active';
  const isComplete = status === 'complete';
  const isLocked = status === 'locked';
  const isInProgress = status === 'in_progress';

  const accent = isSandbox ? 'var(--feat)' : 'var(--main)';

  const borderColor = isActive
    ? accent
    : isComplete
      ? 'var(--ok)'
      : 'var(--hair)';

  const bg = isActive
    ? `color-mix(in srgb, ${accent} 8%, var(--panel))`
    : isComplete
      ? 'color-mix(in srgb, var(--ok) 5%, var(--panel))'
      : 'var(--panel)';

  const statusLabel = isActive
    ? t('moduleCard.active')
    : isComplete
      ? t('moduleCard.done')
      : isLocked
        ? t('moduleCard.locked')
        : isInProgress
          ? t('moduleCard.inProgress')
          : t('moduleCard.clickToEnter');

  const statusColor = isActive
    ? accent
    : isComplete
      ? 'var(--ok)'
      : isLocked
        ? 'var(--hair)'
        : isInProgress
          ? accent
          : 'var(--muted)';

  const marginLeft = !isSandbox && number ? 'ml-6' : '';

  return (
    <div
      className="p-2 mb-1.5 border text-sm flex-shrink-0"
      onClick={isLocked ? undefined : onClick}
      style={{
        borderRadius: levelCardRadius,
        border: `1.4px solid ${borderColor}`,
        background: bg,
        cursor: isLocked ? 'default' : 'pointer',
        opacity: isLocked ? 0.5 : 1,
      }}
    >
      <div className="flex items-center gap-1.5">
        {!isSandbox && number && (
          <span
            className="font-mono text-[10px] grid place-items-center flex-shrink-0"
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: `1.2px solid ${statusColor}`,
              color: statusColor,
              fontWeight: 700,
            }}
          >
            {isComplete ? '✓' : number}
          </span>
        )}
        <div
          className="text-[var(--ink)] text-[13px]"
          style={{ fontFamily: 'var(--hand)', fontWeight: isActive ? 700 : 400 }}
        >
          {title}
        </div>
      </div>
      <div className={`font-mono text-[10px] text-[var(--soft)] mt-0.5 ${marginLeft}`}>
        {subtitle}
      </div>
      <div className={`mt-1 ${marginLeft}`}>
        <span
          className="font-mono text-[10px] px-1.5 py-px"
          style={{
            borderRadius: pillRadius,
            color: statusColor,
            border: `1px solid ${statusColor}`,
          }}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
};

export const getCardStatus = (id: ModuleId, mode: Mode, moduleProgress: ModuleProgress[]): CardDisplayStatus => {
  if (mode === id) return 'active';
  const p = moduleProgress.find((prog) => prog.id === id);
  if (!p) return 'available';
  return p.status as CardDisplayStatus;
};
