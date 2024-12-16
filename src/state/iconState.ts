import { UniqueIdentifier } from "@dnd-kit/core";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { create } from "zustand";
import { Icon, Position } from "../types";
import { getStorageJSON } from "../utils";
import { DEFAULT_ICONS } from "../constants";

interface IconState {
  icons: Icon[];
  selectedIcons: Set<UniqueIdentifier>;
  addIcon: (icon: Icon) => void;
  selectIcon: (id: UniqueIdentifier, append: boolean) => void;
  unselectIcon: (id: UniqueIdentifier, unappend: boolean) => void;
  unselectAll: () => void;
  setIconPosition: (id: UniqueIdentifier, position: Position) => void;
  updateIconImage: (id: UniqueIdentifier, image: IconDefinition) => void;
  resetIconsToDefault: () => void;
}

export const useIconStore = create<IconState>((set) => ({
  icons: getStorageJSON("icons") ?? DEFAULT_ICONS,
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
  resetIconsToDefault: () => set({ icons: DEFAULT_ICONS }),
}));

useIconStore.subscribe((state) => {
  localStorage.setItem("icons", JSON.stringify(state.icons));
});
