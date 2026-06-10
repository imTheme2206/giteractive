import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './language-switcher'
import { ThemeSwitcher } from './theme-switcher'

type WelcomeSectionProps = { title: string; children: React.ReactNode }
const WelcomeSection = ({ title, children }: WelcomeSectionProps) => (
  <div
    className="flex flex-col gap-1 px-4 py-3"
    style={{
      borderRadius: '12px',
      background: 'var(--panel2)',
      border: '1px solid var(--hair)',
    }}
  >
    <span className="font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--ok)' }}>
      {title}
    </span>
    <p className="m-0 font-hand text-sm leading-relaxed text-[var(--soft)]">{children}</p>
  </div>
)

export const WelcomeOverlay = () => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(() => !localStorage.getItem('giteractive_welcomed'))

  if (!visible) return null

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="mx-4 flex w-full max-w-xl flex-col gap-6 p-8"
        style={{
          borderRadius: '20px',
          border: '1.5px solid var(--hair)',
          background: 'var(--panel)',
        }}
      >
        <div className="flex justify-between gap-x-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs tracking-widest text-[var(--muted)] uppercase">{t('welcome.subtitle')}</span>
            <h1 className="m-0 font-hand text-3xl font-bold text-[var(--ink)]">Giteractive</h1>
            <p className="m-0 font-hand text-sm text-[var(--soft)]">{t('welcome.tagline')}</p>
          </div>
          <div className="flex h-fit gap-x-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <WelcomeSection title={t('welcome.sections.whatIsGit.title')}>
            <Trans i18nKey="welcome.sections.whatIsGit.body" components={{ strong: <strong />, em: <em /> }} />
          </WelcomeSection>
          <WelcomeSection title={t('welcome.sections.whatDoesGitDo.title')}>
            <Trans i18nKey="welcome.sections.whatDoesGitDo.body" components={{ strong: <strong />, em: <em /> }} />
          </WelcomeSection>
          <WelcomeSection title={t('welcome.sections.gitVsGithub.title')}>
            <Trans i18nKey="welcome.sections.gitVsGithub.body" components={{ strong: <strong />, em: <em />, br: <br /> }} />
          </WelcomeSection>
        </div>

        <button
          type="button"
          className="cursor-pointer self-end px-5 py-2.5 font-hand text-sm font-bold transition-colors"
          style={{
            borderRadius: '10px',
            background: 'var(--ok)',
            color: '#fff',
            border: 'none',
          }}
          onClick={() => setVisible(false)}
        >
          {t('welcome.getStarted')}
        </button>
      </div>
    </div>
  )
}
