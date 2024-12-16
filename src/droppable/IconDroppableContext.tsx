import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDroppable,
  useSensor,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { css } from "@emotion/css";
import { MouseEventHandler, PropsWithChildren, useCallback } from "react";
import { useIconStore } from "../state/iconState";

const iconGridCss = css`
  position: relative;
  flex: 1;

  padding: 12px;
`;

interface Props {
  onContextMenu: MouseEventHandler<HTMLDivElement>;
}

export function IconDroppableContext({
  children,
  onContextMenu,
}: PropsWithChildren<Props>) {
  const { setNodeRef } = useDroppable({ id: "icon-droppable" });

  const unselectAll = useIconStore((state) => state.unselectAll);
  const setIconPosition = useIconStore((state) => state.setIconPosition);

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 4,
    },
  });

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      if (!e.active) {
        return;
      }

      const translated = e.active.rect.current.translated;
      if (!translated) {
        return;
      }

      setIconPosition(e.active.id, {
        x: translated.left,
        y: translated.top,
      });
    },
    [setIconPosition]
  );

  return (
    <DndContext
      onDragEnd={onDragEnd}
      modifiers={[restrictToWindowEdges]}
      sensors={[sensor]}
    >
      <div
        ref={setNodeRef}
        className={iconGridCss}
        onClick={unselectAll}
        onContextMenu={onContextMenu}
      >
        {children}
      </div>
    </DndContext>
  );
}
