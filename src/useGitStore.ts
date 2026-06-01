import { useState } from "react";
import {
  addCommit,
  cherryPick,
  createBranch,
  getNextBranchName,
  makeModule3State,
  makeModuleState,
  makeSandboxState,
  rebase,
} from "./gitState";
import { LESSON_CHERRY_PICK } from "./lessons";
import type { GitState, Mode, TickerEntry } from "./types";

export function useGitStore() {
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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [module1Complete, setModule1Complete] = useState(false);
  const [module2Complete, setModule2Complete] = useState(false);
  const [module3Complete, setModule3Complete] = useState(false);
  const [module3Attempts, setModule3Attempts] = useState(0);
  const [module3Guided, setModule3Guided] = useState(true);

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

  const doAddCommit = () => {
    const result = addCommit(gitState);
    setGitState(result.state);
    logCommand(result.command);

    if (mode === "module1" && result.state.nextCommitNum >= 7) {
      setModule1Complete(true);
    }

    if (mode === "module2") {
      const newState = result.state;
      const headBranch = newState.HEAD;
      if (headBranch !== "main" && newState.branches[headBranch]) {
        const tipId = newState.branches[headBranch];
        const tipCommit = newState.commits[tipId];
        if (tipCommit?.branch && tipCommit.branch !== "main") {
          setModule2Complete(true);
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
      setModule3Attempts((n) => n + 1);
      if (LESSON_CHERRY_PICK.validate(result.state)) {
        setModule3Complete(true);
      }
    }
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
  };

const doReset = () => {
    if (mode === "sandbox") {
      setGitState(makeSandboxState());
    } else if (mode === "module3") {
      setGitState(makeModule3State());
      setModule3Complete(false);
      setModule3Attempts(0);
    } else {
      setGitState(makeModuleState());
      if (mode === "module1") setModule1Complete(false);
      if (mode === "module2") setModule2Complete(false);
    }
    setHistory([]);
    setTicker({ command: "", state: "idle" });
  };

  const enterModule1 = () => {
    setMode("module1");
    setGitState(makeModuleState());
    setHistory([]);
    setTicker({ command: "", state: "idle" });
    setModule1Complete(false);
  };

  const enterModule2 = () => {
    setMode("module2");
    setGitState(makeModuleState());
    setHistory([]);
    setTicker({ command: "", state: "idle" });
    setModule2Complete(false);
  };

  const enterModule3 = () => {
    setMode("module3");
    setGitState(makeModule3State());
    setHistory([]);
    setTicker({ command: "", state: "idle" });
    setModule3Complete(false);
    setModule3Attempts(0);
    setModule3Guided(true);
  };

  const unlockSandbox = () => {
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
    module1Complete,
    module2Complete,
    module3Complete,
    module3Attempts,
    module3Guided,
    setModule3Guided,
    doAddCommit,
    doCherryPick,
    doRebase,
    doCreateBranch,
    doReset,
    enterModule1,
    enterModule2,
    enterModule3,
    unlockSandbox,
  };
}
