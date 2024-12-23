import { css } from "@emotion/css";
import cx from "classnames";

const containerCss = css`
  position: absolute;
  top: 0;
  right: 0;
  height: 160px;
  width: 160px;
  padding: 0;

  background: linear-gradient(var(--color-theme-hover), #111);
  box-shadow: 0 0 8px 4px #161616 inset,
    0 1px 8px 1px var(--color-theme-primary);
  border-radius: 50%;

  z-index: -1;
  opacity: 0;
  transform: translateY(0);
  transition: transform 200ms ease-in-out, opacity 200ms ease-in-out;

  &.show {
    opacity: 1;
    transform: translateY(-103%);
  }
`;

const tickCss = css`
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  color: #999;
  text-shadow: 0px 2px 1px black;

  position: absolute;
  top: 50%;
  left: 50%;
`;

const DEGREES = 360;
const TOTAL_SECONDS = 60;
const TOTAL_MINUTES = 60;
const TOTAL_HOURS = 12;
const DEG_PER_SECOND = DEGREES / TOTAL_SECONDS;
const DEG_PER_MINUTE = DEGREES / TOTAL_MINUTES;
const DEG_PER_HOUR = DEGREES / TOTAL_HOURS;

export function AnalogClock({ date, show }: { date: Date; show: boolean }) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const secondsRotation = DEG_PER_SECOND * seconds;
  const minutesRotation =
    DEG_PER_MINUTE * minutes + DEG_PER_MINUTE * (seconds / TOTAL_SECONDS);
  const hoursRotation =
    DEG_PER_HOUR * hours + DEG_PER_HOUR * (minutes / TOTAL_MINUTES);

  return (
    <div className={cx(containerCss, { show })}>
      {Array.from({ length: 12 }).map((_, idx) => (
        <div
          key={idx}
          className={tickCss}
          style={{ transform: getTickTransform(idx + 1) }}
        >
          {idx + 1}
        </div>
      ))}

      <Hand color="#1d8dd8" length={10} rotate={secondsRotation} />
      <Hand color="white" length={22} rotate={minutesRotation} />
      <Hand color="red" length={36} rotate={hoursRotation} />
    </div>
  );
}

function getTickTransform(index: number) {
  return `translate(-50%, -50%) rotate(${
    180 + 30 * index
  }deg) translateY(64px) rotate(${180 - 30 * index}deg)`;
}

const handCss = css`
  width: 2px;
  position: absolute;
  left: 50%;
  transform-origin: bottom;
`;

interface HandProps {
  length: number;
  rotate: number;
  color: string;
}
function Hand({ length, rotate, color }: HandProps) {
  return (
    <div
      className={handCss}
      style={{
        height: `calc(50% - ${length}px)`,
        background: `linear-gradient(color-mix(in srgb, ${color} 50%, transparent), ${color})`,
        top: length,
        transform: `rotate(${rotate}deg)`,
        boxShadow: `${getShadowXOffset(rotate)}px 0px 4px 0px black`,
      }}
    />
  );
}

const QUADRANT = DEGREES / 4;
const SHADOW_X_OFFSET_PIXELS = 2;
// As the hand rotates, the shadow needs to be shifted from one side to the other
function getShadowXOffset(rotate: number) {
  let normalizedRotate: number;
  const delta = (rotate - QUADRANT) % QUADRANT;

  if (rotate < QUADRANT) {
    normalizedRotate = rotate;
  } else if (rotate < QUADRANT * 2) {
    normalizedRotate = QUADRANT - delta;
  } else if (rotate < QUADRANT * 3) {
    normalizedRotate = -delta;
  } else {
    normalizedRotate = -(QUADRANT - delta);
  }

  return normalizedRotate * (SHADOW_X_OFFSET_PIXELS * (1 / QUADRANT));
}
