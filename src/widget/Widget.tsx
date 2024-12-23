import { useDraggable } from "@dnd-kit/core";
import { css } from "@emotion/css";
import { useCallback, useState } from "react";
import { getApplicationComponentFromId } from "../application";
import { BoxCol } from "../components/Box";
import { useDesktopStore } from "../state/desktopState";
import { Delta, Widget as WidgetType } from "../types";
import { AppId, Application, ApplicationComponent } from "../types/application";
import { WidgetButtons } from "./WidgetButtons";
import { WidgetContent } from "./WidgetContent";
import { WidgetHandle } from "./WidgetHandle";
import { WidgetResizeContainer } from "./WidgetResizeContainer";

export function Widget({ widget }: { widget: WidgetType }) {
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

  const AppComponent = getApplicationComponentFromId(
    application.id as AppId
  ) as ApplicationComponent<Application>;

  return (
    <div
      ref={(r) => {
        setContainerRef(r);
        setNodeRef(r);
      }}
      className={windowCss}
      onContextMenu={(e) => e.stopPropagation()}
      onMouseDown={() => widget.moveToTop()}
      style={{
        height,
        width,
        top: position?.y ?? 0,
        left: position?.x ?? 0,
        zIndex: stackIndex,
        filter: widget.isActive() ? undefined : "brightness(0.95)",
        ...draggableStyle,
      }}
    >
      <WidgetResizeContainer
        onResize={onWidgetResize}
        disabled={resizable === false}
      >
        <BoxCol flex={1} overflow="hidden">
          <div className={handleContainerCss}>
            <WidgetHandle
              widget={widget}
              ref={setActivatorNodeRef}
              attributes={attributes}
              listeners={listeners}
            />
            <WidgetButtons onClose={() => widget.close()} />
          </div>
          <WidgetContent>
            <AppComponent params={application.params} widget={widget} />
          </WidgetContent>
        </BoxCol>
      </WidgetResizeContainer>
    </div>
  );
}

const windowCss = css`
  position: absolute;

  display: flex;
  flex-direction: column;

  box-shadow: var(--box-shadow-primary);

  animation: open 100ms ease-in-out;

  @keyframes open {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const handleContainerCss = css`
  display: flex;
  gap: 4px;
  background: var(--color-theme-gradient);

  cursor: pointer;
`;
