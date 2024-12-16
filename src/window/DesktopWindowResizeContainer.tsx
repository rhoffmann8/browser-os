import { css } from "@emotion/css";
import { PropsWithChildren, useCallback, useRef } from "react";
import { Delta } from "../types";

const boxCss = css`
  height: 100%;
  width: 100%;

  display: grid;
  grid-template-areas:
    "NW N NE"
    "W . E"
    "SW S SE";
  grid-template-rows: 1px auto 1px;
  grid-template-columns: 1px auto 1px;
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
}

type ResizeDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export function DesktopWindowResizeContainer({
  children,
  onResize,
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
      resizeDirection.current = direction;
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    },
    [onPointerMove, onPointerUp]
  );

  return (
    <div className={boxCss}>
      <div
        className="resize-handle resize-handle-nw"
        onPointerDown={() => onPointerDown("NW")}
      />
      <div
        className="resize-handle resize-handle-n"
        onPointerDown={() => onPointerDown("N")}
      />
      <div
        className="resize-handle resize-handle-ne"
        onPointerDown={() => onPointerDown("NE")}
      />
      <div
        className="resize-handle resize-handle-w"
        onPointerDown={() => onPointerDown("W")}
      />
      {children}
      <div
        className="resize-handle resize-handle-e"
        onPointerDown={() => onPointerDown("E")}
      />
      <div
        className="resize-handle resize-handle-sw"
        onPointerDown={() => onPointerDown("SW")}
      />
      <div
        className="resize-handle resize-handle-s"
        onPointerDown={() => onPointerDown("S")}
      />
      <div
        className="resize-handle resize-handle-se"
        onPointerDown={() => onPointerDown("SE")}
      />
    </div>
  );
}
