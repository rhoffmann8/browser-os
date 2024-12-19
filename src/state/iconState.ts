import { UniqueIdentifier } from "@dnd-kit/core";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { create } from "zustand";
import { DesktopIcon, Position } from "../types";
import { createDefaultIcons, DEFAULT_ICONS, StorageKeys } from "../constants";
import { getStorageJSON } from "../utils/storage";
import { faNoteSticky } from "@fortawesome/free-solid-svg-icons";

interface IconState {
  icons: DesktopIcon[];
  selectedIcons: Set<UniqueIdentifier>;
  addIcon: (icon: DesktopIcon) => void;
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
      } as DesktopIcon)
  );
}

export const useIconStore = create<IconState>((set) => ({
  icons: (getStorageJSON(StorageKeys.ICONS) ?? DEFAULT_ICONS).concat(
    getNoteIcons()
  ),
  selectedIcons: new Set(),
  addIcon: (icon) => set((state) => ({ icons: state.icons.concat(icon) })),
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
        icons: state.icons
          .filter((i) => i.id !== id)
          .concat({ ...icon, position: newPosition }),
      };
    }),
  updateIconImage: (id, newImage) =>
    set((state) => {
      const icon = state.icons.find((i) => i.id === id);
      if (!icon) return state;
      return {
        icons: state.icons
          .filter((i) => i.id !== id)
          .concat({ ...icon, icon: newImage }),
      };
    }),
  resetIconsToDefault: () =>
    set({ icons: createDefaultIcons().concat(getNoteIcons()) }),
}));

useIconStore.subscribe((state) => {
  localStorage.setItem(StorageKeys.ICONS, JSON.stringify(state.icons));
});
