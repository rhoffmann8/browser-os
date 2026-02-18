import { UniqueIdentifier } from "@dnd-kit/core";
import { create } from "zustand";
import {
  DEFAULT_WINDOW_HEIGHT,
  DEFAULT_WINDOW_WIDTH,
  StorageKeys,
} from "../constants/constants";
import {
  Delta,
  Dimensions,
  Position,
  Widget,
  WidgetSettings,
} from "../types/widget";
import { Application } from "../types/application";
import { omitBy } from "../utils/array";
import { getStorageJSON } from "../utils/storage";

interface WidgetState {
  background: string;
  setBackground: (next: string) => void;

  widgets: Record<string, Widget>;
  setWidgets: (next: Record<string, Widget>) => void;

  setWidgetPosition: (id: string, next: Position) => void;
  setWidgetDimensions: (id: string, next: Dimensions) => void;
  addWidget: (params: WidgetSettings) => void;
  closeWidget: (id: string) => void;
  moveToTop: (id: string) => void;
  resizeWidget: (id: string, delta: Partial<Delta>) => void;
  closeAll: () => void;
  isActiveWidget: (id: string) => boolean;
  setWidgetApplication: <T extends Application>(
    id: string,
    application: T
  ) => void;
  setWidgetTitle: (id: string, title: string | undefined) => void;
  setWidgetFilePath: (id: string, path: string) => void;
}

let currentStackIndex = 0;
function getNewStackIndex() {
  return currentStackIndex++;
}

export function loadWidgets(): Record<string, Widget> {
  return (getStorageJSON(StorageKeys.WIDGETS) ?? {}) as Record<string, Widget>;
}

export const useWidgetStore = create<WidgetState>((set, get) => ({
  background:
    localStorage.getItem(StorageKeys.BACKGROUND) ??
    "var(--background-color-default)",
  setBackground: (next) => set({ background: next }),

  widgets: {},
  setWidgets: (next) => {
    const values = Object.values(next);
    currentStackIndex =
      values.length > 0
        ? Math.max(...values.map((w) => w.stackIndex))
        : 0;
    set({ widgets: next });
  },
  setWidgetDimensions: (id, dims) =>
    set((state) => ({
      widgets: {
        ...state.widgets,
        [id]: { ...state.widgets[id], dimensions: dims },
      },
    })),
  setWidgetPosition: (id, newPos) =>
    set((state) => ({
      widgets: {
        ...state.widgets,
        [id]: { ...state.widgets[id], position: newPos },
      },
    })),
  addWidget: (params) =>
    set((state) => {
      if (params.isSingleInstance) {
        const existingWidget = Object.values(state.widgets).find(
          (w) => w.applicationId === params.applicationId
        );
        if (existingWidget) {
          return {
            ...state,
            ...{
              widgets: {
                ...state.widgets,
                [existingWidget.id]: {
                  ...state.widgets[existingWidget.id],
                  ...moveToTop(state, existingWidget.id).widgets[
                    existingWidget.id
                  ],
                  filePath: params.filePath,
                },
              },
            },
          } as WidgetState;
        }
      }

      const id = crypto.randomUUID();
      return {
        widgets: {
          ...state.widgets,
          [id]: {
            ...params,
            id,
            stackIndex: getNewStackIndex(),
            dimensions: !params.dimensions
              ? undefined
              : {
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
        },
      };
    }),
  closeWidget: (id) =>
    set((state) => ({ widgets: omitBy(state.widgets, [id]) })),
  moveToTop: (id) => set((state) => moveToTop(state, id)),
  resizeWidget: (id, { left, top, x, y }) =>
    set((state) => ({
      widgets: {
        ...state.widgets,
        [id]: {
          ...state.widgets[id],
          position: {
            x: state.widgets[id].position.x - (left ?? 0),
            y: state.widgets[id].position.y - (top ?? 0),
          },
          dimensions: {
            width:
              (state.widgets[id].dimensions?.width ?? DEFAULT_WINDOW_WIDTH) +
              (x ?? 0),
            height:
              (state.widgets[id].dimensions?.height ?? DEFAULT_WINDOW_HEIGHT) +
              (y ?? 0),
          },
        },
      },
    })),
  closeAll: () => set({ widgets: {} }),
  isActiveWidget: (id) =>
    Object.values(get().widgets)
      .slice()
      .sort((a, b) => a.stackIndex - b.stackIndex)
      .slice(-1)?.[0]?.id === id,
  setWidgetApplication: (id, application) =>
    set((state) => ({
      widgets: {
        ...state.widgets,
        [id]: { ...state.widgets[id], application },
      },
    })),
  setWidgetTitle: (id, title) =>
    set((state) => ({
      widgets: { ...state.widgets, [id]: { ...state.widgets[id], title } },
    })),
  setWidgetFilePath: (id, path) =>
    set((state) => ({
      widgets: {
        ...state.widgets,
        [id]: {
          ...state.widgets[id],
          filePath: path,
        },
      },
    })),
}));

export const useAddWidget = () => useWidgetStore((state) => state.addWidget);
export const useSetWidgetDimensions = () =>
  useWidgetStore((state) => state.setWidgetDimensions);
export const useSetWidgetTitle = () =>
  useWidgetStore((state) => state.setWidgetTitle);
export const useSetWidgetFilePath = () =>
  useWidgetStore((state) => state.setWidgetFilePath);
export const useMoveWidgetToTop = () =>
  useWidgetStore((state) => state.moveToTop);
export const useCloseWidget = () =>
  useWidgetStore((state) => state.closeWidget);
export const useIsActiveWidget = () =>
  useWidgetStore((state) => state.isActiveWidget);

function moveToTop(state: WidgetState, id: UniqueIdentifier) {
  return {
    widgets: {
      ...state.widgets,
      [id]: { ...state.widgets[id], stackIndex: getNewStackIndex() },
    },
  };
}

useWidgetStore.subscribe((state) => {
  localStorage.setItem(StorageKeys.WIDGETS, JSON.stringify(state.widgets));
  localStorage.setItem(StorageKeys.BACKGROUND, state.background);
});
