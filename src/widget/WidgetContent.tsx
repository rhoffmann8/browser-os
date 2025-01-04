import { css } from "@emotion/css";
import { PropsWithChildren } from "react";
import { Box } from "../components/Box";
import cx from "classnames";

const contentCss = css`
  flex: 1;

  background-color: white;
  color: black;
`;

export function WidgetContent({ children }: PropsWithChildren) {
  return <Box className={cx("test", contentCss)}>{children}</Box>;
}
