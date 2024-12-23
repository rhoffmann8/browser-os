import { css } from "@emotion/css";
import cx from "classnames";
import { Box } from "../../../components/Box";
import {
  type Track,
  useAudioPlayerContext,
} from "../context/AudioPlayerContext";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTrackTitle } from "../utils";
import { AnimateHeight } from "../../../components/Fade";

export function TrackList() {
  const { trackList, showTrackList } = useAudioPlayerContext();

  return (
    <AnimateHeight show={showTrackList} fillWidth>
      <Box fillWidth flexDirection="column" gap={4} className={trackListCss}>
        <ul>
          {trackList.map((track, index) => (
            <Track key={track.src} index={index} track={track} />
          ))}
        </ul>
      </Box>
    </AnimateHeight>
  );
}

function Track({ track, index }: { track: Track; index: number }) {
  const { currentTrack, trackList, setTrackList, setTrackIndex, setIsPlaying } =
    useAudioPlayerContext();

  const displayName = getTrackTitle(track);
  return (
    <li
      key={track.title}
      style={{ position: "relative" }}
      className={cx(trackCss, { active: currentTrack === track })}
      onClick={() => {
        setTrackIndex(index);
        setIsPlaying(true);
      }}
    >
      <span title={displayName}>{displayName}</span>
      <button
        title="Remove"
        className="trash"
        onClick={(e) => {
          e.stopPropagation();
          const newTrackList = trackList.filter((t) => t.src !== track.src);
          setTrackList(newTrackList);
          setTrackIndex(
            newTrackList.findIndex((t) => t.src === currentTrack?.src)
          );
        }}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </li>
  );
}

const trackCss = css`
  .trash {
    position: absolute;
    right: 0px;
    transform: translateY(-50%);
    top: 50%;
    height: 24px;

    background: var(--color-theme-red);
    transition: background 100ms ease-in-out;

    visibility: hidden;

    &:hover {
      background: rgba(var(--color-theme-red-raw), 0.75);
    }
  }

  &:hover .trash {
    visibility: visible;
  }
`;

const trackListCss = css`
  border-top: 1px solid #aaa;
  margin-top: 8px;
  padding-top: 8px;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    max-height: 300px;
    overflow-y: auto;
  }

  li {
    padding: 2px 4px;
    margin: 2px 0;
    cursor: pointer;

    background: transparent;
    transition: background 100ms ease-in;

    span {
      display: block;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 100%;
      overflow: hidden;
    }
  }

  li.active {
    background: #333;
  }

  li:hover {
    background: var(--color-theme-hover);
  }
`;
