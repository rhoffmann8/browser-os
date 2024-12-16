import { css } from "@emotion/css";
import { MouseEventHandler, useCallback, useRef } from "react";
import { IconDroppableContext } from "./droppable/IconDroppableContext";
import { WindowDroppableContext } from "./droppable/WindowDroppableContext";
import { DraggableIcon } from "./icon/DraggableIcon";
import { ContextMenu } from "./menu/ContextMenu";
import { useDesktopContextMenu } from "./menu/useDesktopContextMenu";
import { useIconContextMenu } from "./menu/useIconContextMenu";
import { useContextMenuStore } from "./state/contextMenuState";
import { useDesktopStore } from "./state/desktopState";
import { useIconStore } from "./state/iconState";
import { Taskbar } from "./taskbar/Taskbar";
import { DesktopWindow } from "./window/DesktopWindow";

const viewportCss = css`
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;

  overflow: hidden;
`;

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
  const windows = useDesktopStore((state) => state.windows);

  const desktopContextMenuItems = useDesktopContextMenu();
  const iconContextMenuItems = useIconContextMenu();

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
    <>
      <div className={viewportCss} style={{}}>
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

            <WindowDroppableContext
              parentRect={desktopRef.current?.getBoundingClientRect()}
            >
              {windows.map((window) => (
                <DesktopWindow key={window.id} {...window} />
              ))}
            </WindowDroppableContext>
          </IconDroppableContext>
        </div>
        <Taskbar />
      </div>
      <ContextMenu />
    </>
  );
}
