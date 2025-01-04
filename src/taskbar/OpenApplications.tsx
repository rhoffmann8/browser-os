import { css } from "@emotion/css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { Box } from "../components/Box";
import { useTaskbarApplicationContextMenu } from "../menu/hooks/useTaskbarContextMenu";
import { useContextMenuStore } from "../state/contextMenuState";
import { useWidgetStore } from "../state/widgetState";
import { Widget } from "../types/widget";
import { getApplicationFromId } from "../types/application";

export function OpenApplications() {
  const widgets = useWidgetStore((state) => state.widgets);

  return (
    <Box padding={"0 8px"} overflowY="hidden">
      {Object.values(widgets).map((w) => (
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
  const { id, title, applicationId } = widget;
  const application = getApplicationFromId(applicationId);
  const showContextMenu = useContextMenuStore((state) => state.show);

  const isActiveWidget = useWidgetStore((state) => state.isActiveWidget);
  const moveToTop = useWidgetStore((state) => state.moveToTop);
  const close = useWidgetStore((state) => state.closeWidget);

  const menuItems = useTaskbarApplicationContextMenu(widget);
  const fullTitle = `${title ? `${title} - ` : ""}${application.title}`;

  return (
    <Box
      key={widget.id}
      title={fullTitle}
      gap={8}
      className={cx(containerCss, { active: isActiveWidget(id) })}
      onClick={() => moveToTop(id)}
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
          close(id);
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </Box>
  );
}
