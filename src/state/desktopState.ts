import { UniqueIdentifier } from "@dnd-kit/core";
import { create } from "zustand";
import {
  DEFAULT_WINDOW_HEIGHT,
  DEFAULT_WINDOW_WIDTH,
  STORAGE_KEYS,
} from "../constants";
import { Delta, Dimensionable, Position, Widget, WidgetParams } from "../types";
import { getStorageJSON, updateItemInArray } from "../utils";

interface DesktopState {
  background: string;
  setBackground: (next: string) => void;

  widgets: Widget[];
  setWidgetPosition: (id: UniqueIdentifier, next: Position) => void;
  setWidgetDimensions: (
    id: UniqueIdentifier,
    next: Dimensionable["dimensions"]
  ) => void;
  addWidget: (params: WidgetParams) => void;
  closeWidget: (id: UniqueIdentifier) => void;
  moveToTop: (id: UniqueIdentifier) => void;
  resizeWidget: (id: UniqueIdentifier, delta: Partial<Delta>) => void;
  closeAll: () => void;
  isActiveWidget: (id: UniqueIdentifier) => boolean;
}

let currentStackIndex = 0;
function getNewStackIndex() {
  return currentStackIndex++;
}
export const useDesktopStore = create<DesktopState>((set, get) => ({
  background:
    localStorage.getItem(STORAGE_KEYS.background) ??
    "var(--background-color-default)",
  widgets: ((getStorageJSON(STORAGE_KEYS.widgets) ?? []) as Widget[]).map(
    (w) => ({
      ...w,
      resize: (dims: Dimensionable["dimensions"]) =>
        get().setWidgetDimensions(w.id, dims),
      close: () => get().closeWidget(w.id),
    })
  ),
  setWidgetDimensions: (id, dims) =>
    set((state) => ({
      widgets: updateItemInArray(state.widgets, id, (item) => ({
        ...item,
        dimensions: dims,
      })),
    })),
  setWidgetPosition: (id, newPos) =>
    set((state) => ({
      widgets: updateItemInArray(state.widgets, id, (item) => ({
        ...item,
        position: newPos,
      })),
    })),
  setBackground: (next) => set({ background: next }),
  addWidget: (params) =>
    set((state) => {
      const id = crypto.randomUUID();
      return {
        widgets: state.widgets.concat({
          ...params,
          id,
          dimensions: {
            width:
              typeof params.dimensions?.width === "number"
                ? Math.min(
                    params.dimensions?.width ?? Infinity,
                    window.innerWidth
                  )
                : undefined,
            height:
              typeof params.dimensions?.height === "number"
                ? Math.min(
                    params.dimensions?.height ?? Infinity,
                    window.innerHeight
                  )
                : undefined,
          },
          stackIndex: getNewStackIndex(),
          resize: (dims: Dimensionable["dimensions"]) =>
            state.setWidgetDimensions(id, dims),
          close: () => state.closeWidget(id),
        }),
      };
    }),
  closeWidget: (id) =>
    set((state) => ({ widgets: state.widgets.filter((w) => w.id !== id) })),
  moveToTop: (id) =>
    set((state) => ({
      widgets: updateItemInArray(state.widgets, id, (item) => ({
        ...item,
        stackIndex: getNewStackIndex(),
      })),
    })),
  resizeWidget: (id, { left, top, x, y }) =>
    set((state) => ({
      widgets: updateItemInArray(state.widgets, id, (item) => ({
        ...item,
        position: {
          x: item.position.x - (left ?? 0),
          y: item.position.y - (top ?? 0),
        },
        dimensions: {
          width: (item.dimensions?.width ?? DEFAULT_WINDOW_WIDTH) + (x ?? 0),
          height: (item.dimensions?.height ?? DEFAULT_WINDOW_HEIGHT) + (y ?? 0),
        },
      })),
    })),
  closeAll: () => set({ widgets: [] }),
  isActiveWidget: (id) =>
    get()
      .widgets.slice()
      .sort((a, b) => a.stackIndex - b.stackIndex)
      .slice(-1)?.[0]?.id === id,
}));

useDesktopStore.subscribe((state) => {
  localStorage.setItem(STORAGE_KEYS.widgets, JSON.stringify(state.widgets));
  localStorage.setItem(STORAGE_KEYS.background, state.background);
});
