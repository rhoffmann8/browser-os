import { css } from "@emotion/css";
import { PropsWithChildren } from "react";

const contentCss = css`
  flex: 1;

  background-color: white;
  color: black;

  display: flex;
  overflow: hidden;
`;

export function WidgetContent({ children }: PropsWithChildren) {
  return <div className={contentCss}>{children}</div>;
}
