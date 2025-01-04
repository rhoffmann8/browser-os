import { UniqueIdentifier } from "@dnd-kit/core";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { create } from "zustand";
import { StorageKeys } from "../constants/constants";
import {
  createDefaultIcons,
  DESKTOP_ICON_HORIZONTAL_DELTA,
  DESKTOP_ICON_VERTICAL_DELTA,
} from "../constants/icons";
import { DesktopIcon, Position } from "../types/widget";
import { updateItemInArray } from "../utils/array";
import { getStorageJSON } from "../utils/storage";

interface IconState {
  icons: DesktopIcon[];
  setIcons: (icons: DesktopIcon[]) => void;
  selectedIcons: Set<UniqueIdentifier>;
  autoLayout: (container: HTMLDivElement | null) => void;
  addIcon: (icon: DesktopIcon) => void;
  selectIcon: (id: UniqueIdentifier, append: boolean) => void;
  unselectIcon: (id: UniqueIdentifier, unappend: boolean) => void;
  unselectAll: () => void;
  setIconPosition: (id: UniqueIdentifier, position: Position) => void;
  updateIconImage: (id: UniqueIdentifier, image: IconDefinition) => void;
  resetIconsToDefault: () => void;
}

function autoLayoutIcons(container: HTMLDivElement, icons: DesktopIcon[]) {
  const rows = Math.floor(container.clientHeight / 90);
  const columns = Math.floor(container.clientWidth / 80);

  const ret: DesktopIcon[] = [];
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
  icons: getStorageJSON(StorageKeys.ICONS) ?? [],
  setIcons: (icons) => set({ icons }),
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
  resetIconsToDefault: () => set({ icons: createDefaultIcons() }),
}));

useIconStore.subscribe((state) => {
  localStorage.setItem(StorageKeys.ICONS, JSON.stringify(state.icons));
});
