import { useTranslation } from 'react-i18next'
import { Card, CardBody } from '../common/Card'
import type { GitCommandName } from '../../types'
import { COMMANDS_WITH_STEPS } from './commandInfo'

type TipCardProps = {
  commandKey: GitCommandName
  onClose: () => void
}

export const TipCard = ({ commandKey, onClose }: TipCardProps) => {
  const { t } = useTranslation()
  const base = `commandPanel.commands.${commandKey}`
  const hasSteps = COMMANDS_WITH_STEPS.has(commandKey)
  const rawSteps = hasSteps ? t(`${base}.steps`, { returnObjects: true }) : null
  const steps: string[] | null = Array.isArray(rawSteps) ? rawSteps : null

  return (
    <div className="absolute bottom-full left-4 z-30 mb-2" style={{ width: 320 }}>
      <Card borderColor="var(--ink)" className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <span className="font-mono text-xs font-bold text-[var(--ink)]">{t(`${base}.title`)}</span>
          <button
            type="button"
            className="flex-shrink-0 cursor-pointer font-mono text-xs leading-none text-[var(--muted)] hover:text-[var(--ink)]"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <CardBody className="mb-3">{t(`${base}.description`)}</CardBody>
        {steps && (
          <ol className="m-0 flex list-none flex-col gap-1.5 pl-0">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0 font-mono text-xs text-[var(--muted)]">{i + 1}.</span>
                <span className="font-hand text-sm leading-snug text-[var(--soft)]">{step}</span>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  )
}
