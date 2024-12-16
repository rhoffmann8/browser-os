import { css } from "@emotion/css";
import { PropsWithChildren } from "react";

const viewportCss = css`
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;

  overflow: hidden;
`;

export function Viewport({ children }: PropsWithChildren) {
  return <div className={viewportCss}>{children}</div>;
}
