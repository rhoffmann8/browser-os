import { UniqueIdentifier } from "@dnd-kit/core";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { create } from "zustand";
import { DesktopIcon, Position } from "../types";
import { StorageKeys } from "../constants/constants";
import {
  DEFAULT_ICONS,
  DESKTOP_ICON_HORIZONTAL_DELTA,
  DESKTOP_ICON_VERTICAL_DELTA,
} from "../constants/icons";
import { createDefaultIcons } from "../constants/icons";
import { getStorageJSON } from "../utils/storage";
import { faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { updateItemInArray } from "../utils/array";
import { Application } from "../types/application";

interface IconState {
  icons: DesktopIcon<Application>[];
  selectedIcons: Set<UniqueIdentifier>;
  autoLayout: (container: HTMLDivElement | null) => void;
  addIcon: (icon: DesktopIcon<Application>) => void;
  selectIcon: (id: UniqueIdentifier, append: boolean) => void;
  unselectIcon: (id: UniqueIdentifier, unappend: boolean) => void;
  unselectAll: () => void;
  setIconPosition: (id: UniqueIdentifier, position: Position) => void;
  updateIconImage: (id: UniqueIdentifier, image: IconDefinition) => void;
  resetIconsToDefault: () => void;
}

// TODO: Need pointers to files
function getNoteIcons() {
  return [];

  return (getStorageJSON(StorageKeys.NOTES) as any[]).map(
    (note, idx) =>
      ({
        id: crypto.randomUUID(),
        title: note.title,
        application: {
          id: "text-editor",
          params: { activeFile: note },
        },
        icon: faNoteSticky,
        position: { x: 300, y: idx * 90 + 10 },
        widget: {
          application: {
            id: "text-editor",
            params: { activeFile: note },
          },
          dimensions: { height: 300, width: 500 },
          position: { x: 100, y: 100 },
        },
      } as DesktopIcon<Application>)
  );
}

function autoLayoutIcons(
  container: HTMLDivElement,
  icons: DesktopIcon<Application>[]
) {
  const rows = Math.floor(container.clientHeight / 90);
  const columns = Math.floor(container.clientWidth / 80);

  const ret: DesktopIcon<Application>[] = [];
  let currIconIndex = 0;
  for (let j = 0; currIconIndex < icons.length && j < columns; j++) {
    for (let i = 0; currIconIndex < icons.length && i < rows; i++) {
      ret.push({
        ...icons[currIconIndex],
        position: {
          x: 10 + j * DESKTOP_ICON_VERTICAL_DELTA,
          y: 10 + i * DESKTOP_ICON_HORIZONTAL_DELTA,
        },
      });
      currIconIndex++;
    }
  }

  return ret;
}

export const useIconStore = create<IconState>((set) => ({
  icons: (getStorageJSON(StorageKeys.ICONS) ?? DEFAULT_ICONS).concat(
    getNoteIcons()
  ),
  selectedIcons: new Set(),
  addIcon: (icon) => set((state) => ({ icons: state.icons.concat(icon) })),
  autoLayout: (container: HTMLDivElement | null) =>
    set((state) =>
      !container ? state : { icons: autoLayoutIcons(container, state.icons) }
    ),
  selectIcon: (id, append) =>
    set((state) => ({
      selectedIcons: append
        ? new Set([...state.selectedIcons, id])
        : new Set([id]),
    })),
  unselectIcon: (id) =>
    set((state) => {
      const icons = new Set(state.selectedIcons);
      icons.delete(id);
      return { selectedIcons: icons };
    }),
  unselectAll: () => set({ selectedIcons: new Set() }),
  setIconPosition: (id, newPosition) =>
    set((state) => {
      const icon = state.icons.find((i) => i.id === id);
      if (!icon) return state;
      return {
        icons: updateItemInArray(state.icons, id, (item) => ({
          ...item,
          position: newPosition,
        })),
      };
    }),
  updateIconImage: (id, newImage) =>
    set((state) => {
      const icon = state.icons.find((i) => i.id === id);
      if (!icon) return state;
      return {
        icons: updateItemInArray(state.icons, id, (item) => ({
          ...item,
          icon: newImage,
        })),
      };
    }),
  resetIconsToDefault: () =>
    set({ icons: createDefaultIcons().concat(getNoteIcons()) }),
}));

useIconStore.subscribe((state) => {
  localStorage.setItem(StorageKeys.ICONS, JSON.stringify(state.icons));
});
