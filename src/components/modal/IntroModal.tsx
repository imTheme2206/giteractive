import { useTranslation } from 'react-i18next'
import type { ModuleId } from '../../types'
import { ModalBackdrop } from './ModalBackdrop'
import { Button } from '../common/Button'
import { cardRadius, insightRadius } from '../common/radii'

type IntroModalProps = {
  moduleId: Exclude<ModuleId, 'sandbox'>
  onStart: () => void
  onSkip: () => void
}

export const IntroModal = ({ moduleId, onStart, onSkip }: IntroModalProps) => {
  const { t } = useTranslation()

  return (
    <ModalBackdrop>
      <div
        className="mx-6 w-full bg-[var(--panel)] shadow-2xl"
        style={{
          maxWidth: 480,
          border: '2.5px solid var(--ink)',
          borderRadius: cardRadius,
        }}
      >
        <div className="px-7 pt-7 pb-2">
          <div className="font-hand text-lg leading-tight font-bold text-[var(--ink)]">{t(`intro.${moduleId}.title`)}</div>
        </div>

        <div className="flex flex-col gap-4 px-7 pt-3 pb-1">
          <div>
            <span className="mb-1 block font-mono text-xs tracking-widest text-[var(--muted)] uppercase">The Problem</span>
            <p className="m-0 font-hand text-sm leading-relaxed text-[var(--soft)]">{t(`intro.${moduleId}.scenario`)}</p>
          </div>

          <div>
            <span className="mb-1 block font-mono text-xs tracking-widest text-[var(--muted)] uppercase">How Git Works</span>
            <p className="m-0 font-hand text-sm leading-relaxed text-[var(--soft)]">{t(`intro.${moduleId}.concept`)}</p>
          </div>

          <div
            className="px-3 py-2.5"
            style={{
              borderLeft: '3px solid var(--feat)',
              borderRadius: insightRadius,
              background: 'color-mix(in srgb, var(--feat) 6%, var(--panel))',
            }}
          >
            <span className="font-hand text-xs font-bold text-[var(--feat)]">Key insight: </span>
            <span className="font-hand text-sm text-[var(--soft)]">{t(`intro.${moduleId}.keyInsight`)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-7 py-5">
          <Button variant="ghost" onClick={onSkip}>
            Skip intro
          </Button>
          <Button variant="primary" color="var(--ink)" className="font-mono" onClick={onStart}>
            Start →
          </Button>
        </div>
      </div>
    </ModalBackdrop>
  )
}
