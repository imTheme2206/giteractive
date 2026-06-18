import { useTranslation } from 'react-i18next'
import type { ModuleId } from '../../types'
import { Modal } from './Modal'
import { Button } from '../common/Button'

const isFinalModule = (id: ModuleId) => id === 'module11'

type LevelCompleteOverlayProps = {
  moduleId: ModuleId
  onNext: () => void
  onDismiss: () => void
}

export const LevelCompleteOverlay = ({ moduleId, onNext, onDismiss }: LevelCompleteOverlayProps) => {
  const { t } = useTranslation()
  const levelNum = moduleId === 'sandbox' ? '' : moduleId.replace('module', '')
  const final = isFinalModule(moduleId)

  const moduleKey = `levelComplete.modules.${moduleId}` as const
  const command = t(`${moduleKey}.command` as Parameters<typeof t>[0])
  const takeaway = t(`${moduleKey}.takeaway` as Parameters<typeof t>[0])
  const hasData = command !== `${moduleKey}.command`

  return (
    <Modal maxWidth={440} borderColor="var(--ok)">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-7 pt-7 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--ok)', fontSize: 22, lineHeight: 1 }}>✓</span>
            <span className="font-hand text-xl font-bold text-ink">
              {final ? t('levelComplete.allComplete') : t('levelComplete.levelTitle', { n: levelNum })}
            </span>
          </div>
          {!final && (
            <div className="mt-0.5 font-mono text-xs text-muted">{t('levelComplete.unlocked')}</div>
          )}
        </div>
        <button
          onClick={onDismiss}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 18, lineHeight: 1, padding: 0, flexShrink: 0 }}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      {/* Command learned */}
      {hasData && (
        <div className="flex flex-col gap-3 px-7 pb-5">
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background: 'color-mix(in srgb, var(--ok) 7%, var(--panel))',
              border: '1.5px solid color-mix(in srgb, var(--ok) 30%, transparent)',
              borderRadius: '10px 4px 10px 4px / 4px 10px 4px 10px',
            }}
          >
            <span className="font-mono text-xs font-bold text-ok">{t('levelComplete.youLearned')}</span>
            <code className="font-mono text-sm font-bold text-ok">{command}</code>
          </div>

          <div
            className="px-3 py-2.5"
            style={{
              borderLeft: '3px solid var(--ok)',
              borderRadius: '2px 8px 2px 8px / 8px 2px 8px 2px',
              background: 'color-mix(in srgb, var(--ok) 4%, var(--panel))',
            }}
          >
            <span className="font-hand text-sm leading-relaxed text-soft">{takeaway}</span>
          </div>
        </div>
      )}

      {/* Final graduation */}
      {final && (
        <div className="px-7 pb-5">
          <div
            className="px-4 py-3 text-center"
            style={{
              background: 'color-mix(in srgb, var(--ok) 8%, var(--panel))',
              border: '1.5px dashed var(--ok)',
              borderRadius: '10px',
            }}
          >
            <div className="font-hand text-base font-bold text-ink">{t('levelComplete.graduation')}</div>
            <div className="mt-1 font-hand text-sm text-soft">{t('levelComplete.graduationSub')}</div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-7 pb-6">
        <Button variant="ghost" onClick={onDismiss}>
          {t('levelComplete.stayHere')}
        </Button>
        <Button variant="primary" color="var(--ok)" className="font-mono" onClick={onNext}>
          {final ? t('levelComplete.openSandbox') : t('levelComplete.nextLevel')}
        </Button>
      </div>
    </Modal>
  )
}
