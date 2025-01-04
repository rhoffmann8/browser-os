import { css } from "@emotion/css";
import {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  useMemo,
} from "react";
import cx from "classnames";

export interface DivProps
  extends HTMLAttributes<HTMLDivElement>,
    Pick<
      CSSProperties,
      | "display"
      | "flex"
      | "flexDirection"
      | "alignItems"
      | "justifyContent"
      | "alignSelf"
      | "justifySelf"
      | "gap"
      | "padding"
      | "margin"
      | "overflow"
      | "overflowX"
      | "overflowY"
      | "height"
      | "minHeight"
      | "maxHeight"
      | "width"
      | "minWidth"
      | "maxWidth"
    > {
  fillHeight?: boolean;
  fillWidth?: boolean;
}

export const Div = forwardRef<HTMLDivElement, PropsWithChildren<DivProps>>(
  (props, ref) => {
    const {
      children,
      className,
      display,
      flex,
      alignItems,
      justifyContent,
      flexDirection,
      alignSelf,
      justifySelf,
      gap,
      margin,
      padding,
      overflow,
      overflowX,
      overflowY,
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth,
      fillHeight,
      fillWidth,
      ...rest
    } = props;
    const boxCss = useMemo(() => {
      return css`
        ${display ? `display: ${display};` : ""}
        ${flex ? `flex: ${flex};` : ""}
        ${flexDirection ? `flex-direction: ${flexDirection};` : ""}
        ${alignItems ? `align-items: ${alignItems};` : ""}
        ${justifyContent ? `justify-content: ${justifyContent};` : ""}
        ${alignSelf ? `align-self: ${alignSelf};` : ""}
        ${justifySelf ? `justify-self: ${justifySelf};` : ""}
        ${gap ? `gap: ${typeof gap === "number" ? `${gap}px` : gap};` : ""}

        ${padding
          ? typeof padding === "number"
            ? `padding: ${padding}px;`
            : `padding:${padding};`
          : ""}
        ${margin
          ? typeof margin === "number"
            ? `margin: ${margin}px;`
            : `margin: ${margin};`
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
        ${typeof minHeight === "number" ? `min-width: ${minHeight}px;` : ""}
        ${typeof maxHeight === "number" ? `max-width: ${maxHeight}px;` : ""}
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
      alignSelf,
      display,
      fillHeight,
      fillWidth,
      flex,
      flexDirection,
      gap,
      height,
      justifyContent,
      justifySelf,
      margin,
      maxHeight,
      maxWidth,
      minHeight,
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
