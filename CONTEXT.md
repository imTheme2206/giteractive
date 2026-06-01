# Git Interactive Learning Playground — Context

## Domain Terms

**Commit** — An immutable snapshot in the graph. Represented as a circular node on the canvas. Has an auto-generated short hash ID and an auto-generated message (`feat: new commit N`).

**Branch tip** — The commit a branch label currently points to. Dragging a branch label triggers a rebase gesture.

**HEAD** — A pointer to the currently checked-out branch or commit. Displayed as a red label on the canvas. Moves forward when a commit is added.

**Module 1 (The Linear Timeline)** — The first tutorial unit. Only the `+` button is active; drag-and-drop and branch creation are disabled. Branch badge is suppressed. Users learn linear history: what a commit is and what the staging area does.

**Module 2 (Parallel Universes)** — Teaches branching. Branch badge appears on HEAD; clicking it runs `git checkout -b` from the current HEAD position. Branching from arbitrary commits is not exposed — the lesson is that branches are created from where you are.

**Module 3 (Cherry-pick)** — Teaches cherry-pick via drag-and-drop. Branch badge visible on HEAD. Drag a commit node onto another branch tip to cherry-pick.

**Sandbox Mode** — All canvas interactions enabled: add-commit, cherry-pick, rebase, and branch creation via the HEAD badge. No separate toolbar branch button — the badge is the single affordance.

**Branch badge** — The ⎇ indicator shown on the HEAD commit node. Clicking it runs `git checkout -b <next-branch-name>`. Suppressed in Module 1. Presence signals "you can branch from here."

**Detached HEAD** — A state where HEAD points directly at a commit hash rather than a branch name. Occurs after `git checkout <hash>`. Planned for a future iteration; not yet modelled in the canvas.

**Command ticker** — The terminal-style banner at the bottom of the canvas. Three states: ghost (while dragging, shows the inferred command), flash-green (on drop/confirm), logged (entry added to Session History in the sidebar).

**Session History** — In-memory log of executed commands for the current session. Displayed in the sidebar. Resets on page reload.

## Resolved Decisions

| Decision | Choice | Reason |
|---|---|---|
| App layout | Layout A — left sidebar + canvas + bottom ticker | Levels and history always visible supports guided learning |
| Sidebar | Collapsible via a toggle in settings/toolbar | Clean canvas when user wants focus |
| Visual aesthetic | Hand-drawn (Kalam font, paper bg, irregular borders) | Friendlier for beginners than polished dark UI |
| Theme default | Paper (light) with dark toggle | Paper is warmer and more approachable |
| Canvas library | React Flow with fully custom node + edge components | Drag mechanics for free; hand-drawn aesthetic via custom renderers |
| MVP scope | Sandbox + Module 1 | Ship something complete before adding Modules 2 & 3 |
| Branch badge placement | HEAD commit only, all modes except Module 1 | Matches real `git checkout -b` — you branch from where you are, not from arbitrary history |
| Toolbar branch button | Removed; badge is the single affordance | Two affordances for the same action at different layers caused confusion |
| Initial canvas state | 3-node linear chain: C1 → C2 → C3, `main` @ C3, `HEAD` @ main | Matches plan §Phase 1 |
| Commit messages | Auto-generated (`feat: new commit N`) | No modal prompt in MVP |
| Persistence | In-memory only (no localStorage) | Simplest correct default for v1 |
| Undo/Reset | Reset button only (clears to initial state) | Undo is a future concern |

## Color Tokens (from wireframe)

| Token | Light | Dark | Semantic |
|---|---|---|---|
| `--main` | `#3a6ea5` | `#5b95d6` | `main` branch |
| `--feat` | `#c5773a` | `#e0985a` | feature branch |
| `--head` | `#bd463f` | `#e0635b` | HEAD pointer |
| `--ok` | `#3c8a57` | `#56b87b` | success / committed |
| `--ghost` | `rgba(44,43,38,.32)` | `rgba(232,229,218,.30)` | ghost/pending state |
