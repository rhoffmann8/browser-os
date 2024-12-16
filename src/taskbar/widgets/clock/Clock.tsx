import { css } from "@emotion/css";
import { useEffect, useRef, useState } from "react";
import { AnalogClock } from "./AnalogClock";
import { Box } from "../../../components/Box";

const containerCss = css`
  background: var(--color-theme-gradient);
`;

const dateTimeCss = css`
  transition: opacity 100ms ease-in-out;
  &:hover {
    opacity: 0.75;
  }
`;

export function Clock() {
  const [showAnalogClock, setShowAnalogClock] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [date, setCurrentDate] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      ref={ref}
      className={containerCss}
      alignItems="center"
      onClick={() => setShowAnalogClock((prev) => !prev)}
      style={{
        cursor: "pointer",
        fontFamily: "monospace",
        position: "relative",
        height: "100%",
      }}
    >
      <AnalogClock date={date} show={showAnalogClock} />
      <div className={dateTimeCss}>
        {Intl.DateTimeFormat(undefined, {
          dateStyle: "short",
          timeStyle: "medium",
        }).format(date)}
      </div>
    </Box>
  );
}
