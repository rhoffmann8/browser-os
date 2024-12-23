import { css } from "@emotion/css";
import { PropsWithChildren, useMemo } from "react";
import ReactAnimateHeight from "react-animate-height";

interface Props {
  show: boolean;
  fillWidth?: boolean;
}

export function AnimateHeight({
  show,
  fillWidth,
  children,
}: PropsWithChildren<Props>) {
  const animateHeightCss = useMemo(
    () => css`
      ${fillWidth ? "width: 100%;" : ""}
    `,
    [fillWidth]
  );
  return (
    <ReactAnimateHeight
      className={animateHeightCss}
      duration={200}
      animateOpacity
      height={show ? "auto" : 0}
    >
      {children}
    </ReactAnimateHeight>
  );
}
