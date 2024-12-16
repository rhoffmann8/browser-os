import { create } from "zustand";
import { Delta, DesktopWindow, Position } from "../types";
import { UniqueIdentifier } from "@dnd-kit/core";
import { getStorageJSON, updateItemInArray } from "../utils";
import { DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH } from "../constants";

interface DesktopState {
  background: string;
  windows: DesktopWindow[];
  setBackground: (next: string) => void;
  setWindowPosition: (id: UniqueIdentifier, next: Position) => void;
  addWindow: (newWindow: Omit<DesktopWindow, "id" | "stackIndex">) => void;
  closeWindow: (id: UniqueIdentifier) => void;
  moveToTop: (id: UniqueIdentifier) => void;
  resizeWindow: (id: UniqueIdentifier, delta: Partial<Delta>) => void;
  closeAll: () => void;
  isActiveWindow: (id: UniqueIdentifier) => boolean;
}

let currentStackIndex = 0;
function getNewStackIndex() {
  return currentStackIndex++;
}
export const useDesktopStore = create<DesktopState>((set, get) => ({
  background: localStorage.getItem("background") ?? "#000",
  windows: getStorageJSON("windows") ?? [],
  setWindowPosition: (id, newPos) =>
    set((state) => ({
      windows: updateItemInArray(state.windows, id, (item) => ({
        ...item,
        position: newPos,
      })),
    })),
  setBackground: (next) => set({ background: next }),
  addWindow: (newWindow) =>
    set((state) => ({
      windows: state.windows.concat({
        ...newWindow,
        id: crypto.randomUUID(),
        width: Math.min(newWindow.width, window.innerWidth),
        height: Math.min(newWindow.height, window.innerHeight - 60),
        stackIndex: getNewStackIndex(),
      }),
    })),
  closeWindow: (id) =>
    set((state) => ({ windows: state.windows.filter((w) => w.id !== id) })),
  moveToTop: (id) =>
    set((state) => ({
      windows: updateItemInArray(state.windows, id, (item) => {
        item.stackIndex = getNewStackIndex();
        return item;
      }),
    })),
  resizeWindow: (id, { left, top, x, y }) =>
    set((state) => ({
      windows: updateItemInArray(state.windows, id, (item) => ({
        ...item,
        position: {
          x: item.position.x - (left ?? 0),
          y: item.position.y - (top ?? 0),
        },
        width: (item.width ?? DEFAULT_WINDOW_WIDTH) + (x ?? 0),
        height: (item.height ?? DEFAULT_WINDOW_HEIGHT) + (y ?? 0),
      })),
    })),
  closeAll: () => set({ windows: [] }),
  isActiveWindow: (id) =>
    get().windows.find((w) => w.id === id)?.stackIndex ===
    currentStackIndex - 1,
}));

useDesktopStore.subscribe((state) => {
  localStorage.setItem("windows", JSON.stringify(state.windows));
  localStorage.setItem("background", state.background);
});
