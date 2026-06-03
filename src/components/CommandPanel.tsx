import { useState } from 'react';
import type { Mode } from '../types';
import { cardRadius } from './common/radii';

type CommandInfo = {
  title: string;
  description: string;
  steps?: string[];
};

const COMMAND_INFO: Record<string, CommandInfo> = {
  'git commit': {
    title: 'git commit',
    description: 'Snapshots your staged changes into a permanent new node in the graph. HEAD and your current branch advance to the new commit.',
  },
  'git checkout -b': {
    title: 'git checkout -b',
    description: 'Creates a new branch pointer and switches to it immediately. No files are copied — a branch is just a movable label.',
  },
  'git checkout': {
    title: 'git checkout',
    description: 'Moves HEAD to a branch or commit hash. On a branch: HEAD follows it. On a hash: HEAD detaches — you enter exploration mode with no branch attached.',
  },
  'git cherry-pick': {
    title: 'git cherry-pick',
    description: "Copies one commit's diff onto your current branch tip. The copy gets a new hash but identical changes.",
    steps: [
      'Git extracts the exact changes from the source commit',
      'Re-applies them on top of your current branch tip',
      'Creates a new commit with the same diff but a fresh hash',
    ],
  },
  'git rebase -i': {
    title: 'git rebase -i (interactive squash)',
    description: 'Rewrites a sequence of commits interactively — squash collapses multiple messy commits into one clean commit before merging.',
    steps: [
      'Git marks the selected commits to squash into one',
      'Combines their diffs into a single commit',
      'New hash assigned — local history rewritten cleanly',
    ],
  },
  'git rebase': {
    title: 'git rebase',
    description: 'Lifts your commits off their old base and re-applies them on top of the target branch. Each commit gets a new hash because its parent changed.',
    steps: [
      'Git finds the common ancestor of both branches',
      'Lifts your commits off their old base, one by one',
      'Re-applies each commit on top of the target — new hashes assigned',
    ],
  },
  'git merge': {
    title: 'git merge',
    description: 'Combines two branch histories with a new merge commit that has two parents. No existing commit is rewritten or moved.',
    steps: [
      'Git finds the common ancestor of both branches',
      'Combines changes from both sides without rewriting either',
      'Creates a merge commit with two parents — full history preserved',
    ],
  },
  'git reset --hard': {
    title: 'git reset --hard',
    description: 'Moves the branch pointer back to a specific commit, permanently discarding everything after it. Working tree is reset to match.',
    steps: [
      'Branch pointer moves back to the target commit',
      'Every commit after the target is removed from visible history',
      'Working tree is cleaned — no trace of the dropped commits remains',
    ],
  },
  'git stash pop': {
    title: 'git stash pop',
    description: 'Restores the most recently stashed changes back onto your working tree and removes that entry from the stack.',
  },
  'git stash': {
    title: 'git stash',
    description: 'Saves your uncommitted changes to a temporary stack and gives you a clean working tree, so you can safely switch branches.',
  },
  'git reflog': {
    title: 'git reflog',
    description: "Shows every place HEAD has ever been — commits, checkouts, resets, merges. Your safety net for recovering commits that seem lost after a hard reset.",
  },
};

const matchInfo = (cmd: string): CommandInfo | null => {
  if (cmd.startsWith('git rebase -i')) return COMMAND_INFO['git rebase -i'] ?? null;
  if (cmd.startsWith('git rebase')) return COMMAND_INFO['git rebase'] ?? null;
  if (cmd.startsWith('git checkout -b')) return COMMAND_INFO['git checkout -b'] ?? null;
  if (cmd.startsWith('git checkout')) return COMMAND_INFO['git checkout'] ?? null;
  if (cmd.startsWith('git commit')) return COMMAND_INFO['git commit'] ?? null;
  if (cmd.startsWith('git cherry-pick')) return COMMAND_INFO['git cherry-pick'] ?? null;
  if (cmd.startsWith('git merge')) return COMMAND_INFO['git merge'] ?? null;
  if (cmd.startsWith('git reset --hard')) return COMMAND_INFO['git reset --hard'] ?? null;
  if (cmd === 'git stash pop') return COMMAND_INFO['git stash pop'] ?? null;
  if (cmd === 'git stash') return COMMAND_INFO['git stash'] ?? null;
  if (cmd === 'git reflog') return COMMAND_INFO['git reflog'] ?? null;
  return null;
};

type CommandPanelProps = {
  mode: Mode;
  commands: string[];
  onPreview: (cmd: string) => void;
  onExecute: (cmd: string) => void;
};

export const CommandPanel = ({ mode: _mode, commands, onPreview, onExecute }: CommandPanelProps) => {
  const [tipsCmd, setTipsCmd] = useState<string | null>(null);

  if (commands.length === 0) return null;

  const tipsInfo = tipsCmd ? matchInfo(tipsCmd) : null;

  return (
    <div className="flex-shrink-0 relative border-t border-dashed border-[var(--hair)] bg-[var(--panel2)]">
      {/* Tips card — floats above the strip */}
      {tipsInfo && (
        <div
          className="absolute z-30 bottom-full mb-2 left-4"
          style={{ width: 320 }}
        >
          <div
            className="bg-[var(--panel)] p-4 shadow-lg border-2"
            style={{ borderRadius: cardRadius, borderColor: 'var(--ink)' }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="font-mono text-[11px] font-bold text-[var(--ink)]">
                {tipsInfo.title}
              </span>
              <button
                type="button"
                className="font-mono text-[11px] text-[var(--muted)] hover:text-[var(--ink)] leading-none cursor-pointer flex-shrink-0"
                onClick={() => setTipsCmd(null)}
              >
                ×
              </button>
            </div>
            <p className="font-hand text-[13px] text-[var(--soft)] leading-snug m-0 mb-3">
              {tipsInfo.description}
            </p>
            {tipsInfo.steps && (
              <ol className="m-0 pl-0 flex flex-col gap-1.5 list-none">
                {tipsInfo.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="font-mono text-[10px] text-[var(--muted)] flex-shrink-0 mt-0.5">
                      {i + 1}.
                    </span>
                    <span className="font-hand text-[12px] text-[var(--soft)] leading-snug">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}

      {/* Command strip */}
      <div className="flex items-center gap-2 px-4 py-1.5">
        <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--muted)] flex-shrink-0">
          Commands
        </span>
        <div className="flex flex-wrap gap-1.5">
          {commands.map((cmd) => (
            <div
              key={cmd}
              className="flex items-stretch border border-[var(--hair)] bg-[var(--panel)] overflow-hidden"
              style={{ borderRadius: cardRadius }}
            >
              <button
                type="button"
                className="px-2 py-0.5 font-mono text-[10px] text-[var(--soft)] hover:bg-[var(--panel2)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                onMouseEnter={() => onPreview(cmd)}
                onMouseLeave={() => onPreview('')}
                onClick={() => onExecute(cmd)}
              >
                {cmd}
              </button>
              {matchInfo(cmd) && (
                <button
                  type="button"
                  className="px-1.5 border-l border-[var(--hair)] font-mono text-[9px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--panel2)] transition-colors cursor-pointer flex-shrink-0"
                  style={{
                    color: tipsCmd === cmd ? 'var(--ink)' : undefined,
                    background: tipsCmd === cmd ? 'var(--panel2)' : undefined,
                  }}
                  onClick={() => setTipsCmd(tipsCmd === cmd ? null : cmd)}
                  title="What does this do?"
                >
                  ?
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
