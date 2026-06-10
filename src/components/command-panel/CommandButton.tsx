import { useTranslation } from 'react-i18next'
import { cardRadius } from '../common/radii'
import { matchCommand } from './commandInfo'

type CommandButtonProps = {
  cmd: string
  isActive: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
  onTipToggle: () => void
}

export const CommandButton = ({ cmd, isActive, onMouseEnter, onMouseLeave, onClick, onTipToggle }: CommandButtonProps) => {
  const { t } = useTranslation()
  const commandKey = matchCommand(cmd)

  return (
    <div className="flex items-stretch overflow-hidden border border-[var(--hair)] bg-[var(--panel)]" style={{ borderRadius: cardRadius }}>
      <button
        type="button"
        className="cursor-pointer px-2 py-0.5 font-mono text-xs text-[var(--soft)] transition-colors hover:bg-[var(--panel2)] hover:text-[var(--ink)]"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {cmd}
      </button>
      {commandKey && (
        <button
          type="button"
          className="flex-shrink-0 cursor-pointer border-l border-[var(--hair)] px-1.5 font-mono text-xs text-[var(--muted)] transition-colors hover:bg-[var(--panel2)] hover:text-[var(--ink)]"
          style={{
            color: isActive ? 'var(--ink)' : undefined,
            background: isActive ? 'var(--panel2)' : undefined,
          }}
          onClick={onTipToggle}
          title={t('commandPanel.whatDoesThisDo')}
        >
          ?
        </button>
      )}
    </div>
  )
}
