import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CommandTicker } from "./components/CommandTicker";
import { Button } from "./components/common/Button";
import { ExplainerCard } from "./components/ExplainerCard";
import { GitCanvas } from "./components/GitCanvas";
import { GoalCard } from "./components/GoalCard";
import { ReflogPanel } from "./components/ReflogPanel";
import { ConflictModal } from "./components/modal/ConflictModal";
import { IntroModal } from "./components/modal/IntroModal";
import { ModuleCompleteModal } from "./components/modal/ModuleCompleteModal";
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

  const currentLesson = MODULE_LESSONS[store.mode];
  const currentModuleProgress = store.moduleProgress.find(
    (p) => p.id === store.mode,
  );
  const currentComplete = currentModuleProgress?.status === "complete";

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
          <span className="font-mono text-xs text-[var(--muted)] flex-1">
            {t(`modules.${store.mode}`, store.mode)}
          </span>
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

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
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

          {/* Completion overlays */}
          {store.showCompletionOverlay && store.mode === "module1" && (
            <ModuleCompleteModal
              icon="🎉"
              title={t("completion.module1.title")}
              body={
                <p className="text-sm text-[var(--soft)] leading-relaxed m-0 font-hand">
                  {t("completion.module1.body")}
                </p>
              }
              buttonLabel={t("completion.module1.button")}
              onAction={store.enterModule2}
            />
          )}
          {store.showCompletionOverlay && store.mode === "module2" && (
            <ModuleCompleteModal
              icon="⎇"
              title={t("completion.module2.title")}
              accentColor="var(--feat)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-2 font-hand">
                    {t("completion.module2.body1")}
                  </p>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 font-hand">
                    {t("completion.module2.body2")}
                  </p>
                </>
              }
              buttonLabel={t("completion.module2.button")}
              onAction={store.enterModule3}
            />
          )}
          {store.showCompletionOverlay && store.mode === "module3" && (
            <ModuleCompleteModal
              icon="✓"
              title={t("completion.module3.title")}
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1 font-hand">
                    {t("completion.module3.body")}
                  </p>
                  <p
                    className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono"
                    style={{ fontSize: 11 }}
                  >
                    {t("completion.attempts", { count: store.moduleAttempts })}
                  </p>
                </>
              }
              buttonLabel={t("completion.module3.button")}
              onAction={store.enterModule4}
            />
          )}
          {store.showCompletionOverlay && store.mode === "module4" && (
            <ModuleCompleteModal
              icon="⟳"
              title={t("completion.module4.title")}
              accentColor="var(--head)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1 font-hand">
                    {t("completion.module4.body")}
                  </p>
                  <p
                    className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono"
                    style={{ fontSize: 11 }}
                  >
                    {t("completion.attempts", { count: store.moduleAttempts })}
                  </p>
                </>
              }
              buttonLabel={t("completion.module4.button")}
              onAction={store.enterModule5}
            />
          )}
          {store.showCompletionOverlay && store.mode === "module5" && (
            <ModuleCompleteModal
              icon="⊕"
              title={t("completion.module5.title")}
              accentColor="var(--ok)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1 font-hand">
                    {t("completion.module5.body")}
                  </p>
                  <p
                    className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono"
                    style={{ fontSize: 11 }}
                  >
                    {t("completion.attempts", { count: store.moduleAttempts })}
                  </p>
                </>
              }
              buttonLabel={t("completion.module5.button")}
              onAction={store.enterModule6}
            />
          )}
          {store.showCompletionOverlay && store.mode === "module6" && (
            <ModuleCompleteModal
              icon="⚡"
              title={t("completion.module6.title")}
              accentColor="var(--conflict)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1 font-hand">
                    {t("completion.module6.body")}
                  </p>
                  <p
                    className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono"
                    style={{ fontSize: 11 }}
                  >
                    {t("completion.attempts", { count: store.moduleAttempts })}
                  </p>
                </>
              }
              buttonLabel={t("completion.module6.button")}
              onAction={store.enterModule7}
            />
          )}
          {store.showCompletionOverlay && store.mode === "module7" && (
            <ModuleCompleteModal
              icon="↺"
              title={t("completion.module7.title")}
              accentColor="var(--head)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1 font-hand">
                    {t("completion.module7.body")}
                  </p>
                  <p
                    className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono"
                    style={{ fontSize: 11 }}
                  >
                    {t("completion.attempts", { count: store.moduleAttempts })}
                  </p>
                </>
              }
              buttonLabel={t("completion.module7.button")}
              onAction={store.enterModule8}
            />
          )}
          {store.showCompletionOverlay && store.mode === "module8" && (
            <ModuleCompleteModal
              icon="⬇"
              title={t("completion.module8.title")}
              accentColor="var(--feat)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1 font-hand">
                    {t("completion.module8.body")}
                  </p>
                  <p
                    className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono"
                    style={{ fontSize: 11 }}
                  >
                    {t("completion.attempts", { count: store.moduleAttempts })}
                  </p>
                </>
              }
              buttonLabel={t("completion.module8.button")}
              onAction={store.enterModule9}
            />
          )}
          {store.showCompletionOverlay && store.mode === "module9" && (
            <ModuleCompleteModal
              icon="⊕"
              title={t("completion.module9.title")}
              accentColor="var(--feat)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1 font-hand">
                    {t("completion.module9.body")}
                  </p>
                  <p
                    className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono"
                    style={{ fontSize: 11 }}
                  >
                    {t("completion.attempts", { count: store.moduleAttempts })}
                  </p>
                </>
              }
              buttonLabel={t("completion.module9.button")}
              onAction={store.enterModule10}
            />
          )}

          {/* Reflog panel for module11 */}
          <ReflogPanel
            visible={store.mode === "module11"}
            reflog={store.reflog}
            onRecover={store.doReflogRecover}
            currentCommits={new Set(Object.keys(store.gitState.commits))}
          />

          {store.showCompletionOverlay && store.mode === "module10" && (
            <ModuleCompleteModal
              icon="↩"
              title={t("completion.module10.title")}
              accentColor="var(--head)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1 font-hand">
                    {t("completion.module10.body")}
                  </p>
                  <p
                    className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono"
                    style={{ fontSize: 11 }}
                  >
                    {t("completion.attempts", { count: store.moduleAttempts })}
                  </p>
                </>
              }
              buttonLabel={t("completion.module10.button")}
              onAction={store.enterModule11}
            />
          )}
          {store.showCompletionOverlay && store.mode === "module11" && (
            <ModuleCompleteModal
              icon="⏎"
              title={t("completion.module11.title")}
              accentColor="var(--ok)"
              body={
                <>
                  <p className="text-sm text-[var(--soft)] leading-relaxed m-0 mb-1 font-hand">
                    {t("completion.module11.body")}
                  </p>
                  <p
                    className="text-sm text-[var(--muted)] leading-relaxed m-0 font-mono"
                    style={{ fontSize: 11 }}
                  >
                    {t("completion.attempts", { count: store.moduleAttempts })}
                  </p>
                </>
              }
              buttonLabel={t("completion.module11.button")}
              onAction={store.unlockSandbox}
            />
          )}

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

        {/* Ticker */}
        <CommandTicker
          ticker={store.ticker}
          history={store.history}
          gitState={store.gitState}
          onTokenHover={setHighlightNodeIds}
        />
      </div>
    </div>
  );
};
