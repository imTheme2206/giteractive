# ADR 0001 — Branch badge lives on HEAD commit only

**Status:** Accepted

## Context

The original Module 2 implementation showed an ⎇ badge on every commit node and allowed branching from any point in history. This was implemented as a `module2Hint` boolean prop, leaking module-specific logic into the shared `CommitGraphNode` component. Sandbox mode exposed branching via a separate toolbar button (`⎇ Branch`), creating two affordances for the same action at different layers.

## Decision

The ⎇ badge is rendered on the HEAD commit node only, across all modes. It is hidden in Module 1 (where branching is intentionally locked). Clicking the badge runs `git checkout -b <next-branch-name>` regardless of mode. The toolbar branch button is removed.

## Consequences

- **Teaches correct git mental model.** `git checkout -b` creates a branch from your current position. Showing the badge only on HEAD reinforces this rather than implying you can branch from anywhere at any time.
- **Breaks arbitrary-commit branching in Module 2.** Previously a learner could click any historical commit to branch from it. This capability is removed. It was a teaching simplification that actually taught incorrect behavior.
- **Single affordance.** Badge is the only branch-creation gesture. No toolbar button. Reduces surface area and mode-specific special cases.
- **Deferred: detached HEAD.** Clicking non-HEAD commits to run `git checkout <hash>` (detached HEAD) is a natural follow-on but is scoped to a future iteration. For now, non-HEAD commit clicks do nothing.
