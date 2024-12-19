import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { css } from "@emotion/css";
import { forwardRef } from "react";
import { Widget } from "../types";
import { APPLICATION_MAP } from "../application";

const handleCss = css`
  flex: 1;
  padding-left: 4px;
  font-weight: 600;
`;

export const WidgetHandle = forwardRef<
  HTMLDivElement,
  {
    widget: Widget;
    attributes: DraggableAttributes;
    listeners?: SyntheticListenerMap;
  }
>(({ widget: { title, application }, attributes, listeners }, ref) => {
  return (
    <div ref={ref} className={handleCss} {...attributes} {...listeners}>
      {title ? `${title} - ` : ""}
      {APPLICATION_MAP[application.id].title}
    </div>
  );
});
