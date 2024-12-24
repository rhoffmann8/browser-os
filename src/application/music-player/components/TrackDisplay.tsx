import { css } from "@emotion/css";
import cx from "classnames";
import { useMemo, useRef } from "react";
import { useAudioPlayerContext } from "../context/AudioPlayerContext";
import { getTextWidth } from "../../../utils/style";

const trackDisplayCss = css`
  overflow: clip;
  width: 100%;
  text-align: center;

  > div {
    white-space: nowrap;

    &.scroll {
      animation-name: scrollText;
      animation-timing-function: linear;
      animation-direction: normal;
      animation-duration: 15s;
      animation-iteration-count: infinite;
    }
  }

  @keyframes scrollText {
    0% {
      transform: translateX(100%);
    }
    50% {
      transform: translateX(-25%);
    }
    100% {
      transform: translateX(-150%);
    }
  }
`;

export function TrackDisplay() {
  const { currentTrack } = useAudioPlayerContext();

  const displayContainerRef = useRef<HTMLDivElement>(null);

  const text = currentTrack
    ? `${currentTrack.author ? `${currentTrack.author} - ` : ""}${
        currentTrack.title
      }`
    : "No track playing";
  const textWidth = useMemo(() => {
    return getTextWidth(text, "normal 14px arial");
  }, [text]);

  const isOverflowing =
    (displayContainerRef.current?.clientWidth ?? 0) < textWidth;

  return (
    <div ref={displayContainerRef} className={trackDisplayCss}>
      <div className={cx({ scroll: isOverflowing })}>{text}</div>
    </div>
  );
}
