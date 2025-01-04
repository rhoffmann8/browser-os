import { useDraggable } from "@dnd-kit/core";
import { PropsWithChildren } from "react";

interface DraggableProps {
  id: string;
  left: number;
  top: number;
}

export function Draggable(props: PropsWithChildren<DraggableProps>) {
  const { id, left, top, children } = props;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const draggableStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        top,
        left,
        ...draggableStyle,
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}
