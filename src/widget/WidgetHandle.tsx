import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { css } from "@emotion/css";
import { forwardRef } from "react";
import { Widget } from "../types";
import { APPLICATION_MAP } from "../application";
import { AppId, Application } from "../types/application";

const handleCss = css`
  flex: 1;
  padding-left: 4px;
  font-weight: 600;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface Props<A extends Application> {
  widget: Widget<A>;
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
}

export const WidgetHandle = forwardRef<HTMLDivElement, Props<Application>>(
  ({ widget: { title, application }, attributes, listeners }, ref) => {
    const displayTitle = `${title ? `${title} - ` : ""}${
      APPLICATION_MAP[application.id as AppId].title
    }`;
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
