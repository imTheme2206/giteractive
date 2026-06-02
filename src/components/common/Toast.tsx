import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ModuleId } from '../../types';
import { cardRadius } from './radii';

type ToastProps = {
  moduleId: ModuleId;
  accentColor: string;
  onDismiss: () => void;
};

const DURATION_MS = 5000;

export const Toast = ({ moduleId, accentColor, onDismiss }: ToastProps) => {
  const { t } = useTranslation();
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    if (exiting) return;
    setExiting(true);
    timerRef.current = setTimeout(onDismiss, 300);
  };

  useEffect(() => {
    timerRef.current = setTimeout(dismiss, DURATION_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const moduleNum = moduleId === 'sandbox' ? '' : moduleId.replace('module', '');

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-0 overflow-hidden shadow-lg"
      style={{
        borderRadius: cardRadius,
        border: `1.5px solid ${accentColor}`,
        background: 'var(--panel)',
        minWidth: 260,
        maxWidth: 320,
        animation: exiting
          ? 'toastSlideOut 0.3s ease-in forwards'
          : 'toastSlideIn 0.3s ease-out forwards',
      }}
    >
      <div className="flex items-start gap-3 px-4 pt-3 pb-2">
        <span style={{ color: accentColor, fontSize: 20, lineHeight: 1, flexShrink: 0 }}>✓</span>
        <div className="flex-1 min-w-0">
          <div className="font-hand font-bold text-[var(--ink)] text-[14px] leading-tight">
            {t('toast.complete', { n: moduleNum })}
          </div>
          <div className="font-mono text-[11px] text-[var(--soft)] mt-0.5">
            {t('toast.hint')}
          </div>
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 text-[var(--muted)] hover:text-[var(--ink)] transition-colors leading-none"
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
  );
};
