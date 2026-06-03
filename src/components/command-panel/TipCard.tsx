import { useTranslation } from 'react-i18next';
import { cardRadius } from '../common/radii';
import type { CommandKey } from './commandInfo';
import { COMMANDS_WITH_STEPS } from './commandInfo';

type TipCardProps = {
  commandKey: CommandKey;
  onClose: () => void;
};

export const TipCard = ({ commandKey, onClose }: TipCardProps) => {
  const { t } = useTranslation();
  const base = `commandPanel.commands.${commandKey}`;
  const hasSteps = COMMANDS_WITH_STEPS.has(commandKey);
  const rawSteps = hasSteps ? t(`${base}.steps`, { returnObjects: true }) : null;
  const steps: string[] | null = Array.isArray(rawSteps) ? rawSteps : null;

  return (
    <div className="absolute z-30 bottom-full mb-2 left-4" style={{ width: 320 }}>
      <div
        className="bg-[var(--panel)] p-4 shadow-lg border-2"
        style={{ borderRadius: cardRadius, borderColor: 'var(--ink)' }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="font-mono text-[11px] font-bold text-[var(--ink)]">
            {t(`${base}.title`)}
          </span>
          <button
            type="button"
            className="font-mono text-[11px] text-[var(--muted)] hover:text-[var(--ink)] leading-none cursor-pointer flex-shrink-0"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <p className="font-hand text-[13px] text-[var(--soft)] leading-snug m-0 mb-3">
          {t(`${base}.description`)}
        </p>
        {steps && (
          <ol className="m-0 pl-0 flex flex-col gap-1.5 list-none">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="font-mono text-[10px] text-[var(--muted)] flex-shrink-0 mt-0.5">
                  {i + 1}.
                </span>
                <span className="font-hand text-[12px] text-[var(--soft)] leading-snug">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};
