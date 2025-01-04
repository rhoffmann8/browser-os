import {
  ClientRect,
  DndContext,
  DragEndEvent,
  Modifier,
  useDroppable,
} from "@dnd-kit/core";

import { PropsWithChildren, useCallback } from "react";
import { useWidgetStore } from "../state/widgetState";

export function WidgetDroppableContext({
  children,
}: PropsWithChildren<{ parentRect: ClientRect | undefined }>) {
  const { setNodeRef } = useDroppable({ id: "window-droppable" });

  const setWidgetPosition = useWidgetStore((state) => state.setWidgetPosition);

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      if (!e.active) {
        return;
      }

      const translated = e.active.rect.current.translated;
      if (!translated) {
        return;
      }

      setWidgetPosition(e.active.id as string, {
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
