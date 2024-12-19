import { css } from "@emotion/css";
import cx from "classnames";
import { Box } from "../../../components/Box";
import {
  type Track,
  useAudioPlayerContext,
} from "../context/AudioPlayerContext";

import { getTrackTitle } from "../utils";
import { AddTrack } from "./AddTrack";

export function TrackList() {
  const { trackList, showTrackList } = useAudioPlayerContext();

  if (!showTrackList) {
    return null;
  }

  return (
    <Box fillWidth flexDirection="column" gap={4} className={trackListCss}>
      <ul>
        {trackList.map((track, index) => (
          <Track index={index} track={track} />
        ))}
      </ul>
      <AddTrack />
    </Box>
  );
}

function Track({ track, index }: { track: Track; index: number }) {
  const { currentTrack, setTrackIndex, setIsPlaying } = useAudioPlayerContext();

  const displayName = getTrackTitle(track);
  return (
    <li
      key={track.title}
      className={cx({ active: currentTrack === track })}
      onClick={() => {
        setTrackIndex(index);
        setIsPlaying(true);
      }}
    >
      <span title={displayName}>{displayName}</span>
    </li>
  );
}

const trackListCss = css`
  border-top: 1px solid #aaa;
  margin-top: 4px;
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
