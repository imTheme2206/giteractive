import { create } from "zustand";
import type { CompletionTrigger } from "../moduleRegistry";
import { MODULE_REGISTRY } from "../moduleRegistry";
import type {
  GitState,
  ModuleId,
  ModuleProgress,
  ModuleStatus,
} from "../types";

const INITIAL_PROGRESS: ModuleProgress[] = Object.entries(MODULE_REGISTRY).map(
  ([id, def]) => ({ id: id as ModuleId, status: def.initialStatus }),
);

const loadProgress = (): ModuleProgress[] => {
  try {
    const saved = localStorage.getItem("giteractive_progress");
    if (saved) {
      const savedArr = JSON.parse(saved) as ModuleProgress[];
      return INITIAL_PROGRESS.map(
        (init) => savedArr.find((s) => s.id === init.id) ?? init,
      );
    }
  } catch {}
  return INITIAL_PROGRESS;
};

const saveProgress = (progress: ModuleProgress[]) => {
  localStorage.setItem("giteractive_progress", JSON.stringify(progress));
};

const isFirstVisit = !localStorage.getItem("giteractive_welcomed");

type ModuleFlowStore = {
  mode: ModuleId;
  moduleProgress: ModuleProgress[];
  moduleAttempts: number;
  moduleGuided: boolean;
  showCompletionOverlay: boolean;
  devMode: boolean;
  setMode: (id: ModuleId) => void;
  setModuleProgress: (
    updater: (prev: ModuleProgress[]) => ModuleProgress[],
  ) => void;
  setModuleStatus: (id: ModuleId, status: ModuleStatus) => void;
  setModuleGuided: (v: boolean) => void;
  setModuleAttempts: (updater: number | ((n: number) => number)) => void;
  completeModule: (id: ModuleId, nextId?: ModuleId) => void;
  dismissOverlay: () => void;
  checkCompletion: (trigger: CompletionTrigger, state: GitState) => void;
  unlockAll: () => void;
};

export const useModuleFlow = create<ModuleFlowStore>((set, get) => ({
  mode: (isFirstVisit ? "module0" : "sandbox") as ModuleId,
  moduleProgress: loadProgress(),
  moduleAttempts: 0,
  moduleGuided: true,
  showCompletionOverlay: false,
  devMode: false,

  setMode: (id) => set({ mode: id }),

  setModuleProgress: (updater) =>
    set((s) => {
      const next = updater(s.moduleProgress);
      saveProgress(next);
      return { moduleProgress: next };
    }),

  setModuleStatus: (id, status) =>
    get().setModuleProgress((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p)),
    ),

  setModuleGuided: (v) => set({ moduleGuided: v }),

  setModuleAttempts: (updater) =>
    set((s) => ({
      moduleAttempts:
        typeof updater === "function" ? updater(s.moduleAttempts) : updater,
    })),

  completeModule: (id, nextId) => {
    get().setModuleProgress((prev) =>
      prev.map((p) => {
        if (p.id === id) return { ...p, status: "complete" };
        if (nextId && p.id === nextId && p.status === "locked")
          return { ...p, status: "available" };
        return p;
      }),
    );
    set({ showCompletionOverlay: true });
  },

  dismissOverlay: () => set({ showCompletionOverlay: false }),

  checkCompletion: (trigger, state) => {
    const { mode } = get();
    const def = MODULE_REGISTRY[mode];
    if (def?.completionTrigger !== trigger) return;
    get().setModuleAttempts((n) => n + 1);
    const validator = def.validate ?? def.lesson?.validate;
    if (validator?.(state)) get().completeModule(mode, def.next);
  },

  unlockAll: () => {
    get().setModuleProgress((prev) =>
      prev.map((p) =>
        p.status === "locked" ? { ...p, status: "available" } : p,
      ),
    );
    set({ devMode: true });
  },
}));
