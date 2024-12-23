import { useDesktopStore } from "../../state/desktopState";
import { useIconStore } from "../../state/iconState";
import { randomRgba } from "../../utils/style";

export function useDesktopContextMenu(desktopEl: HTMLDivElement | null) {
  const setBackground = useDesktopStore((state) => state.setBackground);
  const closeAll = useDesktopStore((state) => state.closeAll);
  const autoLayout = useIconStore((state) => state.autoLayout);
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
      id: "icons-auto-layout",
      title: "Auto layout items",
      onClick: () => autoLayout(desktopEl),
    },
    {
      id: "close-all-windows",
      title: "Close all windows",
      onClick: closeAll,
    },
    {
      id: "reset-application-state",
      title: "Reset all saved state",
      onClick: () => {
        localStorage.clear();
        window.location.reload();
      },
    },
  ].filter((i) => i.id !== "icons-auto-layout");
}
