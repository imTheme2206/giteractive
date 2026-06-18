import { useTranslation } from 'react-i18next'
import type { Mode, ModuleId, ModuleProgress, TickerEntry } from '../../types'
import { SectionLabel } from '../common/SectionLabel'
import { cardRadius } from '../common/radii'
import { ModuleCard, getCardStatus } from './ModuleCard'
import { SidebarPanel } from './SidebarPanel'

type SidebarProps = {
  history: TickerEntry[]
  mode: Mode
  moduleProgress: ModuleProgress[]
  justUnlockedId: ModuleId | null
  onEnter: (id: ModuleId) => void
}

const MODULE_IDS = [
  'module0',
  'module1',
  'module2',
  'module3',
  'module4',
  'module5',
  'module6',
  'module7',
  'module8',
  'module9',
  'module10',
  'module11',
  'sandbox',
] as const

export const Sidebar = ({ history, mode, moduleProgress, justUnlockedId, onEnter }: SidebarProps) => {
  const { t } = useTranslation()

  const TOTAL_LEVELS = MODULE_IDS.filter((id) => id !== 'sandbox').length
  const completedCount = moduleProgress.filter((p) => p.id !== 'sandbox' && p.status === 'complete').length
  const progressPct = TOTAL_LEVELS > 0 ? (completedCount / TOTAL_LEVELS) * 100 : 0

  const timeAgo = (ts: number): string => {
    const seconds = Math.floor((Date.now() - ts) / 1000)
    if (seconds < 5) return t('sidebar.timeJustNow')
    if (seconds < 60) return t('sidebar.timeSeconds', { count: seconds })
    return t('sidebar.timeMinutes', { count: Math.floor(seconds / 60) })
  }

  return (
    <SidebarPanel className="w-56 bg-panel2 p-3">
      <div className="mb-1 flex-shrink-0 font-hand text-lg font-bold text-ink">Giteractive</div>

      <div className="mb-2 flex flex-col gap-1">
        <div className="flex items-center justify-between font-mono text-xs" style={{ color: 'var(--muted)' }}>
          <span>{t('sidebar.progressCount', { completed: completedCount, total: TOTAL_LEVELS })}</span>
          {completedCount === TOTAL_LEVELS && <span style={{ color: 'var(--ok)' }}>{t('sidebar.progressDone')}</span>}
        </div>
        <div
          className="w-full overflow-hidden"
          style={{ height: 4, borderRadius: 2, background: 'var(--hair)' }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              background: completedCount === TOTAL_LEVELS ? 'var(--ok)' : 'var(--feat)',
              borderRadius: 2,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      <SectionLabel>{t('sidebar.levels')}</SectionLabel>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {MODULE_IDS.map((id) => (
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
      <div className="flex flex-shrink-0 flex-col gap-1 overflow-y-auto" style={{ maxHeight: 128 }}>
        {history.length === 0 ? (
          <div className="py-1 font-hand text-xs text-muted">{t('sidebar.noCommands')}</div>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              className="flex-shrink-0 border border-hair bg-panel p-1.5"
              style={{ borderRadius: cardRadius }}
            >
              <div className="font-mono text-xs text-ink">{entry.command}</div>
              <div className="mt-px font-mono text-xs text-muted">{timeAgo(entry.timestamp)}</div>
            </div>
          ))
        )}
      </div>
    </SidebarPanel>
  )
}
