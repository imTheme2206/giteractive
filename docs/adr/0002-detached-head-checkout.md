# ADR 0002 — Detached HEAD and checkout gestures

**Status:** Accepted

## Context

After implementing the ⎇ branch badge on the HEAD commit, the natural follow-on is `git checkout` — both to detach HEAD (click a commit) and to re-attach it (click a branch label). The data model already supports detached HEAD (`HEAD: string` can hold either a branch name or a commit hash). This ADR records the interaction and visual decisions.

## Decision

### Scope
Checkout gestures are Sandbox only. Modules 2 and 3 have focused learning goals where detached HEAD would be a distraction.

### Gestures
| Gesture | Command |
|---|---|
| Click non-HEAD commit (sandbox) | `git checkout <hash>` — detaches HEAD |
| Click branch label (sandbox) | `git checkout <branch>` — re-attaches HEAD |

Both are gated by a `showCheckout` prop so mode control stays at the canvas level, not inside the node components.

### Visual affordances
- **Detached HEAD label**: dashed border on the HEAD pill to signal the floating state.
- **Non-HEAD commit hover badge**: a `⎋` badge appears on hover only (not always-visible) with a pointer cursor. Always-on badges on every commit would clutter the graph.
- **`+` button in detached HEAD**: visible but disabled. A hover tip explains that a branch is needed to commit. The block is a teaching moment, not a dead end.
- **⎇ badge still shown on HEAD commit**: `git checkout -b` from detached HEAD is the standard recovery pattern in real git — hiding the badge here would teach users they're stuck when they aren't.

## Consequences

- Clicking any commit in sandbox now has potential meaning — checkout on non-HEAD commits, branch-create via badge on HEAD. The affordances are hover-gated so the canvas stays uncluttered.
- `addCommit` with detached HEAD is blocked at the UI level. The underlying `addCommit` function's detached-HEAD path (`branch: null ?? 'main'`) remains incorrect but is never reached.
- Re-attaching via branch label click is new behaviour for `BranchLabelNode`. It requires a `showCheckout` prop and `data-checkout-branch` attribute for event delegation, consistent with how the commit node badge works.
