import {
  DndContext,
  DragEndEvent,
  Modifier,
  PointerSensor,
  useDroppable,
  useSensor,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { css } from "@emotion/css";
import {
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from "react";
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

  const draggingRef = useRef(false);

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 4,
    },
  });

  const onDragStart = useCallback(() => {
    draggingRef.current = true;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }, []);

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      draggingRef.current = false;
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

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

  useEffect(() => {
    const preventScroll = (e: Event) => {
      if (draggingRef.current) e.preventDefault();
    };
    const opts = { capture: true, passive: false } as const;
    document.addEventListener("touchmove", preventScroll, opts);
    document.addEventListener("wheel", preventScroll, opts);
    return () => {
      document.removeEventListener("touchmove", preventScroll, opts);
      document.removeEventListener("wheel", preventScroll, opts);
    };
  }, []);

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      modifiers={[restrictToWindowEdges, restrictToTaskbarEdge]}
      sensors={[sensor]}
      autoScroll={false}
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

const restrictToTaskbarEdge: Modifier = (e) => {
  const { transform, draggingNodeRect, containerNodeRect } = e;
  if (!draggingNodeRect || !containerNodeRect) {
    return transform;
  }

  return {
    ...transform,
    y:
      draggingNodeRect.bottom + transform.y > containerNodeRect.height
        ? containerNodeRect.height - draggingNodeRect.bottom
        : transform.y,
  };
};
