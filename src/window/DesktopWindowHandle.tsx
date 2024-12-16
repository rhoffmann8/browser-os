import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { css } from "@emotion/css";
import { forwardRef } from "react";

const handleCss = css`
  flex: 1;
  padding-left: 4px;

  font-size: 14px;
`;

export const DesktopWindowHandle = forwardRef<
  HTMLDivElement,
  {
    title: string;
    attributes: DraggableAttributes;
    listeners?: SyntheticListenerMap;
  }
>(({ title, attributes, listeners }, ref) => {
  return (
    <div ref={ref} className={handleCss} {...attributes} {...listeners}>
      {title}
    </div>
  );
});
