import { css } from "@emotion/css";
import {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  useMemo,
} from "react";
import cx from "classnames";

interface BoxProps
  extends HTMLAttributes<HTMLDivElement>,
    Pick<
      CSSProperties,
      | "flex"
      | "flexDirection"
      | "alignItems"
      | "justifyContent"
      | "gap"
      | "padding"
      | "margin"
      | "overflow"
      | "overflowX"
      | "overflowY"
      | "height"
      | "width"
      | "minWidth"
      | "maxWidth"
    > {
  fillHeight?: boolean;
  fillWidth?: boolean;
}

export const Box = forwardRef<HTMLDivElement, PropsWithChildren<BoxProps>>(
  (props, ref) => {
    const {
      children,
      className,
      flex,
      alignItems,
      justifyContent,
      flexDirection,
      gap,
      margin,
      padding,
      overflow,
      overflowX,
      overflowY,
      height,
      width,
      minWidth,
      maxWidth,
      fillHeight,
      fillWidth,
      ...rest
    } = props;
    const boxCss = useMemo(() => {
      return css`
        display: flex;
        ${flex ? `flex: ${flex};` : ""}
        ${flexDirection ? `flex-direction: ${flexDirection};` : ""}
        ${alignItems ? `align-items: ${alignItems};` : ""}
        ${justifyContent ? `justify-content: ${justifyContent};` : ""}
        ${gap ? `gap: ${gap}px;` : ""}

        ${padding
          ? typeof padding === "number"
            ? `padding: ${padding}px;`
            : `padding:${padding}`
          : ""}
        ${margin
          ? typeof margin === "number"
            ? `margin: ${margin}px;`
            : `margin: ${margin}`
          : ""}

        ${overflow ? `overflow: ${overflow};` : ""}
        ${overflowX ? `overflow-x: ${overflowX};` : ""}
        ${overflowY ? `overflow-y: ${overflowY};` : ""}

        ${fillHeight ? "height: 100%;" : ""}
        ${fillWidth ? "width: 100%;" : ""}

        ${typeof height === "number"
          ? `height: ${height}px;`
          : typeof height === "string"
          ? `height: ${height}`
          : ""}
        ${typeof width === "number"
          ? `width: ${width}px;`
          : typeof width === "string"
          ? `width: ${width}`
          : ""}
        ${typeof minWidth === "number" ? `min-width: ${minWidth}px;` : ""}
        ${typeof maxWidth === "number" ? `max-width: ${maxWidth}px;` : ""}
      `;
    }, [
      alignItems,
      fillHeight,
      fillWidth,
      flex,
      flexDirection,
      gap,
      height,
      justifyContent,
      margin,
      maxWidth,
      minWidth,
      overflow,
      overflowX,
      overflowY,
      padding,
      width,
    ]);

    return (
      <div ref={ref} className={cx(boxCss, className)} {...rest}>
        {children}
      </div>
    );
  }
);
