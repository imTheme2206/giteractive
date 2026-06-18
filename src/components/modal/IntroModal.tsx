import { useTranslation } from 'react-i18next'
import type { ModuleId } from '../../types'
import { Modal } from './Modal'
import { Button } from '../common/Button'
import { insightRadius } from '../common/radii'

type IntroModalProps = {
  moduleId: Exclude<ModuleId, 'sandbox'>
  onStart: () => void
  onSkip: () => void
}

export const IntroModal = ({ moduleId, onStart, onSkip }: IntroModalProps) => {
  const { t } = useTranslation()

  return (
    <Modal>
      <div className="px-7 pt-7 pb-2">
        <div className="font-hand text-lg leading-tight font-bold text-ink">{t(`intro.${moduleId}.title`)}</div>
      </div>

      <div className="flex flex-col gap-4 px-7 pt-3 pb-1">
        <div>
          <span className="mb-1 block font-mono text-xs tracking-widest text-muted uppercase">{t('introModal.theProblem')}</span>
          <p className="m-0 font-hand text-sm leading-relaxed text-soft">{t(`intro.${moduleId}.scenario`)}</p>
        </div>

        <div>
          <span className="mb-1 block font-mono text-xs tracking-widest text-muted uppercase">{t('introModal.howGitWorks')}</span>
          <p className="m-0 font-hand text-sm leading-relaxed text-soft">{t(`intro.${moduleId}.concept`)}</p>
        </div>

        <div
          className="px-3 py-2.5"
          style={{
            borderLeft: '3px solid var(--feat)',
            borderRadius: insightRadius,
            background: 'color-mix(in srgb, var(--feat) 6%, var(--panel))',
          }}
        >
          <span className="font-hand text-xs font-bold text-feat">{t('introModal.keyInsight')} </span>
          <span className="font-hand text-sm text-soft">{t(`intro.${moduleId}.keyInsight`)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-7 py-5">
        <Button variant="ghost" onClick={onSkip}>
          {t('introModal.skipIntro')}
        </Button>
        <Button variant="primary" color="var(--ink)" className="font-mono" onClick={onStart}>
          {t('introModal.start')}
        </Button>
      </div>
    </Modal>
  )
}
