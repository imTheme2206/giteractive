import { useEffect, useState } from "react";
import {
  addCommit,
  cherryPick,
  checkout,
  createBranch,
  getNextBranchName,
  makeModule0State,
  makeModule3State,
  makeModule4State,
  makeModule5State,
  makeModule6State,
  makeModule7State,
  makeModule8State,
  makeModule9State,
  makeModule10State,
  makeModule11State,
  makeModule11ShadowCommits,
  makeModuleState,
  makeSandboxState,
  merge,
  rebase,
  resetHard,
  squashCommits,
} from "./gitState";
import { LESSON_BRANCH, LESSON_CHERRY_PICK, LESSON_CONFLICT, LESSON_DETACHED_HEAD, LESSON_INIT, LESSON_LINEAR, LESSON_MERGE, LESSON_REBASE, LESSON_REFLOG, LESSON_RESET, LESSON_SQUASH, LESSON_STASH } from "./lessons";
import type { CommitNode, ConflictState, GitState, Mode, ModuleId, ModuleProgress, ModuleStatus, ReflogEntry, TickerEntry } from "./types";

const INITIAL_PROGRESS: ModuleProgress[] = [
  { id: 'module0', status: 'available' },
  { id: 'module1', status: 'locked' },
  { id: 'module2', status: 'locked' },
  { id: 'module3', status: 'locked' },
  { id: 'module4', status: 'locked' },
  { id: 'module5', status: 'locked' },
  { id: 'module6', status: 'locked' },
  { id: 'module7', status: 'locked' },
  { id: 'module8', status: 'locked' },
  { id: 'module9', status: 'locked' },
  { id: 'module10', status: 'locked' },
  { id: 'module11', status: 'locked' },
  { id: 'sandbox', status: 'available' },
];

const loadProgress = (): ModuleProgress[] => {
  try {
    const saved = localStorage.getItem('giteractive_progress');
    if (saved) return JSON.parse(saved) as ModuleProgress[];
  } catch {}
  return INITIAL_PROGRESS;
};

export const useGitStore = () => {
  const [gitState, setGitState] = useState<GitState>(makeSandboxState);
  const [mode, setMode] = useState<Mode>("sandbox");
  const [history, setHistory] = useState<TickerEntry[]>([]);
  const [ticker, setTicker] = useState<{ command: string; subtitle?: string; state: "idle" | "ghost" | "flash" }>({
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
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>(loadProgress);
  useEffect(() => {
    localStorage.setItem('giteractive_progress', JSON.stringify(moduleProgress));
  }, [moduleProgress]);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [moduleAttempts, setModuleAttempts] = useState(0);
  const [moduleGuided, setModuleGuided] = useState(true);
  const [conflictState, setConflictState] = useState<ConflictState | null>(null);
  const [conflictFlash, setConflictFlash] = useState(false);
  const [pendingConflictMerge, setPendingConflictMerge] = useState<{ sourceBranch: string; targetBranch: string } | null>(null);
  const [wip, setWip] = useState<string | null>(null);
  const [stashStack, setStashStack] = useState<Array<{ message: string; fromBranch: string }>>([]);
  const [devMode, setDevMode] = useState(false);
  const [hasDetached, setHasDetached] = useState(false);
  const [reflog, setReflog] = useState<ReflogEntry[]>([]);
  const [shadowCommits, setShadowCommits] = useState<Record<string, CommitNode>>({});

  const unlockAll = () => {
    setModuleProgress(prev => prev.map(p => p.status === 'locked' ? { ...p, status: 'available' } : p));
    setDevMode(true);
  };

  const logCommand = (command: string, stateBefore?: GitState, stateAfter?: GitState) => {
    setTicker({ command, state: "flash" });
    setTimeout(() => {
      setHistory(h => [
        { id: Math.random().toString(36).slice(2, 9), command, timestamp: Date.now(), stateBefore, stateAfter },
        ...h,
      ]);
      setTicker(t => ({ ...t, state: "idle" }));
    }, 1200);
  };

  const setModuleStatus = (id: ModuleId, status: ModuleStatus) => {
    setModuleProgress(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
  };

  const completeModule = (id: ModuleId, nextId?: ModuleId) => {
    setModuleProgress(prev =>
      prev.map(p => {
        if (p.id === id) return { ...p, status: 'complete' };
        if (nextId && p.id === nextId && p.status === 'locked') return { ...p, status: 'available' };
        return p;
      })
    );
    setShowCompletionOverlay(true);
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
      setHistory(h => [
        { id: Math.random().toString(36).slice(2, 9), command: `git push origin ${branch}`, timestamp: now + 2, stateBefore: stateAfter, stateAfter },
        { id: Math.random().toString(36).slice(2, 9), command: result.command, timestamp: now + 1, stateBefore, stateAfter },
        { id: Math.random().toString(36).slice(2, 9), command: 'git add .', timestamp: now, stateBefore, stateAfter: stateBefore },
        ...h,
      ]);
      setTicker(t => ({ ...t, state: "idle" }));
    }, 1200);

    if (mode === "module0") {
      setModuleAttempts(n => n + 1);
      if (LESSON_INIT.validate(result.state)) completeModule('module0', 'module1');
    }

    if (mode === "module1") {
      setModuleAttempts(n => n + 1);
      if (LESSON_LINEAR.validate(result.state)) completeModule('module1', 'module2');
    }

    if (mode === "module2") {
      const { HEAD, branches, commits } = result.state;
      if (HEAD !== "main" && branches[HEAD]) {
        const tip = commits[branches[HEAD]];
        if (tip?.branch && tip.branch !== "main") completeModule('module2', 'module3');
      }
    }
  };

  const doCherryPick = (sourceId: string, targetBranch: string) => {
    const stateBefore = gitState;
    const result = cherryPick(gitState, sourceId, targetBranch);
    if (!result) return;
    setGitState(result.state);
    logCommand(result.command, stateBefore, result.state);

    if (mode === "module3") {
      setModuleAttempts(n => n + 1);
      if (LESSON_CHERRY_PICK.validate(result.state)) completeModule('module3', 'module4');
    }
  };

  const doRebase = (branchToRebase: string, ontoBranch: string) => {
    const stateBefore = gitState;
    const result = rebase(gitState, branchToRebase, ontoBranch);
    if (!result) return;
    setGitState(result.state);
    logCommand(result.command, stateBefore, result.state);

    if (mode === "module4") {
      setModuleAttempts(n => n + 1);
      if (LESSON_REBASE.validate(result.state)) completeModule('module4', 'module5');
    }
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

    if (mode === "module5") {
      setModuleAttempts(n => n + 1);
      if (LESSON_MERGE.validate(result.state)) completeModule('module5', 'module6');
    }
  };

  const resolveConflict = (resolution: 'ours' | 'theirs' | 'both') => {
    if (!pendingConflictMerge) return;
    const { sourceBranch, targetBranch } = pendingConflictMerge;
    const result = merge(gitState, sourceBranch, targetBranch);
    if (!result) return;
    const resolvedMsg = `Merge branch '${sourceBranch}' into ${targetBranch} [resolved: ${resolution}]`;
    const [mergeId, mergeCommit] = Object.entries(result.state.commits).find(
      ([id]) => !gitState.commits[id]
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
    logCommand(`git merge ${sourceBranch} # conflict resolved (${resolution})`, gitState, finalState);
    setConflictState(null);
    setPendingConflictMerge(null);

    setModuleAttempts(n => n + 1);
    if (LESSON_CONFLICT.validate(finalState)) completeModule('module6', 'module7');
  };

  const doCheckout = (target: string) => {
    if (wip && mode === 'module8') {
      setTicker({ command: '⚠  Stash your work first: git stash', state: 'flash' });
      return;
    }
    const result = checkout(gitState, target);
    if (!result) return;

    if (mode === 'module10') {
      const isDetaching = !gitState.branches[target];
      if (isDetaching) {
        setHasDetached(true);
      }

      if (hasDetached && target === 'main') {
        setGitState(result.state);
        logCommand(result.command, gitState, result.state);
        setModuleAttempts(n => n + 1);
        if (LESSON_DETACHED_HEAD.validate(result.state)) {
          completeModule('module10', 'module11');
        }
        return;
      }
    }

    setGitState(result.state);
    logCommand(result.command, gitState, result.state);
  };

  const doResetHard = (targetId: string) => {
    if (mode === 'module11') {
      setReflog(prev => [
        { hash: targetId, message: `reset: moving to ${targetId}`, headRef: 'main' },
        ...prev,
      ]);
    }

    const stateBefore = gitState;
    const result = resetHard(gitState, targetId);
    if (!result) return;
    setGitState(result.state);
    logCommand(result.command, stateBefore, result.state);

    if (mode === 'module7') {
      setModuleAttempts(n => n + 1);
      if (LESSON_RESET.validate(result.state)) completeModule('module7', 'module8');
    }
  };

  const doStash = () => {
    if (!wip) return;
    const stateBefore = gitState;
    setStashStack(s => [{ message: wip, fromBranch: gitState.HEAD }, ...s]);
    setWip(null);
    logCommand('git stash', stateBefore, stateBefore);
  };

  const doStashPop = () => {
    if (stashStack.length === 0) return;
    const [top, ...rest] = stashStack;
    if (!top) return;
    const stateBefore = gitState;
    setWip(top.message);
    setStashStack(rest);
    logCommand('git stash pop', stateBefore, stateBefore);

    if (mode === 'module8') {
      setModuleAttempts(n => n + 1);
      if (gitState.branches['main'] !== 'c3') completeModule('module8', 'module9');
    }
  };

  const doSquash = (branchName: string, count: number, message: string) => {
    const stateBefore = gitState;
    const result = squashCommits(gitState, branchName, count, message);
    if (!result) return;
    setGitState(result.state);
    logCommand(result.command, stateBefore, result.state);

    if (mode === 'module9') {
      setModuleAttempts(n => n + 1);
      if (LESSON_SQUASH.validate(result.state)) completeModule('module9', 'module10');
    }
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
    setGitState(prev => ({
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

    if (mode === 'module11') {
      setModuleAttempts(n => n + 1);
      if (LESSON_REFLOG.validate(newState)) completeModule('module11');
    }
  };

  const doCreateBranch = (commitId: string) => {
    const stateBefore = gitState;
    const branchName = getNextBranchName(Object.keys(gitState.branches));
    const result = createBranch(gitState, commitId, branchName);
    setGitState(result.state);
    logCommand(result.command, stateBefore, result.state);

    if (mode === "module2") setModuleAttempts(n => n + 1);
  };

  const doReset = () => {
    const stateMap: Partial<Record<Mode, () => GitState>> = {
      sandbox: makeSandboxState,
      module3: makeModule3State,
      module4: makeModule4State,
      module5: makeModule5State,
      module6: makeModule6State,
      module7: makeModule7State,
      module8: makeModule8State,
      module9: makeModule9State,
      module10: makeModule10State,
      module11: makeModule11State,
    };
    setGitState((stateMap[mode] ?? makeModuleState)());

    const statusMap: Partial<Record<Mode, ModuleId>> = {
      module1: 'module1',
      module2: 'module2',
      module3: 'module3',
      module4: 'module4',
      module5: 'module5',
      module6: 'module6',
      module7: 'module7',
      module8: 'module8',
      module9: 'module9',
      module10: 'module10',
      module11: 'module11',
    };
    const modId = statusMap[mode];
    if (modId) setModuleStatus(modId, 'in_progress');

    setShowCompletionOverlay(false);
    setModuleAttempts(0);
    setHistory([]);
    setTicker({ command: "", state: "idle" });
    setConflictState(null);
    setPendingConflictMerge(null);
    setConflictFlash(false);
    setWip(mode === 'module8' ? 'fix: urgent hotfix for prod' : null);
    setStashStack([]);
    setHasDetached(false);

    if (mode === 'module11') {
      setShadowCommits(makeModule11ShadowCommits());
      setReflog([
        { hash: 'c5', message: 'commit: feat: add dashboard', headRef: 'main' },
        { hash: 'c4', message: 'commit: feat: add login', headRef: 'main' },
        { hash: 'c3', message: 'commit: feat: setup project', headRef: 'main' },
      ]);
    } else {
      setReflog([]);
      setShadowCommits({});
    }
  };

  const enterModule = (
    id: 'module0' | 'module1' | 'module2' | 'module3' | 'module4' | 'module5' | 'module6' | 'module7' | 'module8' | 'module9' | 'module10',
    makeState: () => GitState
  ) => {
    setMode(id);
    setGitState(makeState());
    setHistory([]);
    setTicker({ command: "", state: "idle" });
    setShowCompletionOverlay(false);
    setModuleAttempts(0);
    setModuleGuided(true);
    setConflictState(null);
    setPendingConflictMerge(null);
    setConflictFlash(false);
    setWip(id === 'module8' ? 'fix: urgent hotfix for prod' : null);
    setStashStack([]);
    setHasDetached(false);
    setModuleProgress(prev =>
      prev.map(p => (p.id === id && p.status === 'available' ? { ...p, status: 'in_progress' } : p))
    );
  };

  const enterModule0 = () => {
    enterModule('module0', makeModule0State);
    setTicker({ command: 'git init', state: 'flash' });
    setTimeout(() => setTicker({ command: 'git init', state: 'idle' }), 1400);
  };
  const enterModule1 = () => enterModule('module1', makeModuleState);
  const enterModule2 = () => enterModule('module2', makeModuleState);
  const enterModule3 = () => enterModule('module3', makeModule3State);
  const enterModule4 = () => enterModule('module4', makeModule4State);
  const enterModule5 = () => enterModule('module5', makeModule5State);
  const enterModule6 = () => enterModule('module6', makeModule6State);
  const enterModule7 = () => enterModule('module7', makeModule7State);
  const enterModule8 = () => enterModule('module8', makeModule8State);
  const enterModule9 = () => enterModule('module9', makeModule9State);
  const enterModule10 = () => enterModule('module10', makeModule10State);

  const enterModule11 = () => {
    const initialState = makeModule11State();
    setMode('module11');
    setGitState(initialState);
    setHistory([]);
    setTicker({ command: "", state: "idle" });
    setShowCompletionOverlay(false);
    setModuleAttempts(0);
    setModuleGuided(true);
    setConflictState(null);
    setPendingConflictMerge(null);
    setConflictFlash(false);
    setWip(null);
    setStashStack([]);
    setHasDetached(false);
    setShadowCommits(makeModule11ShadowCommits());
    setReflog([
      { hash: 'c5', message: 'commit: feat: add dashboard', headRef: 'main' },
      { hash: 'c4', message: 'commit: feat: add login', headRef: 'main' },
      { hash: 'c3', message: 'commit: feat: setup project', headRef: 'main' },
    ]);
    setModuleProgress(prev =>
      prev.map(p => (p.id === 'module11' && p.status === 'available' ? { ...p, status: 'in_progress' } : p))
    );
  };

  const unlockSandbox = () => {
    setShowCompletionOverlay(false);
    setMode("sandbox");
    setGitState(prev => {
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
    doMerge,
    doCheckout,
    doCreateBranch,
    doReset,
    enterModule0,
    enterModule1,
    enterModule2,
    enterModule3,
    enterModule4,
    enterModule5,
    enterModule6,
    enterModule7,
    enterModule8,
    enterModule9,
    enterModule10,
    enterModule11,
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
