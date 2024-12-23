import { UniqueIdentifier } from "@dnd-kit/core";
import { create } from "zustand";
import {
  DEFAULT_WINDOW_HEIGHT,
  DEFAULT_WINDOW_WIDTH,
  StorageKeys,
} from "../constants/constants";
import { Delta, Dimensionable, Position, Widget, WidgetParams } from "../types";
import { getStorageJSON } from "../utils/storage";
import { updateItemInArray } from "../utils/array";
import { Application } from "../types/application";

interface DesktopState {
  background: string;
  setBackground: (next: string) => void;

  widgets: Widget<Application>[];
  setWidgetPosition: (id: UniqueIdentifier, next: Position) => void;
  setWidgetDimensions: (
    id: UniqueIdentifier,
    next: Dimensionable["dimensions"]
  ) => void;
  addWidget: <A extends Application>(params: WidgetParams<A>) => void;
  closeWidget: (id: UniqueIdentifier) => void;
  moveToTop: (id: UniqueIdentifier) => void;
  resizeWidget: (id: UniqueIdentifier, delta: Partial<Delta>) => void;
  closeAll: () => void;
  isActiveWidget: (id: UniqueIdentifier) => boolean;
  setWidgetApplication: <T extends Application>(
    id: UniqueIdentifier,
    application: T
  ) => void;
  setWidgetTitle: (id: UniqueIdentifier, title: string | undefined) => void;
}

let currentStackIndex = 0;
function getNewStackIndex() {
  return currentStackIndex++;
}

function loadWidgets(getState: () => DesktopState): Widget<Application>[] {
  const widgets: (WidgetParams<Application> &
    Pick<Widget<Application>, "id" | "stackIndex">)[] =
    getStorageJSON(StorageKeys.WIDGETS) ?? [];
  currentStackIndex = widgets.length
    ? Math.max(...widgets.map((w) => w.stackIndex))
    : 0;
  return widgets.map((w) => enrichWidgetWithMethods(w, getState));
}

function enrichWidgetWithMethods<
  A extends Application,
  T extends WidgetParams<A> & Pick<Widget<A>, "id" | "stackIndex">
>(widget: T, get: () => DesktopState): Widget<A> {
  return {
    ...widget,
    isActive: () => get().isActiveWidget(widget.id),
    resize: (dims) => get().setWidgetDimensions(widget.id, dims),
    close: () => get().closeWidget(widget.id),
    setTitle: (title) => get().setWidgetTitle(widget.id, title),
    setPosition: (position) => get().setWidgetPosition(widget.id, position),
    setApplication: (next) => get().setWidgetApplication(widget.id, next),
    moveToTop: () => get().moveToTop(widget.id),
  };
}

export const useDesktopStore = create<DesktopState>((set, get) => ({
  background:
    localStorage.getItem(StorageKeys.BACKGROUND) ??
    "var(--background-color-default)",
  widgets: loadWidgets(get),
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
      if (params.application.singleInstance) {
        const existingWidget = state.widgets.find(
          (w) => w.application.id === params.application.id
        );
        if (existingWidget) {
          return moveToTop(state, existingWidget.id);
        }
      }

      const id = crypto.randomUUID();
      return {
        widgets: state.widgets.concat(
          enrichWidgetWithMethods(
            {
              ...params,
              id,
              stackIndex: getNewStackIndex(),
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
            },
            () => state
          )
        ),
      };
    }),
  closeWidget: (id) =>
    set((state) => ({ widgets: state.widgets.filter((w) => w.id !== id) })),
  moveToTop: (id) => set((state) => moveToTop(state, id)),
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
  setWidgetApplication: (id, application) =>
    set((state) => ({
      widgets: updateItemInArray(state.widgets, id, (item) => ({
        ...item,
        application,
      })),
    })),
  setWidgetTitle: (id, title) =>
    set((state) => ({
      widgets: updateItemInArray(state.widgets, id, (item) => ({
        ...item,
        title,
      })),
    })),
}));

function moveToTop(state: DesktopState, id: UniqueIdentifier) {
  return {
    widgets: updateItemInArray(state.widgets, id, (item) => ({
      ...item,
      stackIndex: getNewStackIndex(),
    })),
  };
}

useDesktopStore.subscribe((state) => {
  localStorage.setItem(StorageKeys.WIDGETS, JSON.stringify(state.widgets));
  localStorage.setItem(StorageKeys.BACKGROUND, state.background);
});
