import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { insightRadius } from '../common/radii';
import { CommandCard } from './CommandCard';
import { MODULES } from './moduleData';
import { Section } from './Section';

type Props = {
  currentModuleId: string;
  isOpen: boolean;
};

type CmdText = { description: string; steps?: string[] };

export const DocsPanel = ({ currentModuleId, isOpen }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!isOpen) return;
    const match = MODULES.find((m) => m.id === currentModuleId);
    if (!match) return;
    setOpen(match.id);
    requestAnimationFrame(() => {
      rowRefs.current[match.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [currentModuleId, isOpen]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-3 py-4 flex flex-col gap-2">
        {MODULES.map((mod) => {
          const isExpanded = open === mod.id;
          const isCurrent = mod.id === currentModuleId;
          const cmdTexts = t(`docs.modules.${mod.id}.commands`, { returnObjects: true }) as CmdText[];

          return (
            <div
              key={mod.id}
              ref={(el) => { rowRefs.current[mod.id] = el; }}
              className="overflow-hidden"
              style={{
                borderRadius: '12px',
                border: `1.5px solid ${isExpanded ? mod.accent : isCurrent ? `color-mix(in srgb, ${mod.accent} 40%, var(--hair))` : 'var(--hair)'}`,
                background: 'var(--panel)',
                transition: 'border-color 0.2s',
              }}
            >
              <button
                type="button"
                className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 cursor-pointer"
                style={{
                  background: isExpanded
                    ? `color-mix(in srgb, ${mod.accent} 7%, var(--panel))`
                    : 'transparent',
                  transition: 'background 0.2s',
                }}
                onClick={() => setOpen(isExpanded ? null : mod.id)}
              >
                <span
                  className="font-mono text-xs font-bold w-6 h-6 flex items-center justify-center flex-shrink-0"
                  style={{
                    borderRadius: '7px',
                    background: `color-mix(in srgb, ${mod.accent} 15%, var(--panel2))`,
                    color: mod.accent,
                    border: `1.5px solid color-mix(in srgb, ${mod.accent} 35%, transparent)`,
                  }}
                >
                  {mod.num}
                </span>
                <span className="font-hand font-bold text-sm text-[var(--ink)] flex-1 leading-tight">
                  {t(`intro.${mod.id}.title`)}
                </span>
                {isCurrent && !isExpanded && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: mod.accent }}
                  />
                )}
                <span
                  className="font-mono text-xs text-[var(--muted)] flex-shrink-0"
                  style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}
                >
                  ▾
                </span>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 flex flex-col gap-3">
                  <div className="h-px" style={{ background: `color-mix(in srgb, ${mod.accent} 20%, var(--hair))` }} />

                  <div className="flex flex-col gap-2">
                    <Section label={t('docs.labels.theProblem')}>
                      <p className="text-sm text-[var(--soft)] leading-relaxed m-0 font-hand">
                        {t(`intro.${mod.id}.scenario`)}
                      </p>
                    </Section>
                    <Section label={t('docs.labels.howGitWorks')}>
                      <p className="text-sm text-[var(--soft)] leading-relaxed m-0 font-hand">
                        {t(`intro.${mod.id}.concept`)}
                      </p>
                    </Section>
                  </div>

                  <div
                    className="px-2.5 py-2"
                    style={{
                      borderLeft: `3px solid ${mod.accent}`,
                      borderRadius: insightRadius,
                      background: `color-mix(in srgb, ${mod.accent} 7%, var(--panel))`,
                    }}
                  >
                    <span className="font-bold text-xs font-hand" style={{ color: mod.accent }}>
                      {t('docs.labels.keyInsight')}{' '}
                    </span>
                    <span className="text-sm text-[var(--soft)] font-hand">
                      {t(`intro.${mod.id}.keyInsight`)}
                    </span>
                  </div>

                  <Section label={t('docs.labels.commands')}>
                    <div className="flex flex-col gap-1.5">
                      {mod.commandStrings.map((cmdStr, i) => {
                        const txt = Array.isArray(cmdTexts) ? cmdTexts[i] : undefined;
                        return (
                          <CommandCard
                            key={cmdStr}
                            commandStr={cmdStr}
                            description={txt?.description ?? ''}
                            steps={txt?.steps}
                            accent={mod.accent}
                          />
                        );
                      })}
                    </div>
                  </Section>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
