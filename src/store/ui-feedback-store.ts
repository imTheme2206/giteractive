import { create } from "zustand";
import type { GitState, TickerData, TickerEntry } from "../types";

type UIFeedbackStore = {
  ticker: TickerData;
  history: TickerEntry[];
  setTicker: (data: Partial<TickerData>) => void;
  flashAndLog: (
    command: string,
    stateBefore?: GitState,
    stateAfter?: GitState,
  ) => void;
  flashAndLogCommit: (
    command: string,
    branch: string,
    stateBefore: GitState,
    stateAfter: GitState,
  ) => void;
  clear: () => void;
};

const isFirstVisit = !localStorage.getItem("giteractive_welcomed");

export const useUIFeedback = create<UIFeedbackStore>((set) => ({
  ticker: {
    command: isFirstVisit ? "git init" : "",
    state: isFirstVisit ? "flash" : "idle",
  },
  history: [],

  setTicker: (data) => set((s) => ({ ticker: { ...s.ticker, ...data } })),

  flashAndLog: (command, stateBefore, stateAfter) => {
    set({ ticker: { command, state: "flash" } });
    setTimeout(() => {
      set((s) => ({
        ticker: { ...s.ticker, state: "idle" },
        history: [
          {
            id: crypto.randomUUID(),
            command,
            timestamp: Date.now(),
            stateBefore,
            stateAfter,
          },
          ...s.history,
        ],
      }));
    }, 1200);
  },

  flashAndLogCommit: (command, branch, stateBefore, stateAfter) => {
    set({ ticker: { command, state: "flash" } });
    setTimeout(() => {
      const now = Date.now();
      set((s) => ({
        ticker: { ...s.ticker, state: "idle" },
        history: [
          {
            id: crypto.randomUUID(),
            command: `git push origin ${branch}`,
            timestamp: now + 2,
            stateBefore: stateAfter,
            stateAfter,
          },
          {
            id: crypto.randomUUID(),
            command,
            timestamp: now + 1,
            stateBefore,
            stateAfter,
          },
          {
            id: crypto.randomUUID(),
            command: "git add .",
            timestamp: now,
            stateBefore,
            stateAfter: stateBefore,
          },
          ...s.history,
        ],
      }));
    }, 1200);
  },

  clear: () => set({ history: [], ticker: { command: "", state: "idle" } }),
}));
