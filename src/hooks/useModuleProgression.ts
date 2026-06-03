import { useEffect, useState } from "react";
import type { ModuleId, ModuleProgress, ModuleStatus } from "../types";

const INITIAL_PROGRESS: ModuleProgress[] = [
  { id: "module0", status: "available" },
  { id: "module1", status: "locked" },
  { id: "module2", status: "locked" },
  { id: "module3", status: "locked" },
  { id: "module4", status: "locked" },
  { id: "module5", status: "locked" },
  { id: "module6", status: "locked" },
  { id: "module7", status: "locked" },
  { id: "module8", status: "locked" },
  { id: "module9", status: "locked" },
  { id: "module10", status: "locked" },
  { id: "module11", status: "locked" },
  { id: "sandbox", status: "available" },
];

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
