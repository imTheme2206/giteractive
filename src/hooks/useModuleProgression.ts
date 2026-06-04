import { useEffect, useState } from "react";
import { MODULE_REGISTRY } from '../moduleRegistry';
import type { ModuleId, ModuleProgress, ModuleStatus } from "../types";

const INITIAL_PROGRESS: ModuleProgress[] = Object.entries(MODULE_REGISTRY).map(
  ([id, def]) => ({ id: id as ModuleId, status: def.initialStatus })
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

export const useModuleProgression = () => {
  const [moduleProgress, setModuleProgress] =
    useState<ModuleProgress[]>(loadProgress);
  useEffect(() => {
    localStorage.setItem(
      "giteractive_progress",
      JSON.stringify(moduleProgress),
    );
  }, [moduleProgress]);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [moduleAttempts, setModuleAttempts] = useState(0);
  const [moduleGuided, setModuleGuided] = useState(true);

  const setModuleStatus = (id: ModuleId, status: ModuleStatus) => {
    setModuleProgress((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p)),
    );
  };

  const completeModule = (id: ModuleId, nextId?: ModuleId) => {
    setModuleProgress((prev) =>
      prev.map((p) => {
        if (p.id === id) return { ...p, status: "complete" };
        if (nextId && p.id === nextId && p.status === "locked")
          return { ...p, status: "available" };
        return p;
      }),
    );
    setShowCompletionOverlay(true);
  };

  return {
    moduleProgress,
    setModuleProgress,
    showCompletionOverlay,
    setShowCompletionOverlay,
    moduleAttempts,
    setModuleAttempts,
    moduleGuided,
    setModuleGuided,
    completeModule,
    setModuleStatus,
  };
};
