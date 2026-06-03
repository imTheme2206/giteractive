const en = {
  toolbar: {
    stash: '⬇ Stash',
    pop: '⬆ Pop ({{count}})',
    reset: '↺ Reset',
    theme: 'Theme',
    dev: 'dev',
    tabGraph: 'Graph',
    tabHistory: 'History',
  },
  modules: {
    module0: 'Module 0 · Get Started',
    module1: 'Module 1 · The Linear Timeline',
    module2: 'Module 2 · Parallel Universes',
    module3: 'Module 3 · Cherry-pick',
    module4: 'Module 4 · Rebase',
    module5: 'Module 5 · Merge',
    module6: 'Module 6 · Merge Conflicts',
    module7: 'Module 7 · git reset',
    module8: 'Module 8 · git stash',
    module9: 'Module 9 · Interactive Squash',
    module10: 'Module 10 · Detached HEAD',
    module11: 'Module 11 · Reflog Recovery',
    sandbox: 'Sandbox Mode',
  },
  sidebar: {
    levels: 'Levels',
    session: 'Session',
    noCommands: 'No commands yet',
    docs: 'Docs',
    commands: 'Commands',
    timeJustNow: 'just now',
    timeSeconds: '{{count}}s ago',
    timeMinutes: '{{count}}m ago',
    modules: {
      module0: { title: 'Module 0', subtitle: 'Get Started' },
      module1: { title: 'Module 1', subtitle: 'The Linear Timeline' },
      module2: { title: 'Module 2', subtitle: 'Parallel Universes' },
      module3: { title: 'Module 3', subtitle: 'Cherry-pick' },
      module4: { title: 'Module 4', subtitle: 'Rebase' },
      module5: { title: 'Module 5', subtitle: 'Merge' },
      module6: { title: 'Module 6', subtitle: 'Merge Conflicts' },
      module7: { title: 'Module 7', subtitle: 'git reset' },
      module8: { title: 'Module 8', subtitle: 'git stash' },
      module9: { title: 'Module 9', subtitle: 'Interactive Squash' },
      module10: { title: 'Module 10', subtitle: 'Detached HEAD' },
      module11: { title: 'Module 11', subtitle: 'Reflog Recovery' },
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
    init: {
      title: 'Level 00 — Your First Commit',
      description: 'You have an empty repository. Make your first commit to start tracking history.',
      hint: 'Click the + button to stage your changes, then commit them.',
      chips: ['action: first commit'],
    },
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
    squash: {
      title: 'Level 09 — Interactive Squash',
      description: 'Three messy WIP commits are on feature. Squash them into one clean commit before merging.',
      hint: 'Click the ⊕ squash button on the feature branch tip. Watch 3 commits collapse into 1.',
      chips: ['mode: -i squash', 'target: feature', 'before: 3 commits', 'after: 1 commit'],
    },
    'detached-head': {
      title: 'Level 10 — Detached HEAD',
      description: 'Checkout commit c2 directly to explore the past — then reattach HEAD to main to get back to safety.',
      hint: "Click on commit c2 to check it out (HEAD detaches). Then click main's branch label to reattach HEAD.",
      chips: ['step 1: checkout c2', 'step 2: reattach to main'],
    },
    reflog: {
      title: 'Level 11 — Reflog Recovery',
      description: 'You accidentally reset --hard to c3, losing c4 and c5. Use the reflog to find and restore the lost commits.',
      hint: 'Click the Recover button next to c5 in the reflog panel. The lost commits come back!',
      chips: ['lost: c4, c5', 'tool: git reflog', 'action: reset --hard <hash>'],
    },
  },
  intro: {
    module0: {
      title: 'Module 0 — Get Started',
      scenario: "You have a folder of files and no version history. You're about to make your first commit — the moment a project stops being just a folder and becomes a tracked repository.",
      concept: '`git init` creates a hidden `.git` directory inside your folder. That directory is the entire repository — it stores every snapshot, branch, and piece of history. Nothing outside it is touched.',
      keyInsight: 'Git is local-first. Your entire history lives on your machine. GitHub, GitLab, and Bitbucket are just mirrors — they host a copy of your `.git` directory online so others can collaborate.',
    },
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
    module9: {
      title: 'Module 9 — Interactive Squash',
      scenario: 'You made three messy WIP commits on a feature branch. Before merging to main, you want to collapse them into one clean, descriptive commit — as if the work was done perfectly the first time.',
      concept: '`git rebase -i HEAD~3` opens an interactive editor where you can mark commits to squash. Git combines them into one, keeps the earliest commit\'s timestamp, and lets you rewrite the message.',
      keyInsight: 'Squashing is rewriting history — never do it on commits others have pulled. Keep it local. A clean, atomic commit log is easier to review, bisect, and revert than a trail of "wip", "fix typo", "fix again".',
    },
    module10: {
      title: 'Module 10 — Detached HEAD',
      scenario: "You want to inspect an old commit without creating a branch. You run `git checkout <hash>` and suddenly git warns you: 'HEAD is now in detached state'. What does that mean?",
      concept: "HEAD normally points to a branch, which points to a commit. When you checkout a commit hash directly, HEAD points to the commit itself — 'detached' from any branch. Any commits you make here are orphaned when you leave.",
      keyInsight: "Detached HEAD is useful for exploration or testing. If you want to keep work done in detached state, create a branch immediately: `git checkout -b new-branch`. Otherwise, reattach to a named branch to get back to safety.",
    },
    module11: {
      title: 'Module 11 — Reflog Recovery',
      scenario: "You ran `git reset --hard` and your commits disappeared. Panic. But wait — git reset only moves the branch pointer. The actual commit objects are still in the repository for about 30 days.",
      concept: "`git reflog` shows every place HEAD has been — a time-stamped log of branch checkouts, commits, resets, and merges. Find the commit you lost, copy its hash, then `git reset --hard <hash>` to restore it.",
      keyInsight: "The reflog is your safety net. It's local-only (not pushed), so it won't help your teammate recover their lost commits — but it will save you. Git's garbage collector eventually prunes orphaned commits, so act fast.",
    },
  },
  tooltips: {
    head: {
      title: 'HEAD',
      body: 'HEAD points to your current branch or commit. Commands like git commit update wherever HEAD points.',
      detached: 'HEAD is detached — pointing directly at a commit hash, not a branch. Any commits made here will be orphaned when you switch away.',
      attached: 'HEAD is attached to branch "{{branch}}" — this is your active branch.',
    },
    branch: {
      title: 'Branch: {{name}}',
      pointer: 'Points to commit {{hash}}',
      headHere: 'HEAD is here — this is your active branch',
    },
    commit: {
      hash: 'Hash',
      branch: 'Branch',
      parents: 'Parents',
      message: 'Message',
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
  toast: {
    complete: 'Module {{n}} complete! 🎉',
    hint: 'Click the next module in the sidebar →',
  },
  moduleCard: {
    active: 'active',
    done: '✓ done',
    locked: 'locked',
    inProgress: 'in progress',
    clickToEnter: 'click to enter',
  },
  commandPanel: {
    whatDoesThisDo: 'What does this do?',
    commands: {
      gitCommit: {
        title: 'git commit',
        description: 'Snapshots your staged changes into a permanent new node in the graph. HEAD and your current branch advance to the new commit.',
      },
      gitCheckoutB: {
        title: 'git checkout -b',
        description: 'Creates a new branch pointer and switches to it immediately. No files are copied — a branch is just a movable label.',
      },
      gitCheckout: {
        title: 'git checkout',
        description: 'Moves HEAD to a branch or commit hash. On a branch: HEAD follows it. On a hash: HEAD detaches — you enter exploration mode with no branch attached.',
      },
      gitCherryPick: {
        title: 'git cherry-pick',
        description: "Copies one commit's diff onto your current branch tip. The copy gets a new hash but identical changes.",
        steps: [
          'Git extracts the exact changes from the source commit',
          'Re-applies them on top of your current branch tip',
          'Creates a new commit with the same diff but a fresh hash',
        ],
      },
      gitRebaseI: {
        title: 'git rebase -i (interactive squash)',
        description: 'Rewrites a sequence of commits interactively — squash collapses multiple messy commits into one clean commit before merging.',
        steps: [
          'Git marks the selected commits to squash into one',
          'Combines their diffs into a single commit',
          'New hash assigned — local history rewritten cleanly',
        ],
      },
      gitRebase: {
        title: 'git rebase',
        description: 'Lifts your commits off their old base and re-applies them on top of the target branch. Each commit gets a new hash because its parent changed.',
        steps: [
          'Git finds the common ancestor of both branches',
          'Lifts your commits off their old base, one by one',
          'Re-applies each commit on top of the target — new hashes assigned',
        ],
      },
      gitMerge: {
        title: 'git merge',
        description: 'Combines two branch histories with a new merge commit that has two parents. No existing commit is rewritten or moved.',
        steps: [
          'Git finds the common ancestor of both branches',
          'Combines changes from both sides without rewriting either',
          'Creates a merge commit with two parents — full history preserved',
        ],
      },
      gitResetHard: {
        title: 'git reset --hard',
        description: 'Moves the branch pointer back to a specific commit, permanently discarding everything after it. Working tree is reset to match.',
        steps: [
          'Branch pointer moves back to the target commit',
          'Every commit after the target is removed from visible history',
          'Working tree is cleaned — no trace of the dropped commits remains',
        ],
      },
      gitStashPop: {
        title: 'git stash pop',
        description: 'Restores the most recently stashed changes back onto your working tree and removes that entry from the stack.',
      },
      gitStash: {
        title: 'git stash',
        description: 'Saves your uncommitted changes to a temporary stack and gives you a clean working tree, so you can safely switch branches.',
      },
      gitReflog: {
        title: 'git reflog',
        description: "Shows every place HEAD has ever been — commits, checkouts, resets, merges. Your safety net for recovering commits that seem lost after a hard reset.",
      },
    },
  },
  commandHistory: {
    empty: 'No commands yet — interact with the canvas to see history here.',
    graphDiff: 'graph diff',
    noGraphChange: 'no graph change',
  },
  docs: {
    labels: {
      theProblem: 'The Problem',
      howGitWorks: 'How Git Works',
      keyInsight: 'Key insight:',
      commands: 'Commands',
    },
    modules: {
      module0: {
        commands: [
          { description: 'Initializes a new repository in the current directory by creating a hidden .git folder. This folder is the entire repository.' },
          { description: 'Stages all changes in the working tree, queuing them for the next commit.' },
          { description: 'Creates the first snapshot. With no parent commits, this is called a root commit — the anchor of your entire history.' },
        ],
      },
      module1: {
        commands: [
          { description: 'Stages all changes in the working tree, queuing them for the next commit.' },
          { description: 'Snapshots staged changes into a permanent new node in the history graph. HEAD and the current branch both advance to the new commit.' },
        ],
      },
      module2: {
        commands: [
          { description: 'Creates a new branch pointer and switches to it immediately. No files are copied — a branch is just a movable label pointing at a commit.' },
          { description: 'On the new branch, advances its tip and HEAD — without affecting main.' },
        ],
      },
      module3: {
        commands: [
          {
            description: "Copies one commit's exact diff onto the tip of your current branch. The copy gets a new hash — same changes, fresh identity.",
            steps: [
              'Git extracts the exact changes introduced by the source commit',
              'Re-applies those changes on top of your current branch tip',
              'A new commit is created with the same diff but a different hash',
            ],
          },
        ],
      },
      module4: {
        commands: [
          {
            description: 'Lifts your commits off their old base and re-applies them one-by-one on top of the target. History is rewritten — new hashes because parents changed.',
            steps: [
              'Git identifies the common ancestor of both branches',
              'Lifts your commits off their old base, one by one',
              'Re-applies each commit on top of the target — new parent means new hash',
            ],
          },
        ],
      },
      module5: {
        commands: [
          {
            description: 'Combines two branch histories with a new merge commit that has two parents. No existing commit is rewritten or moved.',
            steps: [
              'Git finds the common ancestor of both branches',
              'Combines changes from both sides without touching either commit',
              'A merge commit is created with two parents — full history preserved',
            ],
          },
        ],
      },
      module6: {
        commands: [
          {
            description: 'When both branches edited the same lines, Git pauses and marks the collision. You choose which version to keep, then complete the merge.',
            steps: [
              'Git detects conflicting changes it cannot auto-resolve',
              'The merge pauses — you inspect the conflict and pick a resolution',
              'After resolving, Git creates the merge commit with your chosen content',
            ],
          },
        ],
      },
      module7: {
        commands: [
          {
            description: 'Moves the branch pointer back to the target commit, permanently discarding everything after it. Working tree is reset to match.',
            steps: [
              'The branch pointer moves back to the target commit',
              'All commits after the target are removed from visible history',
              'Working tree is cleaned — no trace of the dropped commits remains',
            ],
          },
        ],
      },
      module8: {
        commands: [
          { description: 'Saves your uncommitted changes to a temporary stack and gives you a clean working tree — safe to switch branches without losing work.' },
          { description: "Moves HEAD to the named branch, updating the working tree to match that branch's tip." },
          { description: 'Restores the most recently stashed snapshot back onto the working tree and removes that entry from the stack.' },
        ],
      },
      module9: {
        commands: [
          {
            description: 'Opens an interactive rewrite session. Squash collapses N messy commits into one clean, descriptive commit before merging.',
            steps: [
              'Git collects the commits in the specified range',
              'Squashed commits have their diffs combined into a single changeset',
              'One new commit replaces them all — history rewritten cleanly',
            ],
          },
        ],
      },
      module10: {
        commands: [
          { description: 'Checks out a commit hash directly, putting HEAD in detached state — pointing at the commit itself, not a branch. Commits made here are orphaned when you leave.' },
          { description: 'Reattaches HEAD to a named branch, returning you from detached state back to normal branch-tracked work.' },
        ],
      },
      module11: {
        commands: [
          { description: "Shows every position HEAD has ever occupied — commits, checkouts, resets, merges. Your safety net for finding commits that seem lost after a hard reset." },
          { description: 'Used with a reflog hash to restore a branch pointer to a previously reachable commit, bringing orphaned commits back into history.' },
        ],
      },
    },
  },
} as const;

export default en;
