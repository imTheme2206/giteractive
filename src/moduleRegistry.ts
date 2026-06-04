import type { CommitNode, GitState, LessonGoal, ModuleId, ModuleStatus, ReflogEntry } from './types';
import {
  LESSON_BRANCH, LESSON_CHERRY_PICK, LESSON_CONFLICT,
  LESSON_DETACHED_HEAD, LESSON_INIT, LESSON_LINEAR,
  LESSON_MERGE, LESSON_REBASE, LESSON_REFLOG,
  LESSON_RESET, LESSON_SQUASH, LESSON_STASH,
} from './lessons';
import {
  makeModule0State, makeModule3State, makeModule4State,
  makeModule5State, makeModule6State, makeModule7State,
  makeModule8State, makeModule9State, makeModule10State,
  makeModule11State, makeModule11ShadowCommits,
  makeModuleState, makeSandboxState,
} from './gitState';

export type CompletionTrigger =
  | 'addCommit' | 'cherryPick' | 'rebase' | 'merge'
  | 'resolveConflict' | 'checkout' | 'resetHard'
  | 'stashPop' | 'squash' | 'reflogRecover';

export type ModuleDefinition = {
  accent: string;
  lesson?: LessonGoal;
  makeState: () => GitState;
  initialStatus: ModuleStatus;
  next?: ModuleId;
  completionTrigger?: CompletionTrigger;
  initialWip?: string;
  getShadowCommits?: () => Record<string, CommitNode>;
  getInitialReflog?: () => ReflogEntry[];
  validate?: (state: GitState) => boolean;
};

export const MODULE_REGISTRY: Record<ModuleId, ModuleDefinition> = {
  module0: {
    accent: 'var(--ok)',
    lesson: LESSON_INIT,
    makeState: makeModule0State,
    initialStatus: 'available',
    next: 'module1',
    completionTrigger: 'addCommit',
  },
  module1: {
    accent: 'var(--ok)',
    lesson: LESSON_LINEAR,
    makeState: makeModuleState,
    initialStatus: 'locked',
    next: 'module2',
    completionTrigger: 'addCommit',
  },
  module2: {
    accent: 'var(--feat)',
    lesson: LESSON_BRANCH,
    makeState: makeModuleState,
    initialStatus: 'locked',
    next: 'module3',
    completionTrigger: 'addCommit',
    validate: (state) => {
      const { HEAD, branches, commits } = state;
      if (HEAD !== 'main' && branches[HEAD]) {
        const tip = commits[branches[HEAD]];
        return !!(tip?.branch && tip.branch !== 'main');
      }
      return false;
    },
  },
  module3: {
    accent: 'var(--ok)',
    lesson: LESSON_CHERRY_PICK,
    makeState: makeModule3State,
    initialStatus: 'locked',
    next: 'module4',
    completionTrigger: 'cherryPick',
  },
  module4: {
    accent: 'var(--head)',
    lesson: LESSON_REBASE,
    makeState: makeModule4State,
    initialStatus: 'locked',
    next: 'module5',
    completionTrigger: 'rebase',
  },
  module5: {
    accent: 'var(--ok)',
    lesson: LESSON_MERGE,
    makeState: makeModule5State,
    initialStatus: 'locked',
    next: 'module6',
    completionTrigger: 'merge',
  },
  module6: {
    accent: 'var(--conflict)',
    lesson: LESSON_CONFLICT,
    makeState: makeModule6State,
    initialStatus: 'locked',
    next: 'module7',
    completionTrigger: 'resolveConflict',
  },
  module7: {
    accent: 'var(--head)',
    lesson: LESSON_RESET,
    makeState: makeModule7State,
    initialStatus: 'locked',
    next: 'module8',
    completionTrigger: 'resetHard',
  },
  module8: {
    accent: 'var(--feat)',
    lesson: LESSON_STASH,
    makeState: makeModule8State,
    initialStatus: 'locked',
    next: 'module9',
    completionTrigger: 'stashPop',
    initialWip: 'fix: urgent hotfix for prod',
  },
  module9: {
    accent: 'var(--feat)',
    lesson: LESSON_SQUASH,
    makeState: makeModule9State,
    initialStatus: 'locked',
    next: 'module10',
    completionTrigger: 'squash',
  },
  module10: {
    accent: 'var(--head)',
    lesson: LESSON_DETACHED_HEAD,
    makeState: makeModule10State,
    initialStatus: 'locked',
    next: 'module11',
    completionTrigger: 'checkout',
  },
  module11: {
    accent: 'var(--ok)',
    lesson: LESSON_REFLOG,
    makeState: makeModule11State,
    initialStatus: 'locked',
    completionTrigger: 'reflogRecover',
    getShadowCommits: makeModule11ShadowCommits,
    getInitialReflog: () => [
      { hash: 'c5', message: 'commit: feat: add dashboard', headRef: 'main' },
      { hash: 'c4', message: 'commit: feat: add login', headRef: 'main' },
      { hash: 'c3', message: 'commit: feat: setup project', headRef: 'main' },
    ],
  },
  sandbox: {
    accent: 'var(--feat)',
    makeState: makeSandboxState,
    initialStatus: 'available',
  },
};
