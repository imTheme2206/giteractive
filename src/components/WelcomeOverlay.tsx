import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

type WelcomeSectionProps = { title: string; children: React.ReactNode };
const WelcomeSection = ({ title, children }: WelcomeSectionProps) => (
  <div
    className="px-4 py-3 flex flex-col gap-1"
    style={{ borderRadius: '12px', background: 'var(--panel2)', border: '1px solid var(--hair)' }}
  >
    <span
      className="font-mono text-xs uppercase tracking-widest font-bold"
      style={{ color: 'var(--ok)' }}
    >
      {title}
    </span>
    <p className="font-hand text-sm text-[var(--soft)] leading-relaxed m-0">{children}</p>
  </div>
);

export const WelcomeOverlay = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(() => !localStorage.getItem('giteractive_welcomed'));

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ background: 'color-mix(in srgb, var(--bg) 85%, transparent)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="max-w-xl w-full mx-4 flex flex-col gap-6 p-8"
        style={{ borderRadius: '20px', border: '1.5px solid var(--hair)', background: 'var(--panel)' }}
      >
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
            {t('welcome.subtitle')}
          </span>
          <h1 className="font-hand font-bold text-3xl text-[var(--ink)] m-0">Giteractive</h1>
          <p className="font-hand text-[var(--soft)] text-sm m-0">{t('welcome.tagline')}</p>
        </div>

        <div className="flex flex-col gap-3">
          <WelcomeSection title={t('welcome.sections.whatIsGit.title')}>
            <Trans i18nKey="welcome.sections.whatIsGit.body" components={{ strong: <strong />, em: <em /> }} />
          </WelcomeSection>
          <WelcomeSection title={t('welcome.sections.whatDoesGitDo.title')}>
            <Trans i18nKey="welcome.sections.whatDoesGitDo.body" components={{ strong: <strong />, em: <em /> }} />
          </WelcomeSection>
          <WelcomeSection title={t('welcome.sections.gitVsGithub.title')}>
            <Trans
              i18nKey="welcome.sections.gitVsGithub.body"
              components={{ strong: <strong />, em: <em />, br: <br /> }}
            />
          </WelcomeSection>
        </div>

        <button
          type="button"
          className="self-end font-hand font-bold text-sm px-5 py-2.5 cursor-pointer transition-colors"
          style={{ borderRadius: '10px', background: 'var(--ok)', color: '#fff', border: 'none' }}
          onClick={() => setVisible(false)}
        >
          {t('welcome.getStarted')}
        </button>
      </div>
    </div>
  );
};
