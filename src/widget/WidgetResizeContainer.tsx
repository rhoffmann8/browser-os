import { css } from "@emotion/css";
import { PropsWithChildren, useCallback, useMemo, useRef } from "react";
import { Delta, Widget } from "../types/widget";
import cx from "classnames";

const RESIZE_HANDLE_WIDTH = 2;

const boxCss = css`
  height: 100%;
  width: 100%;

  display: grid;
  grid-template-areas:
    "NW N NE"
    "W . E"
    "SW S SE";
  grid-template-rows: 2px auto 2px;
  background-color: #333;

  .resize-handle {
    height: 100%;
    width: 100%;
  }

  .resize-handle-nw {
    cursor: nw-resize;
  }
  .resize-handle-n {
    cursor: n-resize;
  }
  .resize-handle-ne {
    cursor: ne-resize;
  }
  .resize-handle-w {
    cursor: w-resize;
  }
  .resize-handle-e {
    cursor: e-resize;
  }
  .resize-handle-sw {
    cursor: sw-resize;
  }
  .resize-handle-s {
    cursor: s-resize;
  }
  .resize-handle-se {
    cursor: se-resize;
  }
`;

interface Props {
  widget: Widget;
  onResize: (delta: Partial<Delta>) => void;
  disabled?: boolean;
}

type ResizeDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export function WidgetResizeContainer({
  children,
  widget,
  onResize,
  disabled,
}: PropsWithChildren<Props>) {
  const resizeDirection = useRef<ResizeDirection | undefined>(undefined);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!resizeDirection.current) {
        return;
      }

      const current = resizeDirection.current;

      const deltaTop = current.includes("N") ? -e.movementY : 0;
      const deltaLeft = current.includes("W") ? -e.movementX : 0;
      const deltaHeight =
        (current.includes("S") ? e.movementY : 0) +
        (current.includes("N") ? e.movementY * -1 : 0);
      const deltaWidth =
        (current.includes("E") ? e.movementX : 0) +
        (current.includes("W") ? e.movementX * -1 : 0);

      onResize({
        top: deltaTop,
        left: deltaLeft,
        x: deltaWidth,
        y: deltaHeight,
      });
    },
    [onResize]
  );

  const onPointerUp = useCallback(() => {
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    resizeDirection.current = undefined;
  }, [onPointerMove]);

  const onPointerDown = useCallback(
    (direction: ResizeDirection) => {
      if (disabled) {
        return;
      }

      resizeDirection.current = direction;
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    },
    [disabled, onPointerMove, onPointerUp]
  );

  const handles = useMemo(
    () =>
      (["NW", "N", "NE", "W", "E", "SW", "S", "SE"] as ResizeDirection[]).map(
        (direction) => (
          <ResizeHandle
            key={direction}
            direction={direction}
            disabled={disabled}
            onPointerDown={onPointerDown}
          />
        )
      ),
    [disabled, onPointerDown]
  );

  return (
    <div
      className={boxCss}
      style={{
        // if width provided, shrink to width (avoids needing overflow: hidden on title)
        gridTemplateColumns: `${RESIZE_HANDLE_WIDTH}px ${
          typeof widget.dimensions?.width === "number"
            ? `${widget.dimensions.width - RESIZE_HANDLE_WIDTH * 2}px`
            : "auto"
        } ${RESIZE_HANDLE_WIDTH}px`,
      }}
    >
      {handles.slice(0, 4)}
      {children}
      {handles.slice(4)}
    </div>
  );
}

interface ResizeHandleProps {
  direction: ResizeDirection;
  onPointerDown: (direction: ResizeDirection) => void;
  disabled?: boolean;
}
function ResizeHandle({
  direction,
  disabled,
  onPointerDown,
}: ResizeHandleProps) {
  return (
    <div
      className={cx("resize-handle", {
        [`resize-handle-${direction.toLowerCase()}`]: !disabled,
      })}
      onPointerDown={(e) => {
        e.preventDefault();
        onPointerDown(direction);
      }}
    />
  );
}
