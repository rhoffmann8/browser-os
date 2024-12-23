export const DEFAULT_WINDOW_HEIGHT = 300;
export const DEFAULT_WINDOW_WIDTH = 400;

export const TASKBAR_WIDGET_NETWORK = "taskbar-network";
export const TASKBAR_WIDGET_CLOCK = "taskbar-clock";

export enum StorageKeys {
  WIDGETS = "desktop-widgets",
  BACKGROUND = "desktop-background",
  ICONS = "icons",
  TASKBAR_ACTIVE_ITEMS = "taskbar-active-items",
  NOTES = "notes",
}

export enum ZIndex {
  StartMenu = 9998,
  Taskbar = 9999,
  ContextMenu = 10000,
  PowerOverlay = 10001,
  Toast = 10002,
}
