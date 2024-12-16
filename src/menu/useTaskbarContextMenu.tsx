import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContextMenuItem } from "../state/contextMenuState";
import { useTaskbarStore } from "../state/taskbarState";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/css";
import { useDesktopStore } from "../state/desktopState";
import { UniqueIdentifier } from "@dnd-kit/core";
import { TASKBAR_WIDGET_CLOCK, TASKBAR_WIDGET_NETWORK } from "../constants";

const taskbarItemCss = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export function useTaskbarContextMenu(): ContextMenuItem[] {
  const { activeItems, toggleItem } = useTaskbarStore();

  return [
    {
      id: TASKBAR_WIDGET_NETWORK,
      title: (
        <div className={taskbarItemCss}>
          {activeItems.has(TASKBAR_WIDGET_NETWORK) && (
            <FontAwesomeIcon icon={faCheck} />
          )}
          Show IP address
        </div>
      ),
      onClick: () => toggleItem(TASKBAR_WIDGET_NETWORK),
    },
    {
      id: TASKBAR_WIDGET_CLOCK,
      title: (
        <div className={taskbarItemCss}>
          {activeItems.has(TASKBAR_WIDGET_CLOCK) && (
            <FontAwesomeIcon icon={faCheck} />
          )}
          Show time/date
        </div>
      ),
      onClick: () => toggleItem(TASKBAR_WIDGET_CLOCK),
    },
  ];
}

export function useTaskbarApplicationContextMenu(
  id: UniqueIdentifier
): ContextMenuItem[] {
  const setWindowPosition = useDesktopStore((state) => state.setWindowPosition);
  const closeWindow = useDesktopStore((state) => state.closeWindow);

  return [
    {
      id: "taskbar-recenter-window",
      title: "Reset position",
      onClick: () => setWindowPosition(id, { x: 10, y: 10 }),
    },
    {
      id: "taskbar-close-window",
      title: "Close window",
      onClick: () => closeWindow(id),
    },
  ];
}
