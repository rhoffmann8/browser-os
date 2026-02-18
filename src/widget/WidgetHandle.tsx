import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { css } from "@emotion/css";
import { forwardRef } from "react";
import { Widget } from "../types/widget";
import { getApplicationFromId } from "../types/application";

const handleCss = css`
  flex: 1;
  padding-left: 4px;
  font-weight: 600;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Prevent drag from triggering page scroll (touch and mouse) */
  touch-action: none;
`;

interface Props {
  widget: Widget;
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
}

export const WidgetHandle = forwardRef<HTMLDivElement, Props>(
  ({ widget: { title, applicationId }, attributes, listeners }, ref) => {
    const application = getApplicationFromId(applicationId);
    const displayTitle = `${title ? `${title} - ` : ""}${application.title}`;
    return (
      <div
        ref={ref}
        title={displayTitle}
        className={handleCss}
        {...attributes}
        {...listeners}
      >
        {displayTitle}
      </div>
    );
  }
);
