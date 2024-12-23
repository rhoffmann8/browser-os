import { MouseEventHandler, useCallback } from "react";
import { Box } from "../../components/Box";
import { useTaskbarStore } from "../../state/taskbarState";
import { Clock } from "./clock/Clock";
import { Network } from "./network/Network";
import { useTaskbarContextMenu } from "../../menu/hooks/useTaskbarContextMenu";
import { useContextMenuStore } from "../../state/contextMenuState";
import {
  TASKBAR_WIDGET_CLOCK,
  TASKBAR_WIDGET_NETWORK,
} from "../../constants/constants";

export function TaskbarWidgets() {
  const activeItems = useTaskbarStore((state) => state.activeItems);
  const showContextMenu = useContextMenuStore((state) => state.show);
  const taskbarMenuItems = useTaskbarContextMenu();

  const onContextMenu: MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      showContextMenu(taskbarMenuItems, { x: e.clientX, y: e.clientY - 60 });
      return false;
    },
    [showContextMenu, taskbarMenuItems]
  );

  return (
    <Box
      alignItems="center"
      style={{ fontFamily: "monospace", gap: 16 }}
      onContextMenu={onContextMenu}
    >
      {activeItems.has(TASKBAR_WIDGET_NETWORK) && <Network />}
      {activeItems.has(TASKBAR_WIDGET_CLOCK) && <Clock />}
    </Box>
  );
}
