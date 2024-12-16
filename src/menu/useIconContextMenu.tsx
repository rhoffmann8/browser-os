import { ContextMenuItem } from "../state/contextMenuState";
import { useIconStore } from "../state/iconState";
import * as faIcons from "@fortawesome/free-regular-svg-icons";

const allIcons = Object.keys(faIcons)
  .filter((key) => key !== "fas" && key !== "prefix")
  .map((icon) => (faIcons as any)[icon]);

export function useIconContextMenu(): ContextMenuItem[] {
  const selectedIcons = useIconStore((state) => state.selectedIcons);
  const updateIconImage = useIconStore((state) => state.updateIconImage);

  return [
    // { id: "icon-rename", title: "Rename", onClick: () => {} },
    {
      id: "icon-randomize-icon",
      title: "Randomize icon",
      onClick: () => {
        Array.from(selectedIcons).map((iconId) =>
          updateIconImage(
            iconId,
            allIcons[Math.floor(Math.random() * allIcons.length)]
          )
        );
      },
    },
  ];
}
