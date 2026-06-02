import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CommandHistoryTab } from "./components/CommandHistoryTab";
import { CommandPanel } from "./components/CommandPanel";
import { CommandTicker } from "./components/CommandTicker";
import { Button } from "./components/common/Button";
import { Toast } from "./components/common/Toast";
import { ExplainerCard } from "./components/ExplainerCard";
import { GitCanvas } from "./components/GitCanvas";
import { GoalCard } from "./components/GoalCard";
import { ReflogPanel } from "./components/ReflogPanel";
import { ConflictModal } from "./components/modal/ConflictModal";
import { IntroModal } from "./components/modal/IntroModal";
import { Sidebar } from "./components/sidebar/Sidebar";
import i18n from "./i18n";
import {
  LESSON_BRANCH,
  LESSON_CHERRY_PICK,
  LESSON_CONFLICT,
  LESSON_DETACHED_HEAD,
  LESSON_LINEAR,
  LESSON_MERGE,
  LESSON_REBASE,
  LESSON_REFLOG,
  LESSON_RESET,
  LESSON_SQUASH,
  LESSON_STASH,
} from "./lessons";
import type { LessonGoal, ModuleId } from "./types";
import { useGitStore } from "./useGitStore";

const MODULE_COMMANDS: Partial<Record<ModuleId, string[]>> = {
  module1: ['git commit -m "feat: ..."'],
  module2: ['git checkout -b feature', 'git commit -m "feat: ..."'],
  module3: ['git cherry-pick <hash>'],
  module4: ['git rebase main'],
  module5: ['git merge feature'],
  module6: ['git merge feature'],
  module7: ['git reset --hard c3'],
  module8: ['git stash', 'git checkout main', 'git stash pop'],
  module9: ['git rebase -i HEAD~3'],
  module10: ['git checkout c2', 'git checkout main'],
  module11: ['git reflog', 'git reset --hard <hash>'],
  sandbox: ['git commit -m "feat: ..."', 'git checkout -b feature', 'git merge feature', 'git rebase main'],
};

const MODULE_IDS: ModuleId[] = [
  'module1', 'module2', 'module3', 'module4', 'module5',
  'module6', 'module7', 'module8', 'module9', 'module10',
  'module11', 'sandbox',
];

const MODULE_ACCENT: Record<ModuleId, string> = {
  module1: 'var(--ok)',
  module2: 'var(--feat)',
  module3: 'var(--ok)',
  module4: 'var(--head)',
  module5: 'var(--ok)',
  module6: 'var(--conflict)',
  module7: 'var(--head)',
  module8: 'var(--feat)',
  module9: 'var(--feat)',
  module10: 'var(--head)',
  module11: 'var(--ok)',
  sandbox: 'var(--feat)',
};

const MODULE_LESSONS: Partial<Record<string, LessonGoal>> = {
  module1: LESSON_LINEAR,
  module2: LESSON_BRANCH,
  module3: LESSON_CHERRY_PICK,
  module4: LESSON_REBASE,
  module5: LESSON_MERGE,
  module6: LESSON_CONFLICT,
  module7: LESSON_RESET,
  module8: LESSON_STASH,
  module9: LESSON_SQUASH,
  module10: LESSON_DETACHED_HEAD,
  module11: LESSON_REFLOG,
};

const getCommandType = (command: string): string | null => {
  if (command.startsWith("git add")) return null;
  if (command.startsWith("git push")) return null;
  if (command.startsWith("git pull")) return null;
  if (command.startsWith("git checkout -b")) return "checkout-b";
  if (command.startsWith("git checkout") && !command.includes("-b")) return "checkout";
  if (command.startsWith("git commit")) return "commit";
  if (command.startsWith("git cherry-pick")) return "cherry-pick";
  if (command.startsWith("git rebase -i")) return "squash";
  if (command.startsWith("git rebase")) return "rebase";
  if (command.startsWith("git merge")) return "merge";
  if (command.startsWith("git reset")) return "reset";
  if (command.startsWith("git stash"))
    return command.includes("pop") ? "stash-pop" : "stash";
  return null;
};

export const App = () => {
  const { t } = useTranslation();
  const store = useGitStore();
  const [explainerCommand, setExplainerCommand] = useState<string | null>(null);
  const [highlightNodeIds, setHighlightNodeIds] = useState<string[]>([]);
  const explainerKeyRef = useRef(0);
  const seenCommandTypesRef = useRef(new Set<string>());
  const [pendingModule, setPendingModule] = useState<ModuleId | null>(null);
  const [activeTab, setActiveTab] = useState<'graph' | 'history'>('graph');

  const [toastModuleId, setToastModuleId] = useState<ModuleId | null>(null);
  const [justUnlockedId, setJustUnlockedId] = useState<ModuleId | null>(null);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enterModule = (id: ModuleId) => {
    setPendingModule(null);
    if (id === "module1") store.enterModule1();
    else if (id === "module2") store.enterModule2();
    else if (id === "module3") store.enterModule3();
    else if (id === "module4") store.enterModule4();
    else if (id === "module5") store.enterModule5();
    else if (id === "module6") store.enterModule6();
    else if (id === "module7") store.enterModule7();
    else if (id === "module8") store.enterModule8();
    else if (id === "module9") store.enterModule9();
    else if (id === "module10") store.enterModule10();
    else if (id === "module11") store.enterModule11();
    else store.unlockSandbox();
  };

  useEffect(() => {
    if (store.showCompletionOverlay) {
      setToastModuleId(store.mode as ModuleId);
      const currentIndex = MODULE_IDS.indexOf(store.mode as ModuleId);
      const nextId = currentIndex >= 0 && currentIndex < MODULE_IDS.length - 1
        ? MODULE_IDS[currentIndex + 1]
        : null;
      if (nextId) {
        setJustUnlockedId(nextId);
        if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = setTimeout(() => setJustUnlockedId(null), 3500);
      }
    }
  }, [store.showCompletionOverlay, store.mode]);

  useEffect(() => () => {
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
  }, []);

  const currentLesson = MODULE_LESSONS[store.mode];
  const currentModuleProgress = store.moduleProgress.find(
    (p) => p.id === store.mode,
  );
  const currentComplete = currentModuleProgress?.status === "complete";

  const executeModuleCommand = (cmd: string) => {
    const { branches, commits, HEAD } = store.gitState;

    if (cmd.startsWith('git commit')) {
      store.doAddCommit();
    } else if (cmd === 'git checkout -b feature') {
      const headCommit = branches[HEAD] ?? HEAD;
      store.doCreateBranch(headCommit);
    } else if (cmd.startsWith('git checkout') && !cmd.includes('-b')) {
      const target = cmd.split(' ').pop();
      if (target) store.doCheckout(target);
    } else if (cmd.startsWith('git cherry-pick')) {
      const otherBranch = Object.keys(branches).find((b) => b !== HEAD);
      if (otherBranch) {
        const sourceCommit = branches[otherBranch];
        if (sourceCommit) store.doCherryPick(sourceCommit, HEAD);
      }
    } else if (cmd === 'git rebase main') {
      const featureBranch = Object.keys(branches).find((b) => b !== 'main') ?? HEAD;
      store.doRebase(featureBranch, 'main');
    } else if (cmd.startsWith('git merge')) {
      const sourceBranch = cmd.split(' ')[2];
      const targetBranch = HEAD !== sourceBranch ? HEAD : 'main';
      if (sourceBranch) store.doMerge(sourceBranch, targetBranch);
    } else if (cmd.startsWith('git reset --hard') && !cmd.includes('<')) {
      const target = cmd.split(' ').pop();
      if (target) store.doResetHard(target);
    } else if (cmd === 'git stash') {
      store.doStash();
    } else if (cmd === 'git stash pop') {
      store.doStashPop();
    } else if (cmd.startsWith('git rebase -i')) {
      const featureBranch = Object.keys(branches).find((b) => b !== 'main') ?? HEAD;
      const featureTip = branches[featureBranch];
      if (!featureTip) return;
      const mainTip = branches['main'];
      const mainCommits = new Set<string>();
      let cur: string | undefined = mainTip;
      while (cur) {
        mainCommits.add(cur);
        cur = commits[cur]?.parentIds[0];
      }
      let count = 0;
      cur = featureTip;
      while (cur && !mainCommits.has(cur)) {
        count++;
        cur = commits[cur]?.parentIds[0];
      }
      if (count > 1) store.doSquash(featureBranch, count, 'feat: squashed');
    } else if (cmd === 'git reflog') {
      store.setTicker({ command: 'git reflog', state: 'flash' });
      setTimeout(() => store.setTicker({ command: '', state: 'idle' }), 1200);
    } else if (cmd.startsWith('git reset --hard') && cmd.includes('<')) {
      const firstEntry = store.reflog[0];
      if (firstEntry) store.doReflogRecover(firstEntry.hash);
    }
  };

  const toggleLang = () => {
    const next = i18n.language === "en" ? "th" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", store.theme);
  }, [store.theme]);

  useEffect(() => {
    if (
      store.ticker.state === "flash" &&
      store.ticker.command &&
      !explainerCommand
    ) {
      const type = getCommandType(store.ticker.command);
      if (type && !seenCommandTypesRef.current.has(type)) {
        seenCommandTypesRef.current.add(type);
        explainerKeyRef.current += 1;
        setExplainerCommand(store.ticker.command);
      }
    }
  }, [store.ticker.state, store.ticker.command]);

  return (
    <div className="flex h-screen overflow-hidden">
      {store.sidebarOpen && (
        <Sidebar
          history={store.history}
          mode={store.mode}
          moduleProgress={store.moduleProgress}
          justUnlockedId={justUnlockedId}
          onEnter={(id) => {
            if (id === store.mode) return;
            if (id === 'sandbox') { store.unlockSandbox(); return; }
            const progress = store.moduleProgress.find(p => p.id === id);
            const isFirstVisit = !progress || progress.status === 'available';
            if (isFirstVisit) {
              setPendingModule(id);
            } else {
              enterModule(id);
            }
          }}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-dashed border-[var(--hair)] flex-shrink-0">
          <Button
            onClick={() => store.setSidebarOpen((o) => !o)}
            title="Toggle sidebar"
          >
            {store.sidebarOpen ? "◀" : "▶"}
          </Button>
          <span className="font-mono text-xs text-[var(--muted)]">
            {t(`modules.${store.mode}`, store.mode)}
          </span>
          <div className="flex gap-1 flex-1">
            <Button
              onClick={() => setActiveTab('graph')}
              style={{
                borderColor: activeTab === 'graph' ? 'var(--ink)' : 'var(--hair)',
                color: activeTab === 'graph' ? 'var(--ink)' : 'var(--muted)',
              }}
            >
              {t('toolbar.tabGraph')}
            </Button>
            <Button
              onClick={() => setActiveTab('history')}
              style={{
                borderColor: activeTab === 'history' ? 'var(--ink)' : 'var(--hair)',
                color: activeTab === 'history' ? 'var(--ink)' : 'var(--muted)',
              }}
            >
              {t('toolbar.tabHistory')}
              {store.history.length > 0 && (
                <span className="ml-1 text-[10px] text-[var(--muted)]">
                  {store.history.length}
                </span>
              )}
            </Button>
          </div>
          {(store.mode === "module8" ||
            (store.mode === "sandbox" && store.wip)) && (
            <Button
              onClick={store.doStash}
              disabled={!store.wip}
              title="git stash"
              style={{
                color: store.wip ? "var(--feat)" : "var(--muted)",
                opacity: store.wip ? 1 : 0.5,
              }}
            >
              {t("toolbar.stash")}
            </Button>
          )}
          {store.stashStack.length > 0 && (
            <Button
              onClick={store.doStashPop}
              title="git stash pop"
              style={{ color: "var(--feat)" }}
            >
              {t("toolbar.pop", { count: store.stashStack.length })}
            </Button>
          )}
          <Button onClick={store.doReset} title="Reset canvas">
            {t("toolbar.reset")}
          </Button>
          <Button
            onClick={() =>
              store.setTheme((t) => (t === "light" ? "dark" : "light"))
            }
          >
            {store.theme === "light" ? "◑" : "○"} {t("toolbar.theme")}
          </Button>
          <Button onClick={toggleLang} className="text-xs">
            {i18n.language === "en" ? "EN" : "TH"}
          </Button>
          <Button
            onClick={store.unlockAll}
            title="Unlock all modules (dev mode)"
            className="text-xs px-2"
            style={{
              borderColor: store.devMode ? "var(--feat)" : "var(--hair)",
              color: store.devMode ? "var(--feat)" : "var(--muted)",
            }}
          >
            {store.devMode ? `⚙ ${t("toolbar.dev")}` : "⚙"}
          </Button>
        </div>

        {/* Canvas / History tab */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {activeTab === 'history' && (
            <CommandHistoryTab history={store.history} />
          )}
          <div className={activeTab === 'graph' ? 'flex-1 relative' : 'hidden'}>
          <GitCanvas
            gitState={store.gitState}
            mode={store.mode}
            doAddCommit={store.doAddCommit}
            doCherryPick={store.doCherryPick}
            doRebase={store.doRebase}
            doMerge={store.doMerge}
            doStartWip={store.doStartWip}
            doCreateBranch={store.doCreateBranch}
            doCheckout={store.doCheckout}
            doResetHard={store.doResetHard}
            doSquash={store.doSquash}
            setGhostCommand={(cmd, subtitle) =>
              store.setTicker({
                command: cmd,
                subtitle,
                state: cmd ? "ghost" : "idle",
              })
            }
            wip={store.wip}
            highlightNodeIds={highlightNodeIds}
          />

          {/* Module goal card */}
          {currentLesson && !currentComplete && (
            <GoalCard
              lesson={currentLesson}
              attempts={store.moduleAttempts}
              guided={store.moduleGuided}
              onToggleGuided={store.setModuleGuided}
            />
          )}

          {/* Reflog panel for module11 */}
          <ReflogPanel
            visible={store.mode === "module11"}
            reflog={store.reflog}
            onRecover={store.doReflogRecover}
            currentCommits={new Set(Object.keys(store.gitState.commits))}
          />

{/* Orange conflict flash */}
          {store.conflictFlash && (
            <div
              className="absolute inset-0 pointer-events-none z-40"
              style={{
                background:
                  "color-mix(in srgb, var(--conflict) 35%, transparent)",
              }}
            />
          )}

          {/* Conflict resolution modal */}
          {store.conflictState && (
            <ConflictModal
              conflict={store.conflictState}
              onResolve={store.resolveConflict}
            />
          )}

          {/* Contextual explainer */}
          {explainerCommand && (
            <ExplainerCard
              key={explainerKeyRef.current}
              command={explainerCommand}
              onDismiss={() => setExplainerCommand(null)}
            />
          )}

          {/* Intro modal */}
          {pendingModule && pendingModule !== "sandbox" && (
            <IntroModal
              moduleId={pendingModule}
              onStart={() => enterModule(pendingModule)}
              onSkip={() => enterModule(pendingModule)}
            />
          )}
          </div>
        </div>

        {/* Command panel */}
        <CommandPanel
          mode={store.mode as ModuleId}
          commands={MODULE_COMMANDS[store.mode as ModuleId] ?? []}
          onPreview={(cmd) => store.setTicker({ command: cmd, state: cmd ? 'ghost' : 'idle' })}
          onExecute={executeModuleCommand}
        />

        {/* Ticker */}
        <CommandTicker
          ticker={store.ticker}
          history={store.history}
          gitState={store.gitState}
          onTokenHover={setHighlightNodeIds}
        />
      </div>
      {toastModuleId && (
        <Toast
          moduleId={toastModuleId}
          accentColor={MODULE_ACCENT[toastModuleId]}
          onDismiss={() => setToastModuleId(null)}
        />
      )}
    </div>
  );
};
