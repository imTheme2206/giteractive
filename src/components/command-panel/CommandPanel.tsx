import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CommandButton } from './CommandButton'
import { matchCommand } from './commandInfo'
import { TipCard } from './TipCard'

type CommandPanelProps = {
  commands: string[]
  onPreview: (cmd: string) => void
  onExecute: (cmd: string) => void
}

export const CommandPanel = ({ commands, onPreview, onExecute }: CommandPanelProps) => {
  const { t } = useTranslation()
  const [tipsCmd, setTipsCmd] = useState<string | null>(null)

  if (commands.length === 0) {
    return null
  }

  const tipsCommandKey = tipsCmd ? matchCommand(tipsCmd) : null

  return (
    <div className="relative shrink-0 border-t border-dashed border-[var(--hair)] bg-[var(--panel2)]">
      {tipsCommandKey && <TipCard commandKey={tipsCommandKey} onClose={() => setTipsCmd(null)} />}
      <div className="flex items-center gap-2 px-4 py-1.5">
        <span className="shrink-0 font-mono text-xs tracking-widest text-[var(--muted)] uppercase">{t('sidebar.commands')}</span>
        <div className="flex flex-wrap gap-1.5">
          {commands.map((cmd) => (
            <CommandButton
              key={cmd}
              cmd={cmd}
              isActive={tipsCmd === cmd}
              onMouseEnter={() => onPreview(cmd)}
              onMouseLeave={() => onPreview('')}
              onClick={() => onExecute(cmd)}
              onTipToggle={() => setTipsCmd(tipsCmd === cmd ? null : cmd)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
