import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from './common/Badge'
import { Button } from './common/Button'
import { Card, CardBody, CardTitle } from './common/Card'

type ExplainerCardProps = {
  command: string
  onDismiss: () => void
}

type ExplainerKey = {
  titleKey: string
  bodyKey?: string
  stepsKey?: string
  vars: Record<string, string>
  color: string
}

const getExplainerKey = (command: string): ExplainerKey | null => {
  if (command.startsWith('git checkout -b')) {
    const branch = command.split(' ')[2] ?? 'feature'
    return { titleKey: 'explainer.branchCreated.title', bodyKey: 'explainer.branchCreated.body', vars: { branch }, color: 'var(--feat)' }
  }
  if (command.startsWith('git commit')) {
    return { titleKey: 'explainer.newCommit.title', bodyKey: 'explainer.newCommit.body', vars: {}, color: 'var(--main)' }
  }
  if (command.startsWith('git cherry-pick')) {
    const hash = command.split(' ')[2] ?? ''
    return { titleKey: 'explainer.cherryPick.title', stepsKey: 'explainer.cherryPick.steps', vars: { hash }, color: 'var(--feat)' }
  }
  if (command.startsWith('git rebase')) {
    const onto = command.split(' ')[2] ?? ''
    return { titleKey: 'explainer.rebase.title', stepsKey: 'explainer.rebase.steps', vars: { onto }, color: 'var(--head)' }
  }
  if (command.startsWith('git merge')) {
    const branch = command.split(' ')[2]?.replace(/#.*/, '').trim() ?? ''
    return { titleKey: 'explainer.mergeCommit.title', stepsKey: 'explainer.mergeCommit.steps', vars: { branch }, color: 'var(--ok)' }
  }
  if (command.startsWith('git reset --hard')) {
    const target = command.split(' ')[3] ?? ''
    return { titleKey: 'explainer.hardReset.title', stepsKey: 'explainer.hardReset.steps', vars: { target }, color: 'var(--head)' }
  }
  if (command.startsWith('git stash')) {
    const isPop = command.includes('pop')
    return {
      titleKey: isPop ? 'explainer.stashPopped.title' : 'explainer.workStashed.title',
      bodyKey: isPop ? 'explainer.stashPopped.body' : 'explainer.workStashed.body',
      vars: {},
      color: 'var(--feat)',
    }
  }
  return null
}

const STEP_INTERVAL_MS = 700
const AUTO_DISMISS_MS = 8000

export const ExplainerCard = ({ command, onDismiss }: ExplainerCardProps) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [visibleSteps, setVisibleSteps] = useState(0)

  const keys = getExplainerKey(command)
  const rawSteps = keys?.stepsKey ? t(keys.stepsKey, { returnObjects: true, ...keys.vars }) : null
  const steps: string[] | null = Array.isArray(rawSteps) ? rawSteps : null
  const totalSteps = steps?.length ?? 0

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50)
    const t2 = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, AUTO_DISMISS_MS)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDismiss])

  useEffect(() => {
    if (!steps || visibleSteps >= totalSteps) return
    const timer = setTimeout(() => setVisibleSteps((s) => s + 1), visibleSteps === 0 ? 200 : STEP_INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [visibleSteps, totalSteps, steps])

  if (!keys) return null

  return (
    <div
      className="absolute z-20"
      style={{
        bottom: 72,
        right: 24,
        width: 316,
        transition: 'opacity 0.3s, transform 0.3s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      <Card borderColor={keys.color} className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <CardTitle>{t(keys.titleKey)}</CardTitle>
          </div>
          <Button
            variant="icon"
            onClick={() => {
              setVisible(false)
              setTimeout(onDismiss, 300)
            }}
          >
            ×
          </Button>
        </div>

        {keys.bodyKey && <CardBody className="mb-3">{t(keys.bodyKey, keys.vars)}</CardBody>}

        {steps && (
          <ol className="m-0 mb-3 flex list-none flex-col gap-1.5 pl-0">
            {steps.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-2"
                style={{
                  transition: 'opacity 0.4s, transform 0.4s',
                  opacity: i < visibleSteps ? 1 : 0,
                  transform: i < visibleSteps ? 'translateY(0)' : 'translateY(6px)',
                }}
              >
                <span className="mt-0.5 flex-shrink-0 font-mono text-xs" style={{ color: keys.color, minWidth: '1.2em' }}>
                  {i + 1}.
                </span>
                <span className="font-hand text-sm leading-snug text-[var(--soft)]">{step}</span>
              </li>
            ))}
          </ol>
        )}

        <Badge className="border border-[var(--hair)] bg-[var(--panel2)] px-2 py-0.5 text-xs text-[var(--muted)]">$ {command}</Badge>
      </Card>
    </div>
  )
}
