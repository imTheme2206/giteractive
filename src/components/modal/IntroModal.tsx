import { useTranslation } from 'react-i18next';
import type { ModuleId } from '../../types';
import { ModalBackdrop } from './ModalBackdrop';

type IntroModalProps = {
  moduleId: Exclude<ModuleId, 'sandbox'>;
  onStart: () => void;
  onSkip: () => void;
};

const modalRadius = '255px 14px 225px 16px/16px 225px 14px 255px';
const handBtnRadius = '60px 10px 60px 10px/10px 60px 10px 60px';
const insightRadius = '6px 2px 6px 2px / 2px 6px 2px 6px';

export const IntroModal = ({ moduleId, onStart, onSkip }: IntroModalProps) => {
  const { t } = useTranslation();

  return (
    <ModalBackdrop>
      <div
        className="bg-[var(--panel)] shadow-2xl w-full mx-6"
        style={{
          maxWidth: 480,
          border: '2.5px solid var(--ink)',
          borderRadius: modalRadius,
        }}
      >
        <div className="px-7 pt-7 pb-2">
          <div
            className="font-bold text-lg text-[var(--ink)] leading-tight"
            style={{ fontFamily: 'var(--hand)' }}
          >
            {t(`intro.${moduleId}.title`)}
          </div>
        </div>

        <div className="px-7 pt-3 pb-1 flex flex-col gap-4">
          <div>
            <span
              className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] block mb-1"
            >
              The Problem
            </span>
            <p
              className="text-sm text-[var(--soft)] leading-relaxed m-0"
              style={{ fontFamily: 'var(--hand)' }}
            >
              {t(`intro.${moduleId}.scenario`)}
            </p>
          </div>

          <div>
            <span
              className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] block mb-1"
            >
              How Git Works
            </span>
            <p
              className="text-sm text-[var(--soft)] leading-relaxed m-0"
              style={{ fontFamily: 'var(--hand)' }}
            >
              {t(`intro.${moduleId}.concept`)}
            </p>
          </div>

          <div
            className="px-3 py-2.5"
            style={{
              borderLeft: '3px solid var(--feat)',
              borderRadius: insightRadius,
              background: 'color-mix(in srgb, var(--feat) 6%, var(--panel))',
            }}
          >
            <span
              className="font-bold text-xs text-[var(--feat)]"
              style={{ fontFamily: 'var(--hand)' }}
            >
              Key insight:{' '}
            </span>
            <span
              className="text-sm text-[var(--soft)]"
              style={{ fontFamily: 'var(--hand)' }}
            >
              {t(`intro.${moduleId}.keyInsight`)}
            </span>
          </div>
        </div>

        <div className="px-7 py-5 flex items-center justify-between">
          <button
            onClick={onSkip}
            className="font-mono text-xs text-[var(--muted)] cursor-pointer bg-transparent border-0 underline underline-offset-2"
          >
            Skip intro
          </button>
          <button
            onClick={onStart}
            className="font-mono text-sm font-bold px-5 py-2 cursor-pointer border-2 text-[var(--panel)] bg-[var(--ink)]"
            style={{
              borderColor: 'var(--ink)',
              borderRadius: handBtnRadius,
            }}
          >
            Start →
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};
