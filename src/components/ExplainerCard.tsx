import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ExplainerCardProps = {
  command: string;
  onDismiss: () => void;
};

const cardRadius = '255px 14px 225px 16px/16px 225px 14px 255px';
const pillRadius = '60px 10px 60px 10px/10px 60px 10px 60px';

type ExplainerKey = {
  titleKey: string;
  bodyKey?: string;
  stepsKey?: string;
  vars: Record<string, string>;
  color: string;
};

const getExplainerKey = (command: string): ExplainerKey | null => {
  if (command.startsWith('git checkout -b')) {
    const branch = command.split(' ')[2] ?? 'feature';
    return { titleKey: 'explainer.branchCreated.title', bodyKey: 'explainer.branchCreated.body', vars: { branch }, color: 'var(--feat)' };
  }
  if (command.startsWith('git commit')) {
    return { titleKey: 'explainer.newCommit.title', bodyKey: 'explainer.newCommit.body', vars: {}, color: 'var(--main)' };
  }
  if (command.startsWith('git cherry-pick')) {
    const hash = command.split(' ')[2] ?? '';
    return { titleKey: 'explainer.cherryPick.title', stepsKey: 'explainer.cherryPick.steps', vars: { hash }, color: 'var(--feat)' };
  }
  if (command.startsWith('git rebase')) {
    const onto = command.split(' ')[2] ?? '';
    return { titleKey: 'explainer.rebase.title', stepsKey: 'explainer.rebase.steps', vars: { onto }, color: 'var(--head)' };
  }
  if (command.startsWith('git merge')) {
    const branch = command.split(' ')[2]?.replace(/#.*/, '').trim() ?? '';
    return { titleKey: 'explainer.mergeCommit.title', stepsKey: 'explainer.mergeCommit.steps', vars: { branch }, color: 'var(--ok)' };
  }
  if (command.startsWith('git reset --hard')) {
    const target = command.split(' ')[3] ?? '';
    return { titleKey: 'explainer.hardReset.title', stepsKey: 'explainer.hardReset.steps', vars: { target }, color: 'var(--head)' };
  }
  if (command.startsWith('git stash')) {
    const isPop = command.includes('pop');
    return {
      titleKey: isPop ? 'explainer.stashPopped.title' : 'explainer.workStashed.title',
      bodyKey: isPop ? 'explainer.stashPopped.body' : 'explainer.workStashed.body',
      vars: {},
      color: 'var(--feat)',
    };
  }
  return null;
};

const STEP_INTERVAL_MS = 700;
const AUTO_DISMISS_MS = 8000;

export const ExplainerCard = ({ command, onDismiss }: ExplainerCardProps) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);

  const keys = getExplainerKey(command);
  const steps = keys?.stepsKey
    ? (t(keys.stepsKey, { returnObjects: true, ...keys.vars }) as string[])
    : null;
  const totalSteps = steps?.length ?? 0;

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, AUTO_DISMISS_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDismiss]);

  useEffect(() => {
    if (!steps || visibleSteps >= totalSteps) return;
    const timer = setTimeout(() => setVisibleSteps(s => s + 1), visibleSteps === 0 ? 200 : STEP_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [visibleSteps, totalSteps, steps]);

  if (!keys) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 72,
        right: 24,
        width: 316,
        zIndex: 20,
        transition: 'opacity 0.3s, transform 0.3s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      <div
        className="bg-[var(--panel)] p-4 shadow-lg"
        style={{
          border: `2px solid ${keys.color}`,
          borderRadius: cardRadius,
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <span
              className="font-bold text-sm text-[var(--ink)]"
              style={{ fontFamily: 'var(--hand)' }}
            >
              {t(keys.titleKey)}
            </span>
          </div>
          <button
            onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
            className="text-[var(--muted)] text-lg leading-none cursor-pointer bg-transparent border-0 flex-shrink-0"
            style={{ fontFamily: 'var(--hand)' }}
          >
            ×
          </button>
        </div>

        {keys.bodyKey && (
          <p
            className="text-sm text-[var(--soft)] leading-snug m-0 mb-3"
            style={{ fontFamily: 'var(--hand)' }}
          >
            {t(keys.bodyKey, keys.vars)}
          </p>
        )}

        {steps && (
          <ol className="m-0 mb-3 pl-0 flex flex-col gap-1.5 list-none">
            {steps.map((step, i) => (
              <li
                key={i}
                className="flex gap-2 items-start"
                style={{
                  transition: 'opacity 0.4s, transform 0.4s',
                  opacity: i < visibleSteps ? 1 : 0,
                  transform: i < visibleSteps ? 'translateY(0)' : 'translateY(6px)',
                }}
              >
                <span
                  className="font-mono text-[10px] flex-shrink-0 mt-0.5"
                  style={{ color: keys.color, minWidth: '1.2em' }}
                >
                  {i + 1}.
                </span>
                <span
                  className="text-[13px] text-[var(--soft)] leading-snug"
                  style={{ fontFamily: 'var(--hand)' }}
                >
                  {step}
                </span>
              </li>
            ))}
          </ol>
        )}

        <span
          className="font-mono text-[11px] text-[var(--muted)] border border-[var(--hair)] px-2 py-0.5 bg-[var(--panel2)]"
          style={{ borderRadius: pillRadius }}
        >
          $ {command}
        </span>
      </div>
    </div>
  );
};
