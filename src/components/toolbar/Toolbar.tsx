import { useTranslation } from 'react-i18next'
import { Button } from '../common/Button'
import { LanguageSwitcher } from '../language-switcher'
import { ThemeSwitcher } from '../theme-switcher'

type ToolbarProps = {
  mode: string
  sidebarOpen: boolean
  onToggleSidebar: () => void
  activeTab: 'graph' | 'history'
  onTabChange: (tab: 'graph' | 'history') => void
  docsOpen: boolean
  onToggleDocs: () => void
  wip: string | null
  stashStack: unknown[]
  onStash: () => void
  onStashPop: () => void
  onReset: () => void
  historyCount: number
}

export const Toolbar = ({
  mode,
  sidebarOpen,
  onToggleSidebar,
  activeTab,
  onTabChange,
  docsOpen,
  onToggleDocs,
  wip,
  stashStack,
  onStash,
  onStashPop,
  onReset,
  historyCount,
}: ToolbarProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-shrink-0 items-center gap-2 border-b border-dashed border-[var(--hair)] px-4 py-2">
      <Button onClick={onToggleSidebar} title="Toggle sidebar">
        {sidebarOpen ? '◀' : '▶'}
      </Button>
      <span className="font-mono text-xs text-[var(--muted)]">{t(`modules.${mode}`, mode)}</span>
      <div className="flex flex-1 gap-1">
        <Button
          onClick={() => onTabChange('graph')}
          style={{
            borderColor: activeTab === 'graph' ? 'var(--ink)' : 'var(--hair)',
            color: activeTab === 'graph' ? 'var(--ink)' : 'var(--muted)',
          }}
        >
          {t('toolbar.tabGraph')}
        </Button>
        <Button
          onClick={() => onTabChange('history')}
          style={{
            borderColor: activeTab === 'history' ? 'var(--ink)' : 'var(--hair)',
            color: activeTab === 'history' ? 'var(--ink)' : 'var(--muted)',
          }}
        >
          {t('toolbar.tabHistory')}
          {historyCount > 0 && <span className="ml-1 text-xs text-[var(--muted)]">{historyCount}</span>}
        </Button>
        <Button
          onClick={onToggleDocs}
          style={{
            borderColor: docsOpen ? 'var(--ink)' : 'var(--hair)',
            color: docsOpen ? 'var(--ink)' : 'var(--muted)',
          }}
        >
          Docs
        </Button>
      </div>
      {(mode === 'module8' || (mode === 'sandbox' && wip)) && (
        <Button
          onClick={onStash}
          disabled={!wip}
          title="git stash"
          style={{
            color: wip ? 'var(--feat)' : 'var(--muted)',
            opacity: wip ? 1 : 0.5,
          }}
        >
          {t('toolbar.stash')}
        </Button>
      )}
      {stashStack.length > 0 && (
        <Button onClick={onStashPop} title="git stash pop" style={{ color: 'var(--feat)' }}>
          {t('toolbar.pop', { count: stashStack.length })}
        </Button>
      )}
      <Button onClick={onReset} title="Reset canvas">
        {t('toolbar.reset')}
      </Button>
      <ThemeSwitcher />
      <LanguageSwitcher />
    </div>
  )
}
