import {
  ClientRect,
  DndContext,
  DragEndEvent,
  Modifier,
  useDroppable,
} from "@dnd-kit/core";

import { PropsWithChildren, useCallback } from "react";
import { useDesktopStore } from "../state/desktopState";

export function WidgetDroppableContext({
  children,
}: PropsWithChildren<{ parentRect: ClientRect | undefined }>) {
  const { setNodeRef } = useDroppable({ id: "window-droppable" });

  const setWidgetPosition = useDesktopStore((state) => state.setWidgetPosition);

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      if (!e.active) {
        return;
      }

      const translated = e.active.rect.current.translated;
      if (!translated) {
        return;
      }

      setWidgetPosition(e.active.id, {
        x: translated.left,
        y: translated.top,
      });
    },
    [setWidgetPosition]
  );

  return (
    <DndContext onDragEnd={onDragEnd} modifiers={[restrictToTopEdge]}>
      <div ref={setNodeRef}>{children}</div>
    </DndContext>
  );
}

const restrictToTopEdge: Modifier = ({ draggingNodeRect, transform }) => {
  if (!draggingNodeRect) {
    return transform;
  }

  const newY =
    draggingNodeRect.top + transform.y < 0
      ? -draggingNodeRect.top
      : transform.y;

  return {
    ...transform,
    y: newY,
  };
};
