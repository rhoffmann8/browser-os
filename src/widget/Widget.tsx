import { useDraggable } from "@dnd-kit/core";
import { css } from "@emotion/css";
import { useCallback, useState } from "react";
import { getApplicationComponentFromId } from "../application";
import { useDesktopStore } from "../state/desktopState";
import { Delta, type Widget } from "../types";
import { WidgetButtons } from "./WidgetButtons";
import { WidgetContent } from "./WidgetContent";
import { WidgetHandle } from "./WidgetHandle";
import { WidgetResizeContainer } from "./WidgetResizeContainer";

const windowCss = css`
  position: absolute;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  box-shadow: var(--box-shadow-primary);
`;

const handleContainerCss = css`
  display: flex;
  background: var(--color-theme-gradient);

  cursor: pointer;
`;

export function Widget({ widget }: { widget: Widget }) {
  const {
    id,
    position,
    application,
    resizable,
    dimensions: { height, width } = {},
    stackIndex,
  } = widget;

  const { attributes, listeners, setNodeRef, transform, setActivatorNodeRef } =
    useDraggable({ id });

  const resizeWindow = useDesktopStore((state) => state.resizeWidget);

  const draggableStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const setInitialDims = useCallback(() => {
    if (
      containerRef &&
      widget.dimensions?.height === undefined &&
      widget.dimensions?.width === undefined
    ) {
      const dims = containerRef.getBoundingClientRect();
      widget.resize({ height: dims.height, width: dims.width });
    }
  }, [containerRef, widget]);

  const onWidgetResize = useCallback(
    (delta: Partial<Delta>) => {
      // If the widget was initialized with undefined dims, then set dims to content size before resizing
      // TODO: rethink window sizing system
      setInitialDims();
      resizeWindow(id, delta);
    },
    [id, resizeWindow, setInitialDims]
  );

  const AppComponent = getApplicationComponentFromId(application.id);

  return (
    <div
      ref={(r) => {
        setContainerRef(r);
        setNodeRef(r);
      }}
      className={windowCss}
      onContextMenu={(e) => e.stopPropagation()}
      style={{
        height,
        width,
        top: position?.y ?? 0,
        left: position?.x ?? 0,
        zIndex: stackIndex,
        filter: widget.isActive() ? undefined : "brightness(0.95)",
        ...draggableStyle,
      }}
      onMouseDown={() => widget.moveToTop()}
    >
      <WidgetResizeContainer
        onResize={onWidgetResize}
        disabled={resizable === false}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div className={handleContainerCss}>
            <WidgetHandle
              widget={widget}
              ref={setActivatorNodeRef}
              attributes={attributes}
              listeners={listeners}
            />
            <WidgetButtons widget={widget} />
          </div>
          <WidgetContent>
            <AppComponent params={application.params as any} widget={widget} />
          </WidgetContent>
        </div>
      </WidgetResizeContainer>
    </div>
  );
}
