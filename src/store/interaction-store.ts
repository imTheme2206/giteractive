import { create } from "zustand";
import type { ConflictState } from "../types";

type InteractionStore = {
  wip: string | null;
  stashStack: Array<{ message: string; fromBranch: string }>;
  conflictState: ConflictState | null;
  conflictFlash: boolean;
  pendingConflictMerge: ConflictState | null;
  hasDetached: boolean;
  setWip: (message: string | null) => void;
  pushStash: (message: string, fromBranch: string) => void;
  popStash: () => { message: string; fromBranch: string } | null;
  triggerConflict: (source: string, target: string) => void;
  clearConflict: () => void;
  setHasDetached: (v: boolean) => void;
  reset: (initialWip?: string | null) => void;
};

export const useInteraction = create<InteractionStore>((set, get) => ({
  wip: null,
  stashStack: [],
  conflictState: null,
  conflictFlash: false,
  pendingConflictMerge: null,
  hasDetached: false,

  setWip: (message) => set({ wip: message }),

  pushStash: (message, fromBranch) =>
    set((s) => ({
      wip: null,
      stashStack: [{ message, fromBranch }, ...s.stashStack],
    })),

  popStash: () => {
    const [top, ...rest] = get().stashStack;
    if (!top) return null;
    set({ stashStack: rest, wip: top.message });
    return top;
  },

  triggerConflict: (source, target) => {
    set({ conflictFlash: true });
    setTimeout(
      () =>
        set({
          conflictFlash: false,
          conflictState: { sourceBranch: source, targetBranch: target },
          pendingConflictMerge: { sourceBranch: source, targetBranch: target },
        }),
      600,
    );
  },

  clearConflict: () => set({ conflictState: null, pendingConflictMerge: null }),

  setHasDetached: (v) => set({ hasDetached: v }),

  reset: (initialWip = null) =>
    set({
      wip: initialWip,
      stashStack: [],
      conflictState: null,
      conflictFlash: false,
      pendingConflictMerge: null,
      hasDetached: false,
    }),
}));
