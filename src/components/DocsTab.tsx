import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { insightRadius } from './common/radii';

type CommandRef = {
  command: string;
  description: string;
  steps?: string[];
};

type ModuleEntry = {
  id: string;
  num: string;
  accent: string;
  commands: CommandRef[];
};

const MODULES: ModuleEntry[] = [
  {
    id: 'module1', num: '01', accent: 'var(--ok)',
    commands: [
      {
        command: 'git add .',
        description: 'Stages all changes in the working tree, queuing them for the next commit.',
      },
      {
        command: 'git commit -m "message"',
        description: 'Snapshots staged changes into a permanent new node in the history graph. HEAD and the current branch both advance to the new commit.',
      },
    ],
  },
  {
    id: 'module2', num: '02', accent: 'var(--feat)',
    commands: [
      {
        command: 'git checkout -b <branch>',
        description: 'Creates a new branch pointer and switches to it immediately. No files are copied — a branch is just a movable label pointing at a commit.',
      },
      {
        command: 'git commit -m "message"',
        description: 'On the new branch, advances its tip and HEAD — without affecting main.',
      },
    ],
  },
  {
    id: 'module3', num: '03', accent: 'var(--ok)',
    commands: [
      {
        command: 'git cherry-pick <hash>',
        description: "Copies one commit's exact diff onto the tip of your current branch. The copy gets a new hash — same changes, fresh identity.",
        steps: [
          'Git extracts the exact changes introduced by the source commit',
          'Re-applies those changes on top of your current branch tip',
          'A new commit is created with the same diff but a different hash',
        ],
      },
    ],
  },
  {
    id: 'module4', num: '04', accent: 'var(--head)',
    commands: [
      {
        command: 'git rebase <onto>',
        description: 'Lifts your commits off their old base and re-applies them one-by-one on top of the target. History is rewritten — new hashes because parents changed.',
        steps: [
          'Git identifies the common ancestor of both branches',
          'Lifts your commits off their old base, one by one',
          'Re-applies each commit on top of the target — new parent means new hash',
        ],
      },
    ],
  },
  {
    id: 'module5', num: '05', accent: 'var(--ok)',
    commands: [
      {
        command: 'git merge <branch>',
        description: 'Combines two branch histories with a new merge commit that has two parents. No existing commit is rewritten or moved.',
        steps: [
          'Git finds the common ancestor of both branches',
          'Combines changes from both sides without touching either commit',
          'A merge commit is created with two parents — full history preserved',
        ],
      },
    ],
  },
  {
    id: 'module6', num: '06', accent: 'var(--conflict)',
    commands: [
      {
        command: 'git merge <branch>  # conflict',
        description: 'When both branches edited the same lines, Git pauses and marks the collision. You choose which version to keep, then complete the merge.',
        steps: [
          'Git detects conflicting changes it cannot auto-resolve',
          'The merge pauses — you inspect the conflict and pick a resolution',
          'After resolving, Git creates the merge commit with your chosen content',
        ],
      },
    ],
  },
  {
    id: 'module7', num: '07', accent: 'var(--head)',
    commands: [
      {
        command: 'git reset --hard <hash>',
        description: 'Moves the branch pointer back to the target commit, permanently discarding everything after it. Working tree is reset to match.',
        steps: [
          'The branch pointer moves back to the target commit',
          'All commits after the target are removed from visible history',
          'Working tree is cleaned — no trace of the dropped commits remains',
        ],
      },
    ],
  },
  {
    id: 'module8', num: '08', accent: 'var(--feat)',
    commands: [
      {
        command: 'git stash',
        description: 'Saves your uncommitted changes to a temporary stack and gives you a clean working tree — safe to switch branches without losing work.',
      },
      {
        command: 'git checkout <branch>',
        description: 'Moves HEAD to the named branch, updating the working tree to match that branch\'s tip.',
      },
      {
        command: 'git stash pop',
        description: 'Restores the most recently stashed snapshot back onto the working tree and removes that entry from the stack.',
      },
    ],
  },
  {
    id: 'module9', num: '09', accent: 'var(--feat)',
    commands: [
      {
        command: 'git rebase -i HEAD~N',
        description: 'Opens an interactive rewrite session. Squash collapses N messy commits into one clean, descriptive commit before merging.',
        steps: [
          'Git collects the commits in the specified range',
          'Squashed commits have their diffs combined into a single changeset',
          'One new commit replaces them all — history rewritten cleanly',
        ],
      },
    ],
  },
  {
    id: 'module10', num: '10', accent: 'var(--head)',
    commands: [
      {
        command: 'git checkout <hash>',
        description: 'Checks out a commit hash directly, putting HEAD in detached state — pointing at the commit itself, not a branch. Commits made here are orphaned when you leave.',
      },
      {
        command: 'git checkout <branch>',
        description: 'Reattaches HEAD to a named branch, returning you from detached state back to normal branch-tracked work.',
      },
    ],
  },
  {
    id: 'module11', num: '11', accent: 'var(--ok)',
    commands: [
      {
        command: 'git reflog',
        description: "Shows every position HEAD has ever occupied — commits, checkouts, resets, merges. Your safety net for finding commits that seem lost after a hard reset.",
      },
      {
        command: 'git reset --hard <hash>',
        description: 'Used with a reflog hash to restore a branch pointer to a previously reachable commit, bringing orphaned commits back into history.',
      },
    ],
  },
];

type SectionProps = { label: string; children: React.ReactNode };
const Section = ({ label, children }: SectionProps) => (
  <div>
    <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--muted)] block mb-1.5">
      {label}
    </span>
    {children}
  </div>
);

export const DocsTab = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-5 py-6 flex flex-col gap-3">
        {MODULES.map((mod) => {
          const isOpen = open === mod.id;
          return (
            <div
              key={mod.id}
              className="overflow-hidden"
              style={{
                borderRadius: '14px',
                border: `1.5px solid ${isOpen ? mod.accent : 'var(--hair)'}`,
                background: 'var(--panel)',
                transition: 'border-color 0.2s',
              }}
            >
              {/* Header row — always visible, click to expand */}
              <button
                type="button"
                className="w-full text-left flex items-center gap-3 px-4 py-3 cursor-pointer"
                style={{
                  background: isOpen
                    ? `color-mix(in srgb, ${mod.accent} 7%, var(--panel))`
                    : 'transparent',
                  transition: 'background 0.2s',
                }}
                onClick={() => setOpen(isOpen ? null : mod.id)}
              >
                {/* Accent number badge */}
                <span
                  className="font-mono text-[11px] font-bold w-7 h-7 flex items-center justify-center flex-shrink-0"
                  style={{
                    borderRadius: '8px',
                    background: `color-mix(in srgb, ${mod.accent} 15%, var(--panel2))`,
                    color: mod.accent,
                    border: `1.5px solid color-mix(in srgb, ${mod.accent} 35%, transparent)`,
                  }}
                >
                  {mod.num}
                </span>

                <span className="font-hand font-bold text-sm text-[var(--ink)] flex-1 leading-tight">
                  {t(`intro.${mod.id}.title`)}
                </span>

                {/* Command chips */}
                <span className="flex gap-1 flex-shrink-0">
                  {mod.commands.slice(0, 2).map((c) => (
                    <span
                      key={c.command}
                      className="font-mono text-[9px] px-1.5 py-0.5 hidden sm:inline-block"
                      style={{
                        borderRadius: '4px',
                        background: 'var(--panel2)',
                        color: 'var(--muted)',
                        border: '1px solid var(--hair)',
                      }}
                    >
                      {c.command.split(' ').slice(0, 2).join(' ')}
                    </span>
                  ))}
                </span>

                <span
                  className="font-mono text-[11px] text-[var(--muted)] ml-1 flex-shrink-0"
                  style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                >
                  ▾
                </span>
              </button>

              {/* Expanded body */}
              {isOpen && (
                <div className="px-4 pb-4 flex flex-col gap-4">
                  {/* Divider */}
                  <div
                    className="h-px"
                    style={{ background: `color-mix(in srgb, ${mod.accent} 20%, var(--hair))` }}
                  />

                  {/* Scenario + Concept side by side on wide, stacked on narrow */}
                  <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <Section label="The Problem">
                      <p className="text-[12.5px] text-[var(--soft)] leading-relaxed m-0 font-hand">
                        {t(`intro.${mod.id}.scenario`)}
                      </p>
                    </Section>
                    <Section label="How Git Works">
                      <p className="text-[12.5px] text-[var(--soft)] leading-relaxed m-0 font-hand">
                        {t(`intro.${mod.id}.concept`)}
                      </p>
                    </Section>
                  </div>

                  {/* Key insight */}
                  <div
                    className="px-3 py-2.5"
                    style={{
                      borderLeft: `3px solid ${mod.accent}`,
                      borderRadius: insightRadius,
                      background: `color-mix(in srgb, ${mod.accent} 7%, var(--panel))`,
                    }}
                  >
                    <span className="font-bold text-[11px] font-hand" style={{ color: mod.accent }}>
                      Key insight:{' '}
                    </span>
                    <span className="text-[12.5px] text-[var(--soft)] font-hand">
                      {t(`intro.${mod.id}.keyInsight`)}
                    </span>
                  </div>

                  {/* Commands */}
                  <Section label="Commands">
                    <div className="flex flex-col gap-2">
                      {mod.commands.map((cmd) => (
                        <div
                          key={cmd.command}
                          className="rounded-lg overflow-hidden"
                          style={{
                            border: '1px solid var(--hair)',
                            background: 'var(--panel2)',
                          }}
                        >
                          {/* Command bar */}
                          <div
                            className="px-3 py-2 flex items-center gap-2"
                            style={{
                              borderBottom: '1px solid var(--hair)',
                              background: `color-mix(in srgb, ${mod.accent} 6%, var(--panel2))`,
                            }}
                          >
                            <span className="font-mono text-[10px]" style={{ color: mod.accent }}>$</span>
                            <code className="font-mono text-[11px] text-[var(--ink)]">
                              {cmd.command}
                            </code>
                          </div>
                          {/* Description + steps */}
                          <div className="px-3 py-2.5 flex flex-col gap-2">
                            <p className="font-hand text-[12px] text-[var(--soft)] leading-snug m-0">
                              {cmd.description}
                            </p>
                            {cmd.steps && (
                              <ol className="m-0 pl-0 list-none flex flex-col gap-1">
                                {cmd.steps.map((step, i) => (
                                  <li key={i} className="flex gap-2 items-start">
                                    <span
                                      className="font-mono text-[9px] font-bold flex-shrink-0 mt-0.5"
                                      style={{ color: mod.accent }}
                                    >
                                      {i + 1}
                                    </span>
                                    <span className="font-hand text-[11.5px] text-[var(--muted)] leading-snug">
                                      {step}
                                    </span>
                                  </li>
                                ))}
                              </ol>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
