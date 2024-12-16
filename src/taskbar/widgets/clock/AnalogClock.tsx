import { css } from "@emotion/css";
import cx from "classnames";

const containerCss = css`
  position: absolute;
  top: 0;
  right: 0;
  height: 140px;
  width: 140px;
  background: linear-gradient(#ccc, #999);
  padding: 0;
  border: 2px solid #555;
  border-radius: 50%;
  z-index: -1;
  opacity: 0;

  transition: top 100ms linear, opacity 300ms linear;

  &.show {
    opacity: 1;
    top: -144px;
  }
`;

export function AnalogClock({ date, show }: { date: Date; show: boolean }) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return (
    <div className={cx(containerCss, { show })}>
      <Hand color="blue" length={5} rotate={6 * seconds} />
      <Hand color="black" length={15} rotate={6 * minutes} />
      <Hand color="red" length={30} rotate={30 * hours} />
    </div>
  );
}

const handCss = css`
  width: 2px;
  position: absolute;
  left: 50%;
  transform-origin: bottom;
`;

function Hand({
  length,
  rotate,
  color,
}: {
  length: number;
  rotate: number;
  color: string;
}) {
  return (
    <div
      className={handCss}
      style={{
        height: `calc(50% - ${length}px)`,
        background: `linear-gradient(color-mix(in srgb, ${color} 30%, transparent), ${color})`,
        top: length,
        transform: `rotate(${rotate}deg)`,
      }}
    />
  );
}
