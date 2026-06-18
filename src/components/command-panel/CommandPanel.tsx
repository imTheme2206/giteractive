import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CommandButton } from './CommandButton'
import { matchCommand } from './commandInfo'
import { TipCard } from './TipCard'

type CommandPanelProps = {
  commands: string[]
  onPaste: (cmd: string) => void
}

export const CommandPanel = ({ commands, onPaste }: CommandPanelProps) => {
  const { t } = useTranslation()
  const [tipsCmd, setTipsCmd] = useState<string | null>(null)

  if (commands.length === 0) {
    return null
  }

  const tipsCommandKey = tipsCmd ? matchCommand(tipsCmd) : null

  const handlePaste = (cmd: string) => {
    // Paste prefix only for checkout -b (no placeholder branch name)
    if (cmd === 'git checkout -b feature') {
      onPaste('git checkout -b ')
    } else {
      onPaste(cmd)
    }
  }

  return (
    <div className="relative shrink-0 border-t border-dashed border-hair bg-panel2">
      {tipsCommandKey && <TipCard commandKey={tipsCommandKey} onClose={() => setTipsCmd(null)} />}
      <div className="flex items-center gap-2 px-4 py-1.5">
        <span className="shrink-0 font-mono text-xs tracking-widest text-muted uppercase">{t('sidebar.commands')}</span>
        <div className="flex flex-wrap gap-1.5">
          {commands.map((cmd) => (
            <CommandButton
              key={cmd}
              cmd={cmd}
              isActive={tipsCmd === cmd}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              onClick={() => handlePaste(cmd)}
              onTipToggle={() => setTipsCmd(tipsCmd === cmd ? null : cmd)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
