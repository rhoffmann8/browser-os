import { css } from "@emotion/css";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  TASKBAR_WIDGET_CLOCK,
  TASKBAR_WIDGET_NETWORK,
} from "../../constants/constants";
import { ContextMenuItem } from "../../state/contextMenuState";
import { useTaskbarStore } from "../../state/taskbarState";
import { useWidgetStore } from "../../state/widgetState";
import { Widget } from "../../types/widget";

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
          Show date/time
        </div>
      ),
      onClick: () => toggleItem(TASKBAR_WIDGET_CLOCK),
    },
  ];
}

export function useTaskbarApplicationContextMenu(
  widget: Widget
): ContextMenuItem[] {
  const setWidgetPosition = useWidgetStore((state) => state.setWidgetPosition);
  const closeWidget = useWidgetStore((state) => state.closeWidget);

  return [
    {
      id: "taskbar-recenter-window",
      title: "Reset position",
      onClick: () => setWidgetPosition(widget.id, { x: 10, y: 10 }),
    },
    {
      id: "taskbar-close-window",
      title: "Close window",
      onClick: () => closeWidget(widget.id),
    },
  ];
}
