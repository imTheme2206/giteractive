export type CommitHash = string;

export interface CommitNode {
  id: CommitHash;
  parentIds: CommitHash[];
  message: string;
  branch?: string;
}

export type BranchName = string;

export interface GitState {
  commits: Record<CommitHash, CommitNode>;
  branches: Record<BranchName, CommitHash>;
  HEAD: string; // branch name or detached hash
  nextCommitNum: number;
}

export interface LessonGoal {
  id: string;
  title: string;
  description: string;
  hint: string;
  chips: string[];
  validate: (state: GitState) => boolean;
}

export type Mode = 'module1' | 'module2' | 'module3' | 'sandbox';

export type TickerState = 'idle' | 'ghost' | 'flash' | 'logged';

export interface TickerEntry {
  id: string;
  command: string;
  timestamp: number;
}
