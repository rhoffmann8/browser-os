import { useCallback } from "react";
import { useDesktopStore } from "../state/desktopState";
import { randomRgba } from "../utils";
import {
  DEFAULT_TEXT_EDITOR,
  DEFAULT_WINDOW_HEIGHT,
  DEFAULT_WINDOW_WIDTH,
} from "../constants";
import { useIconStore } from "../state/iconState";

export function useDesktopContextMenu() {
  const setBackground = useDesktopStore((state) => state.setBackground);
  const addWindow = useDesktopStore((state) => state.addWidget);
  const closeAll = useDesktopStore((state) => state.closeAll);
  const resetIconsToDefault = useIconStore(
    (state) => state.resetIconsToDefault
  );

  const openTestWindow = useCallback(() => {
    addWindow({
      title: "Test",
      position: { x: Math.random() * 50, y: Math.random() * 50 },
      dimensions: {
        height: DEFAULT_WINDOW_HEIGHT,
        width: DEFAULT_WINDOW_WIDTH,
      },
      application: DEFAULT_TEXT_EDITOR,
    });
  }, [addWindow]);

  return [
    {
      id: "randomize-background",
      title: "Randomize background",
      onClick: () =>
        setBackground(
          `linear-gradient(${randomRgba(0.5)}, ${randomRgba(0.75)})`
        ),
    },
    {
      id: "icon-reset-defaults",
      title: "Reset icons to default",
      onClick: resetIconsToDefault,
    },
    {
      id: "open-test-window",
      title: "Open test window",
      onClick: openTestWindow,
    },
    {
      id: "close-all-windows",
      title: "Close all windows",
      onClick: closeAll,
    },
  ];
}
