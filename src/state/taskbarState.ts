import { create } from "zustand";
import {
  StorageKeys,
  TASKBAR_WIDGET_CLOCK,
  TASKBAR_WIDGET_NETWORK,
} from "../constants/constants";
import { getStorageJSON } from "../utils/storage";
import { toggleArrayItem } from "../utils/array";

interface TaskbarState {
  activeItems: Set<string>;
  toggleItem: (id: string) => void;
}

export const useTaskbarStore = create<TaskbarState>((set) => ({
  activeItems: new Set(
    getStorageJSON(StorageKeys.TASKBAR_ACTIVE_ITEMS) ?? [
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
    StorageKeys.TASKBAR_ACTIVE_ITEMS,
    JSON.stringify([...state.activeItems])
  );
});
