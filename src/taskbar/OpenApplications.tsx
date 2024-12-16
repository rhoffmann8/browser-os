import { css } from "@emotion/css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { Box } from "../components/Box";
import { useTaskbarApplicationContextMenu } from "../menu/useTaskbarContextMenu";
import { useContextMenuStore } from "../state/contextMenuState";
import { useDesktopStore } from "../state/desktopState";
import { Widget } from "../types";

const containerCss = css`
  background: transparent;
  transition: background 100ms ease-in-out;
  flex-wrap: nowrap;

  min-width: 60px;

  font-size: 14px;

  padding: 0 2px 0 8px;

  cursor: pointer;

  overflow: hidden;

  &:hover {
    background: #555 !important;
  }

  &.active {
    background: var(--color-theme-hover);
  }
`;

const closeButtonCss = css`
  border: none;
  background: transparent;
  transition: background 100ms ease-in-out;

  padding: 0 8px;
  font-size: 12px;

  &:hover {
    background: #da4949;
  }
`;

export function OpenApplications() {
  const windows = useDesktopStore((state) => state.widgets);

  return (
    <Box padding={"0 8px"} overflowY="hidden">
      {windows.map((w) => (
        <OpenApplication key={w.id} widget={w} />
      ))}
    </Box>
  );
}

function OpenApplication({ widget }: { widget: Widget }) {
  const { id, title } = widget;

  const moveToTop = useDesktopStore((state) => state.moveToTop);
  const isActiveWindow = useDesktopStore((state) => state.isActiveWidget);
  const showContextMenu = useContextMenuStore((state) => state.show);

  const menuItems = useTaskbarApplicationContextMenu(widget);

  return (
    <Box
      key={widget.id}
      gap={4}
      className={cx(containerCss, { active: isActiveWindow(id) })}
      onClick={() => moveToTop(id)}
      onContextMenu={(e) => {
        e.preventDefault();
        showContextMenu(menuItems, { x: e.clientX, y: e.clientY });
        return false;
      }}
    >
      <span style={{ alignSelf: "center" }}>{title}</span>
      <button
        className={closeButtonCss}
        onClick={(e) => {
          e.stopPropagation();
          widget.close();
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </Box>
  );
}
