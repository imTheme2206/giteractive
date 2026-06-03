import { useEffect, useRef, useState } from 'react';
import { MODULE_IDS } from '../moduleConfig';
import type { ModuleId } from '../types';

export const useModuleCompletion = (showCompletionOverlay: boolean, mode: string) => {
  const [toastModuleId, setToastModuleId] = useState<ModuleId | null>(null);
  const [justUnlockedId, setJustUnlockedId] = useState<ModuleId | null>(null);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (showCompletionOverlay) {
      setToastModuleId(mode as ModuleId);
      const currentIndex = MODULE_IDS.indexOf(mode as ModuleId);
      const nextId =
        currentIndex >= 0 && currentIndex < MODULE_IDS.length - 1
          ? MODULE_IDS[currentIndex + 1]
          : null;
      if (nextId) {
        setJustUnlockedId(nextId);
        if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = setTimeout(() => setJustUnlockedId(null), 3500);
      }
    }
  }, [showCompletionOverlay, mode]);

  useEffect(
    () => () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    },
    [],
  );

  return {
    toastModuleId,
    justUnlockedId,
    dismissToast: () => setToastModuleId(null),
  };
};
