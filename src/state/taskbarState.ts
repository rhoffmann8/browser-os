import { create } from "zustand";
import { getStorageJSON, toggleArrayItem } from "../utils";
import { TASKBAR_WIDGET_CLOCK, TASKBAR_WIDGET_NETWORK } from "../constants";

interface TaskbarState {
  activeItems: Set<string>;
  toggleItem: (id: string) => void;
}

export const useTaskbarStore = create<TaskbarState>((set) => ({
  activeItems: new Set(
    getStorageJSON("taskbar-active-items") ?? [
      TASKBAR_WIDGET_NETWORK,
      TASKBAR_WIDGET_CLOCK,
    ]
  ),

  toggleItem: (id: string) =>
    set((state) => ({
      activeItems: new Set(toggleArrayItem([...state.activeItems], id)),
    })),
}));

useTaskbarStore.subscribe((state) => {
  localStorage.setItem(
    "taskbar-active-items",
    JSON.stringify([...state.activeItems])
  );
});
