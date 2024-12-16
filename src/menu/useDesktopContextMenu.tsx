import { useDesktopStore } from "../state/desktopState";
import { useIconStore } from "../state/iconState";
import { randomRgba } from "../utils";

export function useDesktopContextMenu() {
  const setBackground = useDesktopStore((state) => state.setBackground);
  const closeAll = useDesktopStore((state) => state.closeAll);
  const resetIconsToDefault = useIconStore(
    (state) => state.resetIconsToDefault
  );

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
      id: "close-all-windows",
      title: "Close all windows",
      onClick: closeAll,
    },
  ];
}
