import { useTranslation } from 'react-i18next';
import type { Mode, ModuleId, ModuleProgress, TickerEntry } from '../../types';
import { ModuleCard, getCardStatus } from './ModuleCard';
import { SectionLabel } from '../common/SectionLabel';
import { cardRadius } from '../common/radii';

type SidebarProps = {
  history: TickerEntry[];
  mode: Mode;
  moduleProgress: ModuleProgress[];
  justUnlockedId: ModuleId | null;
  onEnter: (id: ModuleId) => void;
};

const MODULE_IDS = ['module0', 'module1', 'module2', 'module3', 'module4', 'module5', 'module6', 'module7', 'module8', 'module9', 'module10', 'module11', 'sandbox'] as const;

export const Sidebar = ({ history, mode, moduleProgress, justUnlockedId, onEnter }: SidebarProps) => {
  const { t } = useTranslation();

  const timeAgo = (ts: number): string => {
    const seconds = Math.floor((Date.now() - ts) / 1000);
    if (seconds < 5) return t('sidebar.timeJustNow');
    if (seconds < 60) return t('sidebar.timeSeconds', { count: seconds });
    return t('sidebar.timeMinutes', { count: Math.floor(seconds / 60) });
  };

  return (
    <div className="w-56 flex-shrink-0 flex flex-col bg-[var(--panel2)] border-r-2 border-dashed border-[var(--hair)] p-3 h-full overflow-hidden">
      <div className="font-bold text-lg text-[var(--ink)] mb-1 flex-shrink-0 font-hand">
        Giteractive
      </div>

      <SectionLabel>{t('sidebar.levels')}</SectionLabel>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {MODULE_IDS.map(id => (
          <ModuleCard
            key={id}
            id={id}
            number={id !== 'sandbox' ? id.replace('module', '') : undefined}
            title={t(`sidebar.modules.${id}.title`)}
            subtitle={t(`sidebar.modules.${id}.subtitle`)}
            status={getCardStatus(id, mode, moduleProgress)}
            isJustUnlocked={justUnlockedId === id}
            onClick={() => onEnter(id)}
          />
        ))}
      </div>

      <SectionLabel>{t('sidebar.session')}</SectionLabel>
      <div className="flex-shrink-0 overflow-y-auto flex flex-col gap-1" style={{ maxHeight: 128 }}>
        {history.length === 0 ? (
          <div className="text-[var(--muted)] text-xs py-1 font-hand">
            {t('sidebar.noCommands')}
          </div>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              className="p-1.5 border border-[var(--hair)] bg-[var(--panel)] flex-shrink-0"
              style={{ borderRadius: cardRadius }}
            >
              <div className="font-mono text-xs text-[var(--ink)]">{entry.command}</div>
              <div className="font-mono text-xs text-[var(--muted)] mt-px">{timeAgo(entry.timestamp)}</div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
