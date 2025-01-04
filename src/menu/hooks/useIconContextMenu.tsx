import { ContextMenuItem } from "../../state/contextMenuState";
import { fsAsync, getFileType } from "../../system/utils/fs";
import { DesktopIcon } from "../../types/widget";

export function useIconContextMenu(icon: DesktopIcon): ContextMenuItem[] {
  return [
    ...(getFileType(icon.widget.filePath)
      ? [
          {
            id: "icon-delete",
            title: "Delete",
            onClick: async () => {
              fsAsync.deleteFile(icon.widget.filePath!);
            },
          },
        ]
      : []),
  ];
}
