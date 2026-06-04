import { useState } from "react";
import { CommandHistoryTab } from "./components/command-history/CommandHistoryTab";
import { CommandPanel } from "./components/command-panel/CommandPanel";
import { CommandTicker } from "./components/CommandTicker";
import { Toast } from "./components/common/Toast";
import { DocsPanel } from "./components/docs/DocsPanel";
import { ExplainerCard } from "./components/ExplainerCard";
import { GitCanvas } from "./components/GitCanvas";
import { GoalCard } from "./components/GoalCard";
import { ConflictModal } from "./components/modal/ConflictModal";
import { IntroModal } from "./components/modal/IntroModal";
import { ReflogPanel } from "./components/ReflogPanel";
import { Sidebar } from "./components/sidebar/Sidebar";
import { SidebarPanel } from "./components/sidebar/SidebarPanel";
import { Toolbar } from "./components/toolbar/Toolbar";
import { WelcomeOverlay } from "./components/WelcomeOverlay";
import { useDocsPanelResize } from "./hooks/useDocsPanelResize";
import { useExplainerCommand } from "./hooks/useExplainerCommand";
import { useModuleCompletion } from "./hooks/useModuleCompletion";
import { useUIPreferences } from "./hooks/useUIPreferences";
import { MODULE_ACCENT } from "./moduleConfig";
import { MODULE_REGISTRY } from "./moduleRegistry";
import type { ModuleId } from "./types";
import { useGitStore } from "./useGitStore";
import { deriveCommands } from "./utils/deriveCommands";

export const App = () => {
  const store = useGitStore();
  const { sidebarOpen, setSidebarOpen } = useUIPreferences();
  const [highlightNodeIds, setHighlightNodeIds] = useState<string[]>([]);
  const [pendingModule, setPendingModule] = useState<ModuleId | null>(null);
  const [activeTab, setActiveTab] = useState<"graph" | "history">("graph");

  const { docsOpen, docsPanelWidth, toggleDocs, onResizeMouseDown } =
    useDocsPanelResize();
  const { explainerCommand, explainerKey, dismissExplainer } =
    useExplainerCommand(store.ticker);
  const { toastModuleId, justUnlockedId, dismissToast } = useModuleCompletion(
    store.showCompletionOverlay,
    store.mode,
  );

  const currentLesson = MODULE_REGISTRY[store.mode]?.lesson;
  const currentComplete =
    store.moduleProgress.find((p) => p.id === store.mode)?.status ===
    "complete";

  const enterModule = (id: ModuleId) => {
    setPendingModule(null);
    store.enterModule(id);
  };

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

  return (
    <div className="flex h-screen overflow-hidden relative">
      {sidebarOpen && (
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
        <Toolbar
          mode={store.mode}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          docsOpen={docsOpen}
          onToggleDocs={toggleDocs}
          wip={store.wip}
          stashStack={store.stashStack}
          onStash={store.doStash}
          onStashPop={store.doStashPop}
          onReset={store.doReset}
          historyCount={store.history.length}
        />

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

            {currentLesson && !currentComplete && (
              <GoalCard
                lesson={currentLesson}
                attempts={store.moduleAttempts}
                guided={store.moduleGuided}
                onToggleGuided={store.setModuleGuided}
              />
            )}

            <ReflogPanel
              visible={store.mode === "module11"}
              reflog={store.reflog}
              onRecover={store.doReflogRecover}
              currentCommits={new Set(Object.keys(store.gitState.commits))}
            />

            {store.conflictFlash && (
              <div
                className="absolute inset-0 pointer-events-none z-40"
                style={{
                  background:
                    "color-mix(in srgb, var(--conflict) 35%, transparent)",
                }}
              />
            )}

            {store.conflictState && (
              <ConflictModal
                conflict={store.conflictState}
                onResolve={store.resolveConflict}
              />
            )}

            {explainerCommand && (
              <ExplainerCard
                key={explainerKey}
                command={explainerCommand}
                onDismiss={dismissExplainer}
              />
            )}

            {pendingModule && pendingModule !== "sandbox" && (
              <IntroModal
                moduleId={pendingModule}
                onStart={() => enterModule(pendingModule)}
                onSkip={() => enterModule(pendingModule)}
              />
            )}
          </div>
        </div>

        <CommandPanel
          mode={store.mode as ModuleId}
          commands={deriveCommands(
            store.mode as ModuleId,
            store.gitState,
            store.wip,
            store.stashStack,
          )}
          onPreview={(cmd) =>
            store.setTicker({ command: cmd, state: cmd ? "ghost" : "idle" })
          }
          onExecute={executeModuleCommand}
        />

        <CommandTicker
          ticker={store.ticker}
          history={store.history}
          gitState={store.gitState}
          onTokenHover={setHighlightNodeIds}
        />
      </div>

      {docsOpen && (
        <SidebarPanel
          alignment="right"
          resizable
          closeable
          title="Docs"
          width={docsPanelWidth}
          onClose={toggleDocs}
          onResizeMouseDown={onResizeMouseDown}
        >
          <DocsPanel currentModuleId={store.mode} isOpen={docsOpen} />
        </SidebarPanel>
      )}

      {toastModuleId && (
        <Toast
          moduleId={toastModuleId}
          accentColor={MODULE_ACCENT[toastModuleId]}
          onDismiss={dismissToast}
        />
      )}

      <WelcomeOverlay />
    </div>
  );
};
