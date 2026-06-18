import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import type { Mode, ModuleId, ModuleProgress } from '../../types'
import { Badge } from '../common/Badge'
import { cardRadius } from '../common/radii'

type CardDisplayStatus = 'active' | 'locked' | 'available' | 'in_progress' | 'complete'

type ModuleCardProps = {
  id: ModuleId
  number?: string
  title: string
  subtitle: string
  status: CardDisplayStatus
  isJustUnlocked?: boolean
  onClick?: () => void
}

export const ModuleCard = ({ id, number, title, subtitle, status, isJustUnlocked = false, onClick }: ModuleCardProps) => {
  const { t } = useTranslation()
  const isSandbox = id === 'sandbox'
  const isActive = status === 'active'
  const isComplete = status === 'complete'
  const isLocked = status === 'locked'
  const isInProgress = status === 'in_progress'

  const accent = isSandbox ? 'var(--feat)' : 'var(--main)'

  const borderColor = isActive ? accent : isComplete ? 'var(--ok)' : 'var(--hair)'

  const bg = isActive
    ? `color-mix(in srgb, ${accent} 8%, var(--panel))`
    : isComplete
      ? 'color-mix(in srgb, var(--ok) 5%, var(--panel))'
      : 'var(--panel)'

  const statusLabel = isActive
    ? t('moduleCard.active')
    : isComplete
      ? t('moduleCard.done')
      : isLocked
        ? t('moduleCard.locked')
        : isInProgress
          ? t('moduleCard.inProgress')
          : t('moduleCard.clickToEnter')

  const statusColor = isActive ? accent : isComplete ? 'var(--ok)' : isLocked ? 'var(--hair)' : isInProgress ? accent : 'var(--muted)'

  const marginLeft = !isSandbox && number ? 'ml-6' : ''

  return (
    <div
      className="mb-1.5 flex-shrink-0 border p-2 text-sm"
      onClick={isLocked ? undefined : onClick}
      style={{
        borderRadius: cardRadius,
        border: `1.4px solid ${borderColor}`,
        background: bg,
        cursor: isLocked ? 'default' : 'pointer',
        opacity: isLocked ? 0.5 : 1,
        ...(isJustUnlocked &&
          ({
            '--glow-color': accent,
            animation: 'moduleUnlockGlow 0.9s ease-in-out 3',
          } as CSSProperties)),
      }}
    >
      <div className="flex items-center gap-1.5">
        {!isSandbox && number && (
          <span
            className="grid flex-shrink-0 place-items-center font-mono text-xs"
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
        <div className="font-hand text-sm text-ink" style={{ fontWeight: isActive ? 700 : 400 }}>
          {title}
        </div>
      </div>
      <div className={`mt-0.5 font-mono text-xs text-soft ${marginLeft}`}>{subtitle}</div>
      <div className={`mt-1 ${marginLeft}`}>
        <Badge className="px-1.5 py-px" style={{ color: statusColor, border: `1px solid ${statusColor}` }}>
          {statusLabel}
        </Badge>
      </div>
    </div>
  )
}

export const getCardStatus = (id: ModuleId, mode: Mode, moduleProgress: ModuleProgress[]): CardDisplayStatus => {
  if (mode === id) return 'active'
  const p = moduleProgress.find((prog) => prog.id === id)
  if (!p) return 'available'
  return p.status as CardDisplayStatus
}
