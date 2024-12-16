import { useDraggable } from "@dnd-kit/core";
import { css } from "@emotion/css";
import { useCallback } from "react";
import { getApplicationFromId } from "../application";
import { useDesktopStore } from "../state/desktopState";
import { Delta, type DesktopWindow } from "../types";
import { DesktopWindowButtons } from "./DesktopWindowButtons";
import { DesktopWindowContent } from "./DesktopWindowContent";
import { DesktopWindowHandle } from "./DesktopWindowHandle";
import { DesktopWindowResizeContainer } from "./DesktopWindowResizeContainer";

const windowCss = css`
  position: absolute;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  box-shadow: var(--box-shadow-primary);
`;

const handleCss = css`
  display: flex;
  background: var(--color-theme-gradient);
  font-size: 16px;

  cursor: pointer;
`;

export function DesktopWindow(window: DesktopWindow) {
  const { id, title, position, application, height, width, stackIndex } =
    window;

  const { attributes, listeners, setNodeRef, transform, setActivatorNodeRef } =
    useDraggable({ id });

  const moveToTop = useDesktopStore((state) => state.moveToTop);
  const resizeWindow = useDesktopStore((state) => state.resizeWindow);

  const draggableStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const onWindowResize = useCallback(
    (delta: Partial<Delta>) => {
      resizeWindow(id, delta);
    },
    [id, resizeWindow]
  );

  const AppComponent = getApplicationFromId(application.id);

  return (
    <div
      ref={setNodeRef}
      className={windowCss}
      onContextMenu={(e) => e.stopPropagation()}
      style={{
        height,
        width,
        top: position.y,
        left: position.x,
        zIndex: stackIndex,
        ...draggableStyle,
      }}
      onMouseDown={() => moveToTop(id)}
    >
      <DesktopWindowResizeContainer onResize={onWindowResize}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div className={handleCss}>
            <DesktopWindowHandle
              title={title}
              ref={setActivatorNodeRef}
              attributes={attributes}
              listeners={listeners}
            />
            <DesktopWindowButtons id={id} />
          </div>
          <DesktopWindowContent>
            <AppComponent params={application.params as any} window={window} />
          </DesktopWindowContent>
        </div>
      </DesktopWindowResizeContainer>
    </div>
  );
}
