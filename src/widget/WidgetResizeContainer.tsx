import { css } from "@emotion/css";
import { PropsWithChildren, useCallback, useRef } from "react";
import { Delta } from "../types";
import cx from "classnames";

const boxCss = css`
  height: 100%;
  width: 100%;

  display: grid;
  grid-template-areas:
    "NW N NE"
    "W . E"
    "SW S SE";
  grid-template-rows: 2px auto 2px;
  grid-template-columns: 2px auto 2px;
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
  onResize: (delta: Partial<Delta>) => void;
  disabled?: boolean;
}

type ResizeDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export function WidgetResizeContainer({
  children,
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

  return (
    <div className={boxCss}>
      <div
        className={cx("resize-handle", { "resize-handle-nw": !disabled })}
        onPointerDown={() => onPointerDown("NW")}
      />
      <div
        className={cx("resize-handle", { "resize-handle-n": !disabled })}
        onPointerDown={() => onPointerDown("N")}
      />
      <div
        className={cx("resize-handle", { "resize-handle-ne": !disabled })}
        onPointerDown={() => onPointerDown("NE")}
      />
      <div
        className={cx("resize-handle", { "resize-handle-w": !disabled })}
        onPointerDown={() => onPointerDown("W")}
      />
      {children}
      <div
        className={cx("resize-handle", { "resize-handle-e": !disabled })}
        onPointerDown={() => onPointerDown("E")}
      />
      <div
        className={cx("resize-handle", { "resize-handle-sw": !disabled })}
        onPointerDown={() => onPointerDown("SW")}
      />
      <div
        className={cx("resize-handle", { "resize-handle-s": !disabled })}
        onPointerDown={() => onPointerDown("S")}
      />
      <div
        className={cx("resize-handle", { "resize-handle-se": !disabled })}
        onPointerDown={() => onPointerDown("SE")}
      />
    </div>
  );
}
