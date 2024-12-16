import {
  ClientRect,
  DndContext,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";

import { PropsWithChildren, useCallback } from "react";
import { useDesktopStore } from "../state/desktopState";

export function WindowDroppableContext({
  children,
}: PropsWithChildren<{ parentRect: ClientRect | undefined }>) {
  const { setNodeRef } = useDroppable({ id: "window-droppable" });

  const setWindowPosition = useDesktopStore((state) => state.setWindowPosition);

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      if (!e.active) {
        return;
      }

      const translated = e.active.rect.current.translated;
      if (!translated) {
        return;
      }

      setWindowPosition(e.active.id, {
        x: translated.left,
        y: translated.top,
      });
    },
    [setWindowPosition]
  );

  return (
    <DndContext onDragEnd={onDragEnd} modifiers={[]}>
      <div ref={setNodeRef}>{children}</div>
    </DndContext>
  );
}
