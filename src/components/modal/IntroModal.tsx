import { useTranslation } from 'react-i18next';
import type { ModuleId } from '../../types';
import { ModalBackdrop } from './ModalBackdrop';
import { Button } from '../common/Button';
import { cardRadius, insightRadius } from '../common/radii';

type IntroModalProps = {
  moduleId: Exclude<ModuleId, 'sandbox'>;
  onStart: () => void;
  onSkip: () => void;
};

export const IntroModal = ({ moduleId, onStart, onSkip }: IntroModalProps) => {
  const { t } = useTranslation();

  return (
    <ModalBackdrop>
      <div
        className="bg-[var(--panel)] shadow-2xl w-full mx-6"
        style={{
          maxWidth: 480,
          border: '2.5px solid var(--ink)',
          borderRadius: cardRadius,
        }}
      >
        <div className="px-7 pt-7 pb-2">
          <div className="font-bold text-lg text-[var(--ink)] leading-tight font-hand">
            {t(`intro.${moduleId}.title`)}
          </div>
        </div>

        <div className="px-7 pt-3 pb-1 flex flex-col gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] block mb-1">
              The Problem
            </span>
            <p className="text-sm text-[var(--soft)] leading-relaxed m-0 font-hand">
              {t(`intro.${moduleId}.scenario`)}
            </p>
          </div>

          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] block mb-1">
              How Git Works
            </span>
            <p className="text-sm text-[var(--soft)] leading-relaxed m-0 font-hand">
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
            <span className="font-bold text-xs text-[var(--feat)] font-hand">
              Key insight:{' '}
            </span>
            <span className="text-sm text-[var(--soft)] font-hand">
              {t(`intro.${moduleId}.keyInsight`)}
            </span>
          </div>
        </div>

        <div className="px-7 py-5 flex items-center justify-between">
          <Button variant="ghost" onClick={onSkip}>
            Skip intro
          </Button>
          <Button variant="primary" color="var(--ink)" className="font-mono" onClick={onStart}>
            Start →
          </Button>
        </div>
      </div>
    </ModalBackdrop>
  );
};
