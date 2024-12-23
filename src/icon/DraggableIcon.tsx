import { useDraggable } from "@dnd-kit/core";
import { DesktopIcon, IconProps } from "./DesktopIcon";
import { Application } from "../types/application";

export function DraggableIcon<A extends Application>(props: IconProps<A>) {
  const { icon } = props;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: icon.id,
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
        top: icon.position.y,
        left: icon.position.x,
        ...draggableStyle,
      }}
      {...listeners}
      {...attributes}
    >
      <DesktopIcon {...props} />
    </div>
  );
}
