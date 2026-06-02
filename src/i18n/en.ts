const en = {
  toolbar: {
    stash: '⬇ Stash',
    pop: '⬆ Pop ({{count}})',
    reset: '↺ Reset',
    theme: 'Theme',
    dev: 'dev',
  },
  modules: {
    module1: 'Module 1 · The Linear Timeline',
    module2: 'Module 2 · Parallel Universes',
    module3: 'Module 3 · Cherry-pick',
    module4: 'Module 4 · Rebase',
    module5: 'Module 5 · Merge',
    module6: 'Module 6 · Merge Conflicts',
    module7: 'Module 7 · git reset',
    module8: 'Module 8 · git stash',
    sandbox: 'Sandbox Mode',
  },
  sidebar: {
    levels: 'Levels',
    session: 'Session',
    noCommands: 'No commands yet',
    docs: 'Docs',
    timeJustNow: 'just now',
    timeSeconds: '{{count}}s ago',
    timeMinutes: '{{count}}m ago',
    modules: {
      module1: { title: 'Module 1', subtitle: 'The Linear Timeline' },
      module2: { title: 'Module 2', subtitle: 'Parallel Universes' },
      module3: { title: 'Module 3', subtitle: 'Cherry-pick' },
      module4: { title: 'Module 4', subtitle: 'Rebase' },
      module5: { title: 'Module 5', subtitle: 'Merge' },
      module6: { title: 'Module 6', subtitle: 'Merge Conflicts' },
      module7: { title: 'Module 7', subtitle: 'git reset' },
      module8: { title: 'Module 8', subtitle: 'git stash' },
      sandbox: { title: 'Sandbox Mode', subtitle: 'Free canvas · all ops' },
    },
  },
  goalCard: {
    goal: 'Goal:',
    hint: 'Hint ▸',
    guided: 'Guided',
    sandbox: 'Sandbox',
    attempts: 'attempts: {{count}}',
  },
  lessons: {
    linear: {
      title: 'Level 01 — The Linear Timeline',
      description: 'Add 4 more commits to reach 7 total and see how git builds a linear history.',
      hint: 'Click the + button to add a commit. Watch HEAD and main move forward each time.',
      chips: ['target: 7 commits', 'action: commit'],
    },
    branch: {
      title: 'Level 02 — Parallel Universes',
      description: 'Create a new branch and add a commit to it — without touching main.',
      hint: 'Click the ⎇ badge on the HEAD commit to branch, then click + to commit on it.',
      chips: ['action: branch + commit'],
    },
    'cherry-pick': {
      title: 'Level 03 — Cherry-pick',
      description: 'Move just the f2 commit from feature onto main — without bringing the whole branch along.',
      hint: 'Drag the f2 commit node onto c3 (main\'s tip). The ticker will preview git cherry-pick f2 before you release.',
      chips: ['target: main', 'commits to move: 1'],
    },
    rebase: {
      title: 'Level 04 — Rebase',
      description: "Move the entire feature branch on top of main's tip — rewriting its history so it looks like it was always based there.",
      hint: "Drag the feature branch label onto main's tip. Watch the commit IDs change — that's history being rewritten.",
      chips: ['onto: main', 'branch: feature'],
    },
    merge: {
      title: 'Level 05 — Merge',
      description: "Merge the feature branch into main — creating a merge commit that ties both histories together without rewriting any commit IDs.",
      hint: "Drag the feature branch label onto main's branch label badge. Watch the merge commit appear with two parent edges.",
      chips: ['target: main', 'branch: feature', 'result: merge commit'],
    },
    conflict: {
      title: 'Level 06 — Merge Conflicts',
      description: 'Both branches edited the same file. Merge feature into main — then resolve the conflict by choosing which version to keep.',
      hint: "Drag the feature branch label onto main's label. An orange flash means conflict detected. Pick a resolution in the modal.",
      chips: ['conflict: greeting.txt', 'resolve: choose version'],
    },
    reset: {
      title: 'Level 07 — git reset',
      description: 'Two broken WIP commits slipped onto main. Roll main back to c3 — erasing the broken commits from history.',
      hint: 'Hover over c3 and click the ↺ reset button. The broken commits disappear entirely (--hard mode).',
      chips: ['mode: --hard', 'target: c3', 'lost: c4, c5'],
    },
    stash: {
      title: 'Level 08 — git stash',
      description: 'You have uncommitted work on feature, but main needs an urgent fix. Stash your WIP, fix main, then pop the stash back on feature.',
      hint: 'Click ⬇ Stash to save WIP. Switch to main, add a commit, switch back to feature, then pop the stash.',
      chips: ['stash WIP', 'fix main', 'pop stash'],
    },
  },
  intro: {
    module1: {
      title: 'Module 1 — The Linear Timeline',
      scenario: 'Every project starts somewhere. Git tracks your work as a chain of snapshots called commits. Each commit is permanent, named, and linked to the one before it — giving you a complete, reversible history of everything that ever changed.',
      concept: 'When you run `git commit`, Git stores a snapshot of your staged changes and links it to the previous commit. HEAD and your branch label both point to the latest commit and advance with each new one.',
      keyInsight: 'The staging area sits between your files and history. You choose exactly which changes go into each commit — giving you precise, meaningful snapshots instead of one giant "saved everything" blob.',
    },
    module2: {
      title: 'Module 2 — Parallel Universes',
      scenario: 'You want to try a risky refactor without breaking the working version. In practice, you create a branch — an independent line of work you can develop, test, and throw away without ever touching main.',
      concept: 'A branch is just a movable pointer to a commit — no files are copied. When you commit on a branch, the pointer advances to the new commit. Switching branches moves HEAD to a different pointer.',
      keyInsight: 'Branches are nearly free. Creating one takes microseconds and copies nothing. The real cost is merging — so branch early, branch often, and keep branches short-lived.',
    },
    module3: {
      title: 'Module 3 — Cherry-pick',
      scenario: 'You fixed a critical bug on a feature branch. Production needs that fix now — but the feature itself isn\'t ready. Cherry-pick lets you copy just that one commit onto main without bringing the rest of the branch along.',
      concept: '`git cherry-pick <hash>` takes a commit\'s diff — the exact changes it introduced — and re-applies them on top of your current branch tip. The new commit has the same content but a brand-new hash.',
      keyInsight: 'The cherry-picked copy is completely independent of the original. Deleting, amending, or rebasing the original has no effect on the copy you made.',
    },
    module4: {
      title: 'Module 4 — Rebase',
      scenario: 'Your feature branch fell behind while others merged work into main. Instead of cluttering history with a merge commit, you want your commits to sit cleanly on top — as if you\'d started from the latest main all along.',
      concept: 'Rebase finds the common ancestor of both branches, lifts your commits off their old base, and re-applies them one-by-one on top of the target. Each commit gets a new hash because its parent changed.',
      keyInsight: 'Rebase rewrites history. Never rebase commits others have already pulled — you\'ll create divergent timelines that are painful to reconcile. Keep rebase local or use it only on your own branches.',
    },
    module5: {
      title: 'Module 5 — Merge',
      scenario: 'Your feature is complete and reviewed. You want to bring it into main while keeping a full, honest record of when the feature work happened — exactly as it was written, without rewriting anything.',
      concept: '`git merge` creates a new merge commit with two parents — one from each branch. The original commit IDs are completely untouched; Git just adds a new node that ties both histories together.',
      keyInsight: 'Unlike rebase, merge is non-destructive — both timelines are preserved exactly as they happened. The trade-off is a non-linear history. Teams that value auditability choose merge; teams that prefer clean logs choose rebase.',
    },
    module6: {
      title: 'Module 6 — Merge Conflicts',
      scenario: 'Two developers edited the same line of the same file on different branches. When they try to merge, Git can\'t decide which version is correct — it stops and asks for human judgment.',
      concept: 'When Git detects conflicting changes it can\'t auto-resolve, it pauses the merge and marks the collisions in the file. You resolve them by choosing which version (or a blend) to keep, then complete the merge.',
      keyInsight: 'Conflicts are normal — not failures. They\'re Git asking you to make a decision it can\'t make alone. The more your team communicates about who owns which parts of the codebase, the fewer conflicts you\'ll encounter.',
    },
    module7: {
      title: 'Module 7 — git reset',
      scenario: 'You made a few bad commits on main — experiments that shouldn\'t have been committed. No one else has pulled them yet. You want to erase them completely, as if they never existed.',
      concept: '`git reset --hard <hash>` moves the branch pointer back to a specific commit and discards everything after it. The commits disappear from history and the working tree is cleaned to match.',
      keyInsight: '`--hard` is permanent and unrecoverable through normal git commands. Only use it on commits you haven\'t shared. For public branches, use `git revert` instead — it adds a new commit that safely undoes the change.',
    },
    module8: {
      title: 'Module 8 — git stash',
      scenario: 'You\'re halfway through a feature when an urgent bug report arrives. You need to switch branches, but your uncommitted changes can\'t come along — and you can\'t commit half-finished work.',
      concept: '`git stash` saves your uncommitted changes to a temporary stack and restores a clean working tree. You switch branches, fix the bug, come back, and pop the stash to resume exactly where you left off.',
      keyInsight: 'The stash is a stack — you can push multiple times. `git stash pop` always restores the most recent entry first. Stashes persist even if you switch branches or restart your terminal.',
    },
  },
  tickerSubtitles: {
    cherryPick: "Copies just this commit's diff onto your current branch",
    rebase: 'Re-applies your commits one-by-one on top of the target branch',
    merge: 'Ties both histories together with a new merge commit',
  },
  explainer: {
    branchCreated: {
      title: 'Branch created',
      body: 'Git created a new pointer called "{{branch}}" — no files were copied. Branches are just labels. HEAD now follows {{branch}} forward as you add commits.',
    },
    newCommit: {
      title: 'New commit created',
      body: "Git took a snapshot of your staged changes and stored it as a new node in the history graph. Each commit gets a unique hash — that's why the ID looks random.",
    },
    cherryPick: {
      title: 'Cherry-pick — what just happened',
      steps: [
        'Git extracted the diff between {{hash}} and its parent — just the changes that commit introduced.',
        'Those changes were re-applied on top of your current branch tip.',
        'A new commit was created with the same diff but a different hash — same changes, new identity.',
      ],
    },
    rebase: {
      title: 'Rebase — what just happened',
      steps: [
        'Git identified the common ancestor of both branches — the last point where their histories were the same.',
        'Your commits were lifted off their old base, one by one.',
        'Each commit was re-applied on top of {{onto}} — and assigned a new hash because its parent changed.',
      ],
    },
    mergeCommit: {
      title: 'Merge commit — what just happened',
      steps: [
        'Git found the common ancestor of both branches.',
        'Changes from both sides were combined — neither branch was rewritten.',
        'A new merge commit was created with two parents. Both original branch histories are preserved exactly.',
      ],
    },
    hardReset: {
      title: 'Hard reset — what just happened',
      steps: [
        'Git moved the branch pointer back to {{target}}.',
        'Every commit after {{target}} was removed from history.',
        'The working tree was cleaned to match — no trace of those commits remains.',
      ],
    },
    workStashed: {
      title: 'Work stashed',
      body: 'Git saved your uncommitted changes to a temporary stack and cleaned your working tree — leaving you free to switch branches.',
    },
    stashPopped: {
      title: 'Stash popped',
      body: 'Git restored the stashed snapshot onto your working tree. The stash entry is now gone.',
    },
  },
  conflict: {
    title: 'Merge Conflict Detected',
    chooseResolution: 'Choose resolution',
    keepOurs: 'Keep Ours (main)',
    keepTheirs: 'Keep Theirs (feature)',
    keepBoth: 'Keep Both',
    footer: 'Choosing a resolution will create the merge commit',
  },
  moduleCard: {
    active: 'active',
    done: '✓ done',
    locked: 'locked',
    inProgress: 'in progress',
    clickToEnter: 'click to enter',
  },
  completion: {
    module1: {
      title: 'Module 1 Complete!',
      body: "You've mastered linear history. Ready for branches?",
      button: 'Unlock Module 2',
    },
    module2: {
      title: 'Module 2 Complete!',
      body1: 'A branch is just a pointer to a commit — no files copied, just a label.',
      body2: 'Next: cherry-pick a single commit across branches.',
      button: 'Unlock Module 3',
    },
    module3: {
      title: 'Cherry-pick Complete!',
      body: "You copied one commit onto main — its hash changed because it was re-applied, not moved.",
      button: 'Unlock Module 4',
    },
    module4: {
      title: 'Rebase Complete!',
      body: "The feature commits were lifted off their old base and re-applied on top of main. Notice the IDs changed — history was rewritten.",
      button: 'Unlock Module 5',
    },
    module5: {
      title: 'Merge Complete!',
      body: "You created a merge commit with two parents — both histories are preserved. Unlike rebase, the original commit IDs don't change.",
      button: 'Unlock Module 6',
    },
    module6: {
      title: 'Conflict Resolved!',
      body: 'You navigated a merge conflict — choosing which version of the file to keep before committing. Real git conflict resolution works the same way.',
      button: 'Unlock Module 7',
    },
    module7: {
      title: 'Reset Complete!',
      body: "git reset --hard moved the branch pointer back and permanently erased the commits after it. Unlike revert, there's no \"undo\" commit — the history is gone.",
      button: 'Unlock Module 8',
    },
    module8: {
      title: 'Stash Mastered!',
      body: 'You saved uncommitted work to the stash, switched contexts to fix main, then popped it back. The stash is a stack — you can push multiple times.',
      button: 'Go to Sandbox',
    },
    attempts_one: '{{count}} attempt',
    attempts_other: '{{count}} attempts',
  },
} as const;

export default en;
