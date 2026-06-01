## 🎓 The Learning & Pedagogy Framework

This framework shifts the app from a pure utility sandbox to an intuitive, self-paced educational journey.

### 1. Progressive Concept Scaffolding (The Syllabus)

Instead of overwhelming users with all Git capabilities at once, features unlock sequentially through a guided story or challenge mode:

- **Module 1: The Linear Timeline (Basics)**
- _Concept:_ What is a commit? What is the staging area?
- _App Constraints:_ Drag-and-drop is disabled. Users can only click the `+` button or use `git add`/`git commit` to understand linear history.

- **Module 2: Parallel Universes (Branching)**
- _Concept:_ Branches are just pointers to commits, not copies of directories.
- _App Constraints:_ Unlocks the ability to pull a new branch pointer from any existing commit node.

- **Module 3: Rewriting History (Advanced Manipulation)**
- _Concept:_ Rebasing, Cherry-picking, and resetting.
- _App Constraints:_ Full interactive drag-and-drop unlocked on the canvas.

### 2. Contextual Explainer Overlays (The "Why" Popups)

When a user performs a visual action, the application shouldn't just display the command; it must explain the mechanical shift under the hood.

- **Example:** When a user drags a `feature` branch tip onto `main` to trigger a **Rebase**, a subtle, non-intrusive card pops up alongside the code ticker:
  > 💡 **What's happening?** Git is finding the common ancestor of both branches, lifting your feature commits, and re-applying them one-by-one on top of `main`. Notice how your old commit IDs changed? That's because history was rewritten!

### 3. Deliberate Failure Modes (Merge Conflicts Practice)

One of the biggest friction points for Git learners is panic when things go wrong. GitForge embraces this by creating safe, simulated failure environments:

- **The Conflict Canvas:** A level specifically designed to break. When the user drags a commit node to merge it, the graph flashes orange.
- **Visual Diff Matcher:** A Shadcn-based modal pops up displaying a split-screen file comparison. The user must manually click which lines of "code" to keep before the node graph completes its animation and saves the merge node.

### 4. Interactive "Git Command Lookup" Tooltip

Hovering over any component of the generated Git command in the ticker highlights the corresponding element on the canvas:

- Hovering over `rebase` flashes the parent-rewiring animation.
- Hovering over the branch name in `git checkout <branch>` highlights the glowing `HEAD` pointer moving to that label.

---

## 🎨 Updated Feature List: The Dynamic Canvas

### 1. Visual Commit Manipulation

- **The "Add Commit" Node:** A floating, semi-transparent node always hovers right next to the current `HEAD` position. Clicking it spawns a new commit node instantly.
- **Drag-and-Drop Actions:**
- **Cherry-Picking:** A user can click a commit node from a feature branch and drag it onto the `main` branch.
- **Rebasing:** A user can drag an entire branch tip node and drop it onto another branch tip.

- **The Command Ticker (Real-Time Display):** At the bottom of the screen, a prominent terminal-style banner updates dynamically based on the mouse actions.
- _While dragging:_ It displays a ghost command like `git rebase main`.
- _Upon dropping:_ The command flashes green, locks into place, and logs into a "Session History" panel.

---

## 💻 Tech Stack & Architecture Integration

Using **Bun, React, TypeScript, TailwindCSS, and Shadcn UI** provides a lightning-fast development environment and a highly polished UI.

### 1. Layout & Components (Shadcn UI + Tailwind)

- `Sidebar Component`: Built using Shadcn’s collapsible sidebar, housing the **Structured Level Syllabus**, command history, and a quick-reference glossary.
- `The Command Bar` (`<Command>`): An interactive command palette that lets users quickly search for Git commands or jump to specific conceptual tutorials.
- `The Canvas`: A large, flexible workspace styled with Tailwind's `bg-slate-950` with a subtle grid background (`bg-[linear-gradient(...)]`).
- `Guidance Toast` (`useToast`): Uses Shadcn's toast component to deliver bite-sized conceptual tips or error explanations when a user makes an invalid drag-and-drop move.

### 2. State & Node Management (TypeScript Architecture)

To handle the drag-and-drop mechanics smoothly alongside standard React state, use **React Flow**. The TypeScript state must track whether the user is in an open "Sandbox Mode" or a structured "Tutorial Lesson":

```typescript
type CommitHash = string;

interface CommitNode {
  id: CommitHash;
  parentId: CommitHash | null;
  message: string;
  branch?: string;
}

interface LessonGoal {
  id: string;
  title: string;
  description: string;
  expectedState: {
    HEAD: string;
    branchPositions: Record<string, CommitHash>;
  };
}

interface GitState {
  commits: Record<CommitHash, CommitNode>;
  branches: Record<string, CommitHash>; // e.g., { main: "c3", feature: "c5" }
  HEAD: string; // e.g., "refs/heads/feature" or "c3" (detached)
  currentLesson: LessonGoal | null;
  isLessonComplete: boolean;
}
```

### 3. Step-by-Step Logic for Action Generation

When a user interacts with the canvas, your graph library triggers event handlers that map visual events directly to text commands, state updates, and lesson validations:

| Visual Action (User Input)       | Target / Drop Location            | Generated Git Command              | Internal State Update & Validation                                                                                      |
| -------------------------------- | --------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Clicks "+" button**            | Attached to `main` branch         | `git commit -m "feat: new commit"` | Spawns new node; moves `main` forward. Checks if lesson requires a new commit.                                          |
| **Drags Node `C5**`              | Drops onto Node `C3` (`main` tip) | `git cherry-pick C5`               | Creates a duplicate node `C5'` with `parentId: "C3"`. Explains duplicate hash generation.                               |
| **Drags Branch Label `feature**` | Drops onto Node `C3`              | `git rebase main`                  | Identifies common ancestor, rewires the parents of `feature` sequentially onto `C3`. Validates against level objective. |

---

## 🚀 Updated Implementation Phases

### Phase 1: Bun Setup & Canvas Foundations

1. Initialize the project using Bun: `bun create vite gitforge --template react-ts`
2. Install TailwindCSS and initialize Shadcn UI via the Bun CLI.
3. Install React Flow (`bun add @xyflow/react`). Set up a basic canvas with draggable nodes representing a hardcoded 3-commit chain.

### Phase 2: The Command Translation Engine & Educational State

1. Implement a state provider (`GitProvider`) that manages the `GitState` object, including current lesson tracking.
2. Write custom handlers for React Flow's `onNodeDragStop` event.
3. Calculate where the node was dropped. If a node from a feature branch is dropped onto a node from the main branch, trigger a state function that updates the generated command string: `setGeneratedCommand("git cherry-pick " + draggedNode.id)`.
4. Run a validation check after every command execution to see if the state matches `currentLesson.expectedState`. If it matches, trigger the level completion UI.

### Phase 3: The Animation & Execution Loop

1. When the user confirms a visual move (or hits "Execute"), trigger the state update.
2. Use React Flow's built-in physics or CSS transitions so that when a rebase happens, the commits don't just snap to their new positions—they visibly slide over, showing the "history rewriting" concept beautifully.
3. Trigger a Shadcn contextual card explaining the real-world implications of the command just executed.
