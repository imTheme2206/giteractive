import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ModuleId } from '../../types'
import { cardRadius } from './radii'

type ToastProps = {
  moduleId: ModuleId
  accentColor: string
  onDismiss: () => void
}

const DURATION_MS = 5000

export const Toast = ({ moduleId, accentColor, onDismiss }: ToastProps) => {
  const { t } = useTranslation()
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => {
    if (exiting) return
    setExiting(true)
    timerRef.current = setTimeout(onDismiss, 300)
  }, [exiting, onDismiss])

  useEffect(() => {
    timerRef.current = setTimeout(dismiss, DURATION_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [dismiss])

  const moduleNum = moduleId === 'sandbox' ? '' : moduleId.replace('module', '')

  return (
    <div
      className="fixed right-4 bottom-4 z-50 flex flex-col gap-0 overflow-hidden shadow-lg"
      style={{
        borderRadius: cardRadius,
        border: `1.5px solid ${accentColor}`,
        background: 'var(--panel)',
        minWidth: 260,
        maxWidth: 320,
        animation: exiting ? 'toastSlideOut 0.3s ease-in forwards' : 'toastSlideIn 0.3s ease-out forwards',
      }}
    >
      <div className="flex items-start gap-3 px-4 pt-3 pb-2">
        <span style={{ color: accentColor, fontSize: 20, lineHeight: 1, flexShrink: 0 }}>✓</span>
        <div className="min-w-0 flex-1">
          <div className="font-hand text-base leading-tight font-bold text-ink">{t('toast.complete', { n: moduleNum })}</div>
          <div className="mt-0.5 font-mono text-xs text-soft">{t('toast.hint')}</div>
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 leading-none text-muted transition-colors hover:text-ink"
          style={{ fontSize: 16, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      <div
        style={{
          height: 2,
          background: accentColor,
          animation: `progressShrink ${DURATION_MS}ms linear forwards`,
          opacity: 0.6,
        }}
      />
    </div>
  )
}
