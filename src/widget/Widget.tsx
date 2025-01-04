import { useDraggable } from "@dnd-kit/core";
import { css } from "@emotion/css";
import { useCallback, useState } from "react";
import { BoxCol } from "../components/Box";
import {
  useCloseWidget,
  useIsActiveWidget,
  useMoveWidgetToTop,
  useSetWidgetDimensions,
  useWidgetStore,
} from "../state/widgetState";
import { Delta, Widget as WidgetType } from "../types/widget";
import { WidgetButtons } from "./WidgetButtons";
import { WidgetContent } from "./WidgetContent";
import { WidgetHandle } from "./WidgetHandle";
import { WidgetResizeContainer } from "./WidgetResizeContainer";
import { getApplicationFromId } from "../types/application";

export function Widget({ widget }: { widget: WidgetType }) {
  const {
    id,
    position,
    applicationId,
    isResizable: resizable,
    dimensions: { height, width } = {},
    stackIndex,
  } = widget;

  const close = useCloseWidget();
  const isActiveWidget = useIsActiveWidget();
  const moveToTop = useMoveWidgetToTop();
  const setWidgetDimensions = useSetWidgetDimensions();

  const { attributes, listeners, setNodeRef, transform, setActivatorNodeRef } =
    useDraggable({ id });

  const resizeWindow = useWidgetStore((state) => state.resizeWidget);

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
      setWidgetDimensions(id, { height: dims.height, width: dims.width });
    }
  }, [containerRef, id, setWidgetDimensions, widget]);

  const onWidgetResize = useCallback(
    (delta: Partial<Delta>) => {
      // If the widget was initialized with undefined dims, then set dims to content size before resizing
      // TODO: rethink window sizing system
      setInitialDims();
      resizeWindow(id, delta);
    },
    [id, resizeWindow, setInitialDims]
  );

  const AppComponent = getApplicationFromId(applicationId).component;

  return (
    <div
      ref={(r) => {
        setContainerRef(r);
        setNodeRef(r);
      }}
      className={windowCss}
      onContextMenu={(e) => e.stopPropagation()}
      onMouseDown={() => moveToTop(id)}
      style={{
        height,
        width,
        top: position?.y ?? 0,
        left: position?.x ?? 0,
        zIndex: stackIndex,
        filter: isActiveWidget(id) ? undefined : "brightness(0.95)",
        ...draggableStyle,
      }}
    >
      <WidgetResizeContainer
        widget={widget}
        onResize={onWidgetResize}
        disabled={resizable === false}
      >
        <BoxCol flex={1}>
          <div className={handleContainerCss}>
            <WidgetHandle
              widget={widget}
              ref={setActivatorNodeRef}
              attributes={attributes}
              listeners={listeners}
            />
            <WidgetButtons onClose={() => close(id)} />
          </div>
          <WidgetContent>
            <AppComponent widget={widget} />
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
  overflow: hidden;

  cursor: pointer;
`;
