import { forwardRef } from "react";
import { Div, DivProps } from "./Div";

export const Box = forwardRef<HTMLDivElement, Omit<DivProps, "display">>(
  (props, ref) => {
    return <Div ref={ref} {...props} display="flex" />;
  }
);

export const BoxCol = forwardRef<
  HTMLDivElement,
  Omit<DivProps, "display" | "flexDirection">
>((props, ref) => {
  return <Box ref={ref} {...props} flexDirection="column" />;
});
