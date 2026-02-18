import {
  DndContext,
  DragEndEvent,
  Modifier,
  useDroppable,
} from "@dnd-kit/core";

import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { useWidgetStore } from "../state/widgetState";

/** Minimum visible height at bottom of viewport (title bar) when widget is dragged down. */
const WIDGET_TITLE_BAR_HEIGHT = 36;

function getPointerClientX(event: Event | null | undefined): number | null {
  if (!event) return null;
  if ("clientX" in event) return (event as PointerEvent).clientX;
  if ("touches" in event) {
    const touch = (event as TouchEvent).touches[0];
    return touch ? touch.clientX : null;
  }
  return null;
}

/**
 * Restrict so:
 * - Horizontally: the cursor cannot leave the viewport edges, which keeps
 *   the widget partially visible on both sides.
 * - Vertically: widget can be dragged down until only the title bar remains
 *   visible, and up until fully above the viewport.
 */
const restrictWidgetToViewport: Modifier = ({
  transform,
  draggingNodeRect,
  activatorEvent,
}) => {
  if (!draggingNodeRect) return transform;
  const { height, top } = draggingNodeRect;
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 0;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 0;

  const initialCursorX = getPointerClientX(activatorEvent);
  let clampedX = transform.x;
  if (initialCursorX != null) {
    const minX = -initialCursorX;
    const maxX = viewportW - initialCursorX;
    clampedX = Math.max(minX, Math.min(maxX, transform.x));
  }

  const minY = -top - height;
  const maxY = viewportH - top - WIDGET_TITLE_BAR_HEIGHT;

  return {
    ...transform,
    x: clampedX,
    y: Math.max(minY, Math.min(maxY, transform.y)),
  };
};

function clampPosition(
  x: number,
  y: number,
  width: number,
  height: number
): { x: number; y: number } {
  const W = window.innerWidth;
  const H = window.innerHeight;
  return {
    x: Math.max(-width, Math.min(W, x)),
    y: Math.max(-height, Math.min(H - WIDGET_TITLE_BAR_HEIGHT, y)),
  };
}

export function WidgetDroppableContext({ children }: PropsWithChildren) {
  const { setNodeRef } = useDroppable({ id: "window-droppable" });
  const draggingRef = useRef(false);
  const setWidgetPosition = useWidgetStore((state) => state.setWidgetPosition);

  const onDragStart = useCallback(() => {
    draggingRef.current = true;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }, []);

  const clearDragState = useCallback(() => {
    draggingRef.current = false;
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      clearDragState();

      if (!e.active) return;

      const translated = e.active.rect.current.translated;
      if (!translated) return;

      const { width, height } = translated;
      const clamped = clampPosition(
        translated.left,
        translated.top,
        width,
        height
      );
      setWidgetPosition(e.active.id as string, clamped);
    },
    [setWidgetPosition]
  );

  const onDragCancel = useCallback(() => {
    clearDragState();
  }, [clearDragState]);

  useEffect(() => {
    const preventScroll = (e: Event) => {
      if (draggingRef.current) e.preventDefault();
    };
    const opts = { capture: true, passive: false };
    document.addEventListener("pointermove", preventScroll, opts);
    document.addEventListener("wheel", preventScroll, opts);
    document.addEventListener("touchmove", preventScroll, opts);
    return () => {
      document.removeEventListener("pointermove", preventScroll, opts);
      document.removeEventListener("wheel", preventScroll, opts);
      document.removeEventListener("touchmove", preventScroll, opts);
    };
  }, []);

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      autoScroll={false}
      modifiers={[restrictWidgetToViewport]}
    >
      <div ref={setNodeRef}>{children}</div>
    </DndContext>
  );
}
