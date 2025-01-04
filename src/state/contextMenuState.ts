import { create } from "zustand";
import { Position } from "../types/widget";
import { ReactNode } from "react";

export type ContextMenuItem = {
  id: string;
  title: ReactNode;
  disabled?: boolean;
  onClick: (...args: any[]) => any;
};

interface ContextMenuState {
  items: ContextMenuItem[];

  position: Position;
  visible: boolean;

  show: (items: ContextMenuItem[], pos: Position) => void;
  hide: () => void;
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
  items: [],

  position: { x: 0, y: 0 },
  visible: false,

  show: (items: ContextMenuItem[], position) =>
    set({ items, visible: true, position }),
  hide: () => set({ visible: false }),
}));
