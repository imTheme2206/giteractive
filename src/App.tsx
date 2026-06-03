import { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { CommandHistoryTab } from "./components/command-history/CommandHistoryTab";
import { CommandPanel } from "./components/command-panel/CommandPanel";
import { CommandTicker } from "./components/CommandTicker";
import { Button } from "./components/common/Button";
import { Toast } from "./components/common/Toast";
import { DocsPanel } from "./components/docs/DocsPanel";
import { ExplainerCard } from "./components/ExplainerCard";
import { GitCanvas } from "./components/GitCanvas";
import { GoalCard } from "./components/GoalCard";
import { ConflictModal } from "./components/modal/ConflictModal";
import { IntroModal } from "./components/modal/IntroModal";
import { ReflogPanel } from "./components/ReflogPanel";
import { Sidebar } from "./components/sidebar/Sidebar";
import i18n from "./i18n";
import {
  LESSON_BRANCH,
  LESSON_CHERRY_PICK,
  LESSON_CONFLICT,
  LESSON_DETACHED_HEAD,
  LESSON_INIT,
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
import { deriveCommands } from "./utils/deriveCommands";

const MODULE_IDS: ModuleId[] = [
  "module0",
  "module1",
  "module2",
  "module3",
  "module4",
  "module5",
  "module6",
  "module7",
  "module8",
  "module9",
  "module10",
  "module11",
  "sandbox",
];

const MODULE_ACCENT: Record<ModuleId, string> = {
  module0: "var(--ok)",
  module1: "var(--ok)",
  module2: "var(--feat)",
  module3: "var(--ok)",
  module4: "var(--head)",
  module5: "var(--ok)",
  module6: "var(--conflict)",
  module7: "var(--head)",
  module8: "var(--feat)",
  module9: "var(--feat)",
  module10: "var(--head)",
  module11: "var(--ok)",
  sandbox: "var(--feat)",
};

const MODULE_LESSONS: Partial<Record<string, LessonGoal>> = {
  module0: LESSON_INIT,
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
  if (command.startsWith("git checkout") && !command.includes("-b"))
    return "checkout";
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

type WelcomeSectionProps = { title: string; children: React.ReactNode };
const WelcomeSection = ({ title, children }: WelcomeSectionProps) => (
  <div
    className="px-4 py-3 flex flex-col gap-1"
    style={{
      borderRadius: "12px",
      background: "var(--panel2)",
      border: "1px solid var(--hair)",
    }}
  >
    <span
      className="font-mono text-[10px] uppercase tracking-widest font-bold"
      style={{ color: "var(--ok)" }}
    >
      {title}
    </span>
    <p className="font-hand text-[13px] text-[var(--soft)] leading-relaxed m-0">
      {children}
    </p>
  </div>
);

export const App = () => {
  const { t } = useTranslation();
  const store = useGitStore();
  const [explainerCommand, setExplainerCommand] = useState<string | null>(null);
  const [highlightNodeIds, setHighlightNodeIds] = useState<string[]>([]);
  const explainerKeyRef = useRef(0);
  const seenCommandTypesRef = useRef(new Set<string>());
  const [pendingModule, setPendingModule] = useState<ModuleId | null>(null);
  const [activeTab, setActiveTab] = useState<"graph" | "history">("graph");
  const [docsOpen, setDocsOpen] = useState(
    () => localStorage.getItem("docsOpen") === "true",
  );
  const [docsPanelWidth, setDocsPanelWidth] = useState(() => {
    const saved = parseInt(localStorage.getItem("docsPanelWidth") ?? "", 10);
    return isNaN(saved) ? 360 : Math.max(240, Math.min(600, saved));
  });
  const isResizingRef = useRef(false);
  const resizeStartXRef = useRef(0);
  const resizeStartWidthRef = useRef(0);

  const [toastModuleId, setToastModuleId] = useState<ModuleId | null>(null);
  const [justUnlockedId, setJustUnlockedId] = useState<ModuleId | null>(null);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem("giteractive_welcomed"),
  );

  const dismissWelcome = () => {
    // localStorage.setItem('giteractive_welcomed', '1');
    setShowWelcome(false);
  };

  const enterModule = (id: ModuleId) => {
    setPendingModule(null);
    if (id === "module0") store.enterModule0();
    else if (id === "module1") store.enterModule1();
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
      const nextId =
        currentIndex >= 0 && currentIndex < MODULE_IDS.length - 1
          ? MODULE_IDS[currentIndex + 1]
          : null;
      if (nextId) {
        setJustUnlockedId(nextId);
        if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = setTimeout(() => setJustUnlockedId(null), 3500);
      }
    }
  }, [store.showCompletionOverlay, store.mode]);

  useEffect(
    () => () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    },
    [],
  );

  const currentLesson = MODULE_LESSONS[store.mode];
  const currentModuleProgress = store.moduleProgress.find(
    (p) => p.id === store.mode,
  );
  const currentComplete = currentModuleProgress?.status === "complete";

  const executeModuleCommand = (cmd: string) => {
    const { branches, commits, HEAD } = store.gitState;

    if (cmd.startsWith("git commit")) {
      store.doAddCommit();
    } else if (cmd === "git checkout -b feature") {
      const headCommit = branches[HEAD] ?? HEAD;
      store.doCreateBranch(headCommit);
    } else if (cmd.startsWith("git checkout") && !cmd.includes("-b")) {
      const target = cmd.split(" ").pop();
      if (target) store.doCheckout(target);
    } else if (cmd.startsWith("git cherry-pick")) {
      const otherBranch = Object.keys(branches).find((b) => b !== HEAD);
      if (otherBranch) {
        const sourceCommit = branches[otherBranch];
        if (sourceCommit) store.doCherryPick(sourceCommit, HEAD);
      }
    } else if (cmd === "git rebase main") {
      const featureBranch =
        Object.keys(branches).find((b) => b !== "main") ?? HEAD;
      store.doRebase(featureBranch, "main");
    } else if (cmd.startsWith("git merge")) {
      const sourceBranch = cmd.split(" ")[2];
      const targetBranch = HEAD !== sourceBranch ? HEAD : "main";
      if (sourceBranch) store.doMerge(sourceBranch, targetBranch);
    } else if (cmd.startsWith("git reset --hard") && !cmd.includes("<")) {
      const target = cmd.split(" ").pop();
      if (target) store.doResetHard(target);
    } else if (cmd === "git stash") {
      store.doStash();
    } else if (cmd === "git stash pop") {
      store.doStashPop();
    } else if (cmd.startsWith("git rebase -i")) {
      const featureBranch =
        Object.keys(branches).find((b) => b !== "main") ?? HEAD;
      const featureTip = branches[featureBranch];
      if (!featureTip) return;
      const mainTip = branches["main"];
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
      if (count > 1) store.doSquash(featureBranch, count, "feat: squashed");
    } else if (cmd === "git reflog") {
      store.setTicker({ command: "git reflog", state: "flash" });
      setTimeout(() => store.setTicker({ command: "", state: "idle" }), 1200);
    } else if (cmd.startsWith("git reset --hard") && cmd.includes("<")) {
      const firstEntry = store.reflog[0];
      if (firstEntry) store.doReflogRecover(firstEntry.hash);
    }
  };

  const toggleLang = () => {
    const next = i18n.language === "en" ? "th" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
  };

  const toggleDocs = () => {
    setDocsOpen((prev) => {
      localStorage.setItem("docsOpen", String(!prev));
      return !prev;
    });
  };

  const onResizeMouseDown = (e: React.MouseEvent) => {
    isResizingRef.current = true;
    resizeStartXRef.current = e.clientX;
    resizeStartWidthRef.current = docsPanelWidth;
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const delta = resizeStartXRef.current - e.clientX;
      const next = Math.max(
        240,
        Math.min(600, resizeStartWidthRef.current + delta),
      );
      setDocsPanelWidth(next);
    };
    const onMouseUp = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      setDocsPanelWidth((w) => {
        localStorage.setItem("docsPanelWidth", String(w));
        return w;
      });
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

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
    <div className="flex h-screen overflow-hidden relative">
      {store.sidebarOpen && (
        <Sidebar
          history={store.history}
          mode={store.mode}
          moduleProgress={store.moduleProgress}
          justUnlockedId={justUnlockedId}
          onEnter={(id) => {
            if (id === store.mode) return;
            if (id === "sandbox") {
              store.unlockSandbox();
              return;
            }
            const progress = store.moduleProgress.find((p) => p.id === id);
            const isFirstVisit = !progress || progress.status === "available";
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
              onClick={() => setActiveTab("graph")}
              style={{
                borderColor:
                  activeTab === "graph" ? "var(--ink)" : "var(--hair)",
                color: activeTab === "graph" ? "var(--ink)" : "var(--muted)",
              }}
            >
              {t("toolbar.tabGraph")}
            </Button>
            <Button
              onClick={() => setActiveTab("history")}
              style={{
                borderColor:
                  activeTab === "history" ? "var(--ink)" : "var(--hair)",
                color: activeTab === "history" ? "var(--ink)" : "var(--muted)",
              }}
            >
              {t("toolbar.tabHistory")}
              {store.history.length > 0 && (
                <span className="ml-1 text-[10px] text-[var(--muted)]">
                  {store.history.length}
                </span>
              )}
            </Button>
            <Button
              onClick={toggleDocs}
              style={{
                borderColor: docsOpen ? "var(--ink)" : "var(--hair)",
                color: docsOpen ? "var(--ink)" : "var(--muted)",
              }}
            >
              Docs
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

        {/* Canvas / History / Docs tab */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {activeTab === "history" && (
            <CommandHistoryTab history={store.history} />
          )}
          <div className={activeTab === "graph" ? "flex-1 relative" : "hidden"}>
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
          commands={deriveCommands(store.mode as ModuleId, store.gitState, store.wip, store.stashStack)}
          onPreview={(cmd) =>
            store.setTicker({ command: cmd, state: cmd ? "ghost" : "idle" })
          }
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

      {/* Right docs panel */}
      {docsOpen && (
        <div
          className="flex-shrink-0 flex border-l border-dashed border-[var(--hair)] relative"
          style={{ width: docsPanelWidth }}
        >
          {/* Drag handle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize z-10 hover:bg-[var(--feat)] opacity-0 hover:opacity-30 transition-opacity"
            onMouseDown={onResizeMouseDown}
          />
          <div className="flex-1 overflow-hidden flex flex-col">
            <div
              className="px-3 py-2 border-b border-dashed border-[var(--hair)] flex items-center justify-between flex-shrink-0"
              style={{ background: "var(--panel)" }}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Docs
              </span>
              <button
                type="button"
                className="font-mono text-[11px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                onClick={toggleDocs}
              >
                ✕
              </button>
            </div>
            <DocsPanel currentModuleId={store.mode} isOpen={docsOpen} />
          </div>
        </div>
      )}

      {toastModuleId && (
        <Toast
          moduleId={toastModuleId}
          accentColor={MODULE_ACCENT[toastModuleId]}
          onDismiss={() => setToastModuleId(null)}
        />
      )}

      {showWelcome && (
        <div
          className="absolute inset-0 flex items-center justify-center z-50"
          style={{
            background: "color-mix(in srgb, var(--bg) 85%, transparent)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="max-w-xl w-full mx-4 flex flex-col gap-6 p-8"
            style={{
              borderRadius: "20px",
              border: "1.5px solid var(--hair)",
              background: "var(--panel)",
            }}
          >
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
                {t('welcome.subtitle')}
              </span>
              <h1 className="font-hand font-bold text-3xl text-[var(--ink)] m-0">
                Giteractive
              </h1>
              <p className="font-hand text-[var(--soft)] text-sm m-0">
                {t('welcome.tagline')}
              </p>
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
              className="self-end font-hand font-bold text-sm px-5 py-2.5 cursor-pointer transition-colors"
              style={{
                borderRadius: "10px",
                background: "var(--ok)",
                color: "#fff",
                border: "none",
              }}
              onClick={dismissWelcome}
            >
              {t('welcome.getStarted')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
