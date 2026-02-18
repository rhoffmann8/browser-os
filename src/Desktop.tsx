import { css } from "@emotion/css";
import {
  DragEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  DESKTOP_ICON_HORIZONTAL_DELTA,
  DESKTOP_ICON_VERTICAL_DELTA,
} from "./constants/icons";
import { IconDroppableContext } from "./droppable/IconDroppableContext";
import { WidgetDroppableContext } from "./droppable/WidgetDroppableContext";
import { Draggable } from "./components/Draggable";
import { useDesktopContextMenu } from "./menu/hooks/useDesktopContextMenu";
import { useContextMenuStore } from "./state/contextMenuState";
import { loadWidgets, useWidgetStore } from "./state/widgetState";
import { useIconStore } from "./state/iconState";
import { Widget } from "./widget/Widget";
import { DesktopIcon } from "./icon/DesktopIcon";

const desktopCss = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;

  overflow: hidden;
`;

export function Desktop() {
  const widgets = useWidgetStore((state) => state.widgets);
  const setWidgets = useWidgetStore((state) => state.setWidgets);
  const background = useWidgetStore((state) => state.background);
  const icons = useIconStore((state) => state.icons);
  const selectedIcons = useIconStore((state) => state.selectedIcons);
  const setIconPosition = useIconStore((state) => state.setIconPosition);
  const showContextMenu = useContextMenuStore((state) => state.show);
  const addWidget = useWidgetStore((state) => state.addWidget);

  useEffect(() => {
    setWidgets(loadWidgets());
  }, [setWidgets]);

  const desktopRef = useRef<HTMLDivElement>(null);
  const desktopContextMenuItems = useDesktopContextMenu(desktopRef.current);

  const onViewportContextMenu: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      showContextMenu(desktopContextMenuItems, { x: e.pageX, y: e.pageY });
      return false;
    },
    [desktopContextMenuItems, showContextMenu]
  );

  useEffect(() => {
    const listener = () => {
      const currentDesktop = desktopRef.current;
      if (!currentDesktop) return;
      icons.forEach((icon) => {
        setIconPosition(icon.id, {
          x: Math.min(
            icon.position.x,
            currentDesktop.clientWidth - DESKTOP_ICON_HORIZONTAL_DELTA
          ),
          y: Math.min(
            icon.position.y,
            currentDesktop.clientHeight - DESKTOP_ICON_VERTICAL_DELTA
          ),
        });
      });
    };
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [icons, setIconPosition]);

  const { onDrop, onDragOver } = useExternalDroppable();

  const selectIcon = useIconStore((state) => state.selectIcon);

  return (
    <div
      ref={desktopRef}
      className={desktopCss}
      style={{ background }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <IconDroppableContext onContextMenu={onViewportContextMenu}>
        {icons.map((icon) => (
          <Draggable
            key={icon.id}
            id={icon.id}
            left={icon.position.x}
            top={icon.position.y}
          >
            <DesktopIcon
              icon={icon}
              selected={selectedIcons.has(icon.id)}
              onClick={selectIcon}
              onDoubleClick={addWidget}
            />
          </Draggable>
        ))}

        <WidgetDroppableContext>
          {Object.values(widgets).map((widget) => (
            <Widget key={widget.id} widget={widget} />
          ))}
        </WidgetDroppableContext>
      </IconDroppableContext>

      <div style={{ position: "absolute", bottom: 0, left: 4 }}>
        OS Version 0.0.1
      </div>
    </div>
  );
}

/** Prevents default drag/drop; file drop onto desktop is not implemented. */
function useExternalDroppable() {
  const onDrop: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
  }, []);

  return { onDragOver, onDrop };
}
