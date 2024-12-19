import { css } from "@emotion/css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { Box } from "../components/Box";
import { useTaskbarApplicationContextMenu } from "../menu/useTaskbarContextMenu";
import { useContextMenuStore } from "../state/contextMenuState";
import { useDesktopStore } from "../state/desktopState";
import { Widget } from "../types";
import { APPLICATION_MAP } from "../application";

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

const containerCss = css`
  flex-wrap: nowrap;
  background: transparent;
  transition: background 100ms ease-in-out;

  min-width: 60px;
  max-width: 120px;
  padding: 0 0 0 8px;

  cursor: pointer;
  overflow: hidden;

  &:hover {
    background: #555 !important;
  }

  &.active {
    background: var(--color-theme-hover);
  }
`;

const textCss = css`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 0.8rem;
`;

const closeButtonCss = css`
  border: none;
  background: transparent;
  transition: background 100ms ease-in-out;

  padding: 0 8px;
  font-size: 0.8rem;

  &:hover {
    background: #da4949;
  }
`;

function OpenApplication({ widget }: { widget: Widget }) {
  const { title, application } = widget;

  const showContextMenu = useContextMenuStore((state) => state.show);

  const menuItems = useTaskbarApplicationContextMenu(widget);
  const fullTitle = `${title ? `${title} - ` : ""}${
    APPLICATION_MAP[application.id].title
  }`;

  return (
    <Box
      key={widget.id}
      title={fullTitle}
      gap={8}
      className={cx(containerCss, { active: widget.isActive() })}
      onClick={() => widget.moveToTop()}
      onContextMenu={(e) => {
        e.preventDefault();
        showContextMenu(menuItems, { x: e.clientX, y: e.clientY });
        return false;
      }}
    >
      <span className={textCss} style={{ alignSelf: "center" }}>
        {fullTitle}
      </span>
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
