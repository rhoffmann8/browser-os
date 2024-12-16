import { css } from "@emotion/css";
import { MouseEventHandler, useCallback, useEffect, useRef } from "react";
import { IconDroppableContext } from "./droppable/IconDroppableContext";
import { WidgetDroppableContext } from "./droppable/WidgetDroppableContext";
import { DraggableIcon } from "./icon/DraggableIcon";
import { useDesktopContextMenu } from "./menu/useDesktopContextMenu";
import { useIconContextMenu } from "./menu/useIconContextMenu";
import { useContextMenuStore } from "./state/contextMenuState";
import { useDesktopStore } from "./state/desktopState";
import { useIconStore } from "./state/iconState";
import { Widget } from "./widget/Widget";

const desktopCss = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;

  overflow: hidden;
`;

export function Desktop() {
  const background = useDesktopStore((state) => state.background);
  const icons = useIconStore((state) => state.icons);
  const selectedIcons = useIconStore((state) => state.selectedIcons);
  const showContextMenu = useContextMenuStore((state) => state.show);
  const windows = useDesktopStore((state) => state.widgets);

  const desktopContextMenuItems = useDesktopContextMenu();
  const iconContextMenuItems = useIconContextMenu();

  useGlobalErrorHandling();

  const onContextMenu = useCallback(
    (pos: { x: number; y: number }) => {
      showContextMenu(iconContextMenuItems, pos);
    },
    [iconContextMenuItems, showContextMenu]
  );

  const onViewportContextMenu: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      showContextMenu(desktopContextMenuItems, { x: e.pageX, y: e.pageY });
      return false;
    },
    [desktopContextMenuItems, showContextMenu]
  );

  const desktopRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={desktopRef} className={desktopCss} style={{ background }}>
      <IconDroppableContext onContextMenu={onViewportContextMenu}>
        {icons.map((icon) => (
          <DraggableIcon
            key={icon.id}
            icon={icon}
            selected={selectedIcons.has(icon.id)}
            onContextMenu={onContextMenu}
          />
        ))}

        <WidgetDroppableContext
          parentRect={desktopRef.current?.getBoundingClientRect()}
        >
          {windows.map((widget) => (
            <Widget key={widget.id} widget={widget} />
          ))}
        </WidgetDroppableContext>
      </IconDroppableContext>

      <div style={{ marginLeft: 4 }}>OS Version 0.0.1</div>
    </div>
  );
}

function useGlobalErrorHandling() {
  const addWindow = useDesktopStore((state) => state.addWidget);

  useEffect(() => {
    const listener = (e: ErrorEvent) =>
      addWindow({
        title: "Error",
        position: { x: 100, y: 100 },
        application: { id: "dialog", params: { message: e.message } },
        resizable: false,
      });
    window.addEventListener("error", listener);

    return () => window.removeEventListener("error", listener);
  }, [addWindow]);
}
