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
  // const iconContextMenuItems = useIconContextMenu();
  const desktopContextMenuItems = useDesktopContextMenu(desktopRef.current);

  // const onContextMenu = useCallback(
  //   (pos: { x: number; y: number }) => {
  //     showContextMenu(iconContextMenuItems, pos);
  //   },
  //   [iconContextMenuItems, showContextMenu]
  // );

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
              // onContextMenu={onContextMenu}
              onDoubleClick={addWidget}
            />
          </Draggable>
        ))}

        <WidgetDroppableContext
          parentRect={desktopRef.current?.getBoundingClientRect()}
        >
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

function useExternalDroppable() {
  const onDrop: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.dataTransfer.items.length) return;

    [...e.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (!file) return;
        console.log(`… file[${i}].name = ${file.name}`);
      }
    });
  }, []);

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
  }, []);

  return { onDragOver, onDrop };
}
