export type CommitHash = string;

export type CommitNode = {
  id: CommitHash;
  parentIds: CommitHash[];
  message: string;
  branch?: string;
};

export type BranchName = string;

export type GitState = {
  commits: Record<CommitHash, CommitNode>;
  branches: Record<BranchName, CommitHash>;
  HEAD: string; // branch name or detached hash
  nextCommitNum: number;
};

export type LessonGoal = {
  id: string;
  title: string;
  description: string;
  hint: string;
  chips: string[];
  validate: (state: GitState) => boolean;
};

export type Mode = 'module1' | 'module2' | 'module3' | 'sandbox';

export type ModuleId = 'module1' | 'module2' | 'module3' | 'sandbox';
export type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'complete';

export type ModuleProgress = {
  id: ModuleId;
  status: ModuleStatus;
};

export type TickerState = 'idle' | 'ghost' | 'flash' | 'logged';

export type TickerEntry = {
  id: string;
  command: string;
  timestamp: number;
};
