import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import type { ModuleId } from '../../types';
import { Button } from '../common/Button';

type ToolbarProps = {
  mode: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeTab: 'graph' | 'history';
  onTabChange: (tab: 'graph' | 'history') => void;
  docsOpen: boolean;
  onToggleDocs: () => void;
  wip: string | null;
  stashStack: unknown[];
  onStash: () => void;
  onStashPop: () => void;
  onReset: () => void;
  theme: string;
  onToggleTheme: () => void;
  devMode: boolean;
  onUnlockAll: () => void;
  historyCount: number;
};

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
  theme,
  onToggleTheme,
  devMode,
  onUnlockAll,
  historyCount,
}: ToolbarProps) => {
  const { t } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'th' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-dashed border-[var(--hair)] flex-shrink-0">
      <Button onClick={onToggleSidebar} title="Toggle sidebar">
        {sidebarOpen ? '◀' : '▶'}
      </Button>
      <span className="font-mono text-xs text-[var(--muted)]">
        {t(`modules.${mode}`, mode)}
      </span>
      <div className="flex gap-1 flex-1">
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
          {historyCount > 0 && (
            <span className="ml-1 text-xs text-[var(--muted)]">{historyCount}</span>
          )}
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
          style={{ color: wip ? 'var(--feat)' : 'var(--muted)', opacity: wip ? 1 : 0.5 }}
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
      <Button onClick={onToggleTheme}>
        {theme === 'light' ? '◑' : '○'} {t('toolbar.theme')}
      </Button>
      <Button onClick={toggleLang} className="text-xs">
        {i18n.language === 'en' ? 'EN' : 'TH'}
      </Button>
      <Button
        onClick={onUnlockAll}
        title="Unlock all modules (dev mode)"
        className="text-xs px-2"
        style={{
          borderColor: devMode ? 'var(--feat)' : 'var(--hair)',
          color: devMode ? 'var(--feat)' : 'var(--muted)',
        }}
      >
        {devMode ? `⚙ ${t('toolbar.dev')}` : '⚙'}
      </Button>
    </div>
  );
};
