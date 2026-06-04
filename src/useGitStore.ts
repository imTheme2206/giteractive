import { useState } from "react";
import {
  addCommit,
  cherryPick,
  checkout,
  createBranch,
  getNextBranchName,
  makeModule0State,
  makeSandboxState,
  merge,
  rebase,
  resetHard,
  squashCommits,
} from "./gitState";
import { useModuleProgression } from "./hooks/useModuleProgression";
import { MODULE_REGISTRY } from './moduleRegistry';
import type { CompletionTrigger } from './moduleRegistry';
import type {
  CommitNode,
  ConflictState,
  GitState,
  Mode,
  ModuleId,
  ReflogEntry,
  TickerEntry,
} from "./types";

export const useGitStore = () => {
  const isFirstVisit = !localStorage.getItem("giteractive_welcomed");

  // git graph state
  const [gitState, setGitState] = useState<GitState>(() =>
    isFirstVisit ? makeModule0State() : makeSandboxState(),
  );
  const [mode, setMode] = useState<Mode>(
    isFirstVisit ? "module0" : "sandbox",
  );
  const [history, setHistory] = useState<TickerEntry[]>([]);
  const [ticker, setTicker] = useState<{
    command: string;
    subtitle?: string;
    state: "idle" | "ghost" | "flash";
  }>({
    command: isFirstVisit ? "git init" : "",
    state: isFirstVisit ? "flash" : "idle",
  });
  const [conflictState, setConflictState] = useState<ConflictState | null>(
    null,
  );
  const [conflictFlash, setConflictFlash] = useState(false);
  const [pendingConflictMerge, setPendingConflictMerge] = useState<{
    sourceBranch: string;
    targetBranch: string;
  } | null>(null);
  const [wip, setWip] = useState<string | null>(null);
  const [stashStack, setStashStack] = useState<
    Array<{ message: string; fromBranch: string }>
  >([]);
  const [hasDetached, setHasDetached] = useState(false);
  const [reflog, setReflog] = useState<ReflogEntry[]>([]);
  const [shadowCommits, setShadowCommits] = useState<
    Record<string, CommitNode>
  >({});

  const [devMode, setDevMode] = useState(false);
  const {
    moduleProgress,
    setModuleProgress,
    showCompletionOverlay,
    setShowCompletionOverlay,
    moduleAttempts,
    setModuleAttempts,
    moduleGuided,
    setModuleGuided,
    completeModule,
    setModuleStatus,
  } = useModuleProgression();

  const unlockAll = () => {
    setModuleProgress((prev) =>
      prev.map((p) => (p.status === "locked" ? { ...p, status: "available" } : p)),
    );
    setDevMode(true);
  };

  const checkCompletion = (trigger: CompletionTrigger, state: GitState) => {
    const def = MODULE_REGISTRY[mode];
    if (def?.completionTrigger !== trigger) return;
    setModuleAttempts((n) => n + 1);
    const validator = def.validate ?? def.lesson?.validate;
    if (validator?.(state)) completeModule(mode, def.next);
  };

  const logCommand = (
    command: string,
    stateBefore?: GitState,
    stateAfter?: GitState,
  ) => {
    setTicker({ command, state: "flash" });
    setTimeout(() => {
      setHistory((h) => [
        {
          id: Math.random().toString(36).slice(2, 9),
          command,
          timestamp: Date.now(),
          stateBefore,
          stateAfter,
        },
        ...h,
      ]);
      setTicker((t) => ({ ...t, state: "idle" }));
    }, 1200);
  };

  const doStartWip = () => {
    setWip(`feat: new commit ${gitState.nextCommitNum}`);
  };

  const doAddCommit = () => {
    const message = wip ?? `feat: new commit ${gitState.nextCommitNum}`;
    const stateBefore = gitState;
    const result = addCommit(gitState, message);
    const stateAfter = result.state;
    const branch = gitState.HEAD;
    setWip(null);
    setGitState(stateAfter);
    setTicker({ command: result.command, state: "flash" });
    setTimeout(() => {
      const now = Date.now();
      setHistory((h) => [
        {
          id: Math.random().toString(36).slice(2, 9),
          command: `git push origin ${branch}`,
          timestamp: now + 2,
          stateBefore: stateAfter,
          stateAfter,
        },
        {
          id: Math.random().toString(36).slice(2, 9),
          command: result.command,
          timestamp: now + 1,
          stateBefore,
          stateAfter,
        },
        {
          id: Math.random().toString(36).slice(2, 9),
          command: "git add .",
          timestamp: now,
          stateBefore,
          stateAfter: stateBefore,
        },
        ...h,
      ]);
      setTicker((t) => ({ ...t, state: "idle" }));
    }, 1200);

    checkCompletion('addCommit', result.state);
  };

  const doCherryPick = (sourceId: string, targetBranch: string) => {
    const stateBefore = gitState;
    const result = cherryPick(gitState, sourceId, targetBranch);
    if (!result) return;
    setGitState(result.state);
    logCommand(result.command, stateBefore, result.state);

    checkCompletion('cherryPick', result.state);
  };

  const doRebase = (branchToRebase: string, ontoBranch: string) => {
    const stateBefore = gitState;
    const result = rebase(gitState, branchToRebase, ontoBranch);
    if (!result) return;
    setGitState(result.state);
    logCommand(result.command, stateBefore, result.state);

    checkCompletion('rebase', result.state);
  };

  const doMerge = (sourceBranch: string, targetBranch: string) => {
    if (mode === "module6") {
      setConflictFlash(true);
      setPendingConflictMerge({ sourceBranch, targetBranch });
      setTimeout(() => {
        setConflictFlash(false);
        setConflictState({ sourceBranch, targetBranch });
      }, 600);
      return;
    }

    const stateBefore = gitState;
    const result = merge(gitState, sourceBranch, targetBranch);
    if (!result) return;
    setGitState(result.state);
    logCommand(result.command, stateBefore, result.state);

    checkCompletion('merge', result.state);
  };

  const resolveConflict = (resolution: "ours" | "theirs" | "both") => {
    if (!pendingConflictMerge) return;
    const { sourceBranch, targetBranch } = pendingConflictMerge;
    const result = merge(gitState, sourceBranch, targetBranch);
    if (!result) return;
    const resolvedMsg = `Merge branch '${sourceBranch}' into ${targetBranch} [resolved: ${resolution}]`;
    const [mergeId, mergeCommit] =
      Object.entries(result.state.commits).find(
        ([id]) => !gitState.commits[id],
      ) ?? [];
    if (!mergeId || !mergeCommit) return;
    const finalState = {
      ...result.state,
      commits: {
        ...result.state.commits,
        [mergeId]: { ...mergeCommit, message: resolvedMsg },
      },
    };
    setGitState(finalState);
    logCommand(
      `git merge ${sourceBranch} # conflict resolved (${resolution})`,
      gitState,
      finalState,
    );
    setConflictState(null);
    setPendingConflictMerge(null);

    checkCompletion('resolveConflict', finalState);
  };

  const doCheckout = (target: string) => {
    if (wip && mode === "module8") {
      setTicker({
        command: "⚠  Stash your work first: git stash",
        state: "flash",
      });
      return;
    }
    const result = checkout(gitState, target);
    if (!result) return;

    if (mode === "module10") {
      const isDetaching = !gitState.branches[target];
      if (isDetaching) {
        setHasDetached(true);
      }

      if (hasDetached && target === "main") {
        setGitState(result.state);
        logCommand(result.command, gitState, result.state);
        checkCompletion('checkout', result.state);
        return;
      }
    }

    setGitState(result.state);
    logCommand(result.command, gitState, result.state);
  };

  const doResetHard = (targetId: string) => {
    if (mode === "module11") {
      setReflog((prev) => [
        {
          hash: targetId,
          message: `reset: moving to ${targetId}`,
          headRef: "main",
        },
        ...prev,
      ]);
    }

    const stateBefore = gitState;
    const result = resetHard(gitState, targetId);
    if (!result) return;
    setGitState(result.state);
    logCommand(result.command, stateBefore, result.state);

    checkCompletion('resetHard', result.state);
  };

  const doStash = () => {
    if (!wip) return;
    const stateBefore = gitState;
    setStashStack((s) => [
      { message: wip, fromBranch: gitState.HEAD },
      ...s,
    ]);
    setWip(null);
    logCommand("git stash", stateBefore, stateBefore);
  };

  const doStashPop = () => {
    if (stashStack.length === 0) return;
    const [top, ...rest] = stashStack;
    if (!top) return;
    const stateBefore = gitState;
    setWip(top.message);
    setStashStack(rest);
    logCommand("git stash pop", stateBefore, stateBefore);

    if (mode === "module8") {
      setModuleAttempts((n) => n + 1);
      if (gitState.branches["main"] !== "c3") completeModule("module8", "module9");
    }
  };

  const doSquash = (
    branchName: string,
    count: number,
    message: string,
  ) => {
    const stateBefore = gitState;
    const result = squashCommits(gitState, branchName, count, message);
    if (!result) return;
    setGitState(result.state);
    logCommand(result.command, stateBefore, result.state);

    checkCompletion('squash', result.state);
  };

  const doReflogRecover = (hash: string) => {
    const targetCommit = shadowCommits[hash];
    if (!targetCommit) return;

    const reachableCommits: Record<string, CommitNode> = {};
    const walk = (id: string) => {
      if (reachableCommits[id]) return;
      const commit = shadowCommits[id];
      if (!commit) return;
      reachableCommits[id] = commit;
      commit.parentIds.forEach(walk);
    };
    walk(hash);

    const stateBefore = gitState;
    setGitState((prev) => ({
      ...prev,
      commits: reachableCommits,
      branches: { ...prev.branches, main: hash },
    }));

    const newState = {
      ...gitState,
      commits: reachableCommits,
      branches: { ...gitState.branches, main: hash },
    };

    logCommand(`git reset --hard ${hash}`, stateBefore, newState);

    checkCompletion('reflogRecover', newState);
  };

  const doCreateBranch = (commitId: string) => {
    const stateBefore = gitState;
    const branchName = getNextBranchName(Object.keys(gitState.branches));
    const result = createBranch(gitState, commitId, branchName);
    setGitState(result.state);
    logCommand(result.command, stateBefore, result.state);

    if (mode === "module2") setModuleAttempts((n) => n + 1);
  };

  const doReset = () => {
    const def = MODULE_REGISTRY[mode];
    setGitState(def.makeState());
    if (mode !== 'sandbox' && mode !== 'module0') setModuleStatus(mode, 'in_progress');
    setShowCompletionOverlay(false);
    setModuleAttempts(0);
    setHistory([]);
    setTicker({ command: '', state: 'idle' });
    setConflictState(null);
    setPendingConflictMerge(null);
    setConflictFlash(false);
    setWip(def.initialWip ?? null);
    setStashStack([]);
    setHasDetached(false);
    setShadowCommits(def.getShadowCommits?.() ?? {});
    setReflog(def.getInitialReflog?.() ?? []);
  };

  const enterModule = (id: ModuleId) => {
    const def = MODULE_REGISTRY[id];
    setMode(id);
    setGitState(def.makeState());
    setHistory([]);
    setTicker({ command: '', state: 'idle' });
    setShowCompletionOverlay(false);
    setModuleAttempts(0);
    setModuleGuided(true);
    setConflictState(null);
    setPendingConflictMerge(null);
    setConflictFlash(false);
    setWip(def.initialWip ?? null);
    setStashStack([]);
    setHasDetached(false);
    setShadowCommits(def.getShadowCommits?.() ?? {});
    setReflog(def.getInitialReflog?.() ?? []);
    setModuleProgress((prev) =>
      prev.map((p) =>
        p.id === id && p.status === 'available' ? { ...p, status: 'in_progress' } : p,
      ),
    );
    if (id === 'module0') {
      setTicker({ command: 'git init', state: 'flash' });
      setTimeout(() => setTicker({ command: 'git init', state: 'idle' }), 1400);
    }
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
    moduleProgress,
    showCompletionOverlay,
    moduleAttempts,
    moduleGuided,
    setModuleGuided,
    doAddCommit,
    doCherryPick,
    doRebase,
    doMerge,
    doCheckout,
    doCreateBranch,
    doReset,
    enterModule,
    unlockSandbox,
    conflictState,
    conflictFlash,
    resolveConflict,
    wip,
    stashStack,
    doStartWip,
    doResetHard,
    doStash,
    doStashPop,
    doSquash,
    devMode,
    unlockAll,
    reflog,
    shadowCommits,
    doReflogRecover,
  };
};
