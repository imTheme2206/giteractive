import { useState } from "react";
import {
  addCommit,
  cherryPick,
  checkout,
  createBranch,
  getNextBranchName,
  makeModule3State,
  makeModuleState,
  makeSandboxState,
  rebase,
} from "./gitState";
import { LESSON_LINEAR, LESSON_CHERRY_PICK } from "./lessons";
import type { GitState, Mode, ModuleId, ModuleProgress, ModuleStatus, TickerEntry } from "./types";

const INITIAL_PROGRESS: ModuleProgress[] = [
  { id: 'module1', status: 'available' },
  { id: 'module2', status: 'locked' },
  { id: 'module3', status: 'locked' },
  { id: 'sandbox', status: 'available' },
];

export const useGitStore = () => {
  const [gitState, setGitState] = useState<GitState>(makeSandboxState);
  const [mode, setMode] = useState<Mode>("sandbox");
  const [history, setHistory] = useState<TickerEntry[]>([]);
  const [ticker, setTicker] = useState<{
    command: string;
    state: "idle" | "ghost" | "flash";
  }>({
    command: "",
    state: "idle",
  });
  const [theme, setThemeState] = useState<"light" | "dark">(
    () => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light'
  );

  const setTheme = (updater: 'light' | 'dark' | ((t: 'light' | 'dark') => 'light' | 'dark')) => {
    setThemeState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem('theme', next);
      return next;
    });
  };
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>(INITIAL_PROGRESS);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [moduleAttempts, setModuleAttempts] = useState(0);
  const [moduleGuided, setModuleGuided] = useState(true);

  const logCommand = (command: string) => {
    setTicker({ command, state: "flash" });
    setTimeout(() => {
      setHistory((h) => [
        {
          id: Math.random().toString(36).slice(2, 9),
          command,
          timestamp: Date.now(),
        },
        ...h,
      ]);
      setTicker((t) => ({ ...t, state: "idle" }));
    }, 1200);
  };

  const setModuleStatus = (id: ModuleId, status: ModuleStatus) => {
    setModuleProgress((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const completeModule = (id: ModuleId, nextId?: ModuleId) => {
    setModuleProgress((prev) =>
      prev.map((p) => {
        if (p.id === id) return { ...p, status: 'complete' };
        if (nextId && p.id === nextId && p.status === 'locked') return { ...p, status: 'available' };
        return p;
      })
    );
    setShowCompletionOverlay(true);
  };

  const doAddCommit = () => {
    const result = addCommit(gitState);
    setGitState(result.state);
    logCommand(result.command);

    if (mode === "module1") {
      setModuleAttempts((n) => n + 1);
      if (LESSON_LINEAR.validate(result.state)) completeModule('module1', 'module2');
    }

    if (mode === "module2") {
      const newState = result.state;
      const headBranch = newState.HEAD;
      if (headBranch !== "main" && newState.branches[headBranch]) {
        const tipId = newState.branches[headBranch];
        const tipCommit = newState.commits[tipId];
        if (tipCommit?.branch && tipCommit.branch !== "main") {
          completeModule('module2', 'module3');
        }
      }
    }
  };

  const doCherryPick = (sourceId: string, targetBranch: string) => {
    const result = cherryPick(gitState, sourceId, targetBranch);
    if (!result) return;
    setGitState(result.state);
    logCommand(result.command);

    if (mode === "module3") {
      setModuleAttempts((n) => n + 1);
      if (LESSON_CHERRY_PICK.validate(result.state)) completeModule('module3');
    }
  };

  const doCheckout = (target: string) => {
    const result = checkout(gitState, target);
    if (!result) return;
    setGitState(result.state);
    logCommand(result.command);
  };

  const doRebase = (branchToRebase: string, ontoBranch: string) => {
    const result = rebase(gitState, branchToRebase, ontoBranch);
    if (!result) return;
    setGitState(result.state);
    logCommand(result.command);
  };

  const doCreateBranch = (commitId: string) => {
    const branchName = getNextBranchName(Object.keys(gitState.branches));
    const result = createBranch(gitState, commitId, branchName);
    setGitState(result.state);
    logCommand(result.command);

    if (mode === "module2") {
      setModuleAttempts((n) => n + 1);
    }
  };

  const doReset = () => {
    if (mode === "sandbox") {
      setGitState(makeSandboxState());
    } else if (mode === "module3") {
      setGitState(makeModule3State());
      setModuleStatus('module3', 'in_progress');
    } else {
      setGitState(makeModuleState());
      if (mode === "module1") setModuleStatus('module1', 'in_progress');
      if (mode === "module2") setModuleStatus('module2', 'in_progress');
    }
    setShowCompletionOverlay(false);
    setModuleAttempts(0);
    setHistory([]);
    setTicker({ command: "", state: "idle" });
  };

  const enterModule1 = () => {
    setMode("module1");
    setGitState(makeModuleState());
    setHistory([]);
    setTicker({ command: "", state: "idle" });
    setShowCompletionOverlay(false);
    setModuleAttempts(0);
    setModuleGuided(true);
    setModuleProgress((prev) =>
      prev.map((p) =>
        p.id === 'module1' && p.status === 'available' ? { ...p, status: 'in_progress' } : p
      )
    );
  };

  const enterModule2 = () => {
    setMode("module2");
    setGitState(makeModuleState());
    setHistory([]);
    setTicker({ command: "", state: "idle" });
    setShowCompletionOverlay(false);
    setModuleAttempts(0);
    setModuleGuided(true);
    setModuleProgress((prev) =>
      prev.map((p) =>
        p.id === 'module2' && p.status === 'available' ? { ...p, status: 'in_progress' } : p
      )
    );
  };

  const enterModule3 = () => {
    setMode("module3");
    setGitState(makeModule3State());
    setHistory([]);
    setTicker({ command: "", state: "idle" });
    setShowCompletionOverlay(false);
    setModuleAttempts(0);
    setModuleGuided(true);
    setModuleProgress((prev) =>
      prev.map((p) =>
        p.id === 'module3' && p.status === 'available' ? { ...p, status: 'in_progress' } : p
      )
    );
  };

  const unlockSandbox = () => {
    setShowCompletionOverlay(false);
    setMode("sandbox");
    setGitState((prev) => {
      if (prev.branches["feature"]) return { ...prev, HEAD: "main" };
      return {
        ...prev,
        commits: {
          ...prev.commits,
          fb1: {
            id: "fb1",
            parentIds: [prev.branches["main"] ?? "c3"],
            message: "feat: feature branch start",
            branch: "feature",
          },
        },
        branches: { ...prev.branches, feature: "fb1" },
        HEAD: "main",
      };
    });
  };

  return {
    gitState,
    mode,
    setMode,
    history,
    ticker,
    setTicker,
    theme,
    setTheme,
    sidebarOpen,
    setSidebarOpen,
    moduleProgress,
    showCompletionOverlay,
    moduleAttempts,
    moduleGuided,
    setModuleGuided,
    doAddCommit,
    doCherryPick,
    doRebase,
    doCheckout,
    doCreateBranch,
    doReset,
    enterModule1,
    enterModule2,
    enterModule3,
    unlockSandbox,
  };
}
