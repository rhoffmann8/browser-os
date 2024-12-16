import { css } from "@emotion/css";
import { Box } from "../../../components/Box";
import cx from "classnames";
import { useAudioPlayerContext } from "../context/AudioPlayerContext";

const trackListCss = css`
  border-top: 1px solid #aaa;
  margin-top: 8px;
  padding-top: 8px;
  max-height: 400px;
  overflow-y: auto;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    overflow-x: clip;
  }

  h1 {
    margin: 0;
    font-size: 16px;
  }

  li {
    padding: 2px 4px;
    white-space: nowrap;
    cursor: pointer;
  }

  li.active {
    background: #333;
  }

  li:hover {
    background: var(--color-theme-hover);
  }
`;

export function TrackList() {
  const {
    trackList,
    showTrackList,
    currentTrack,
    setTrackIndex,
    setIsPlaying,
  } = useAudioPlayerContext();
  if (!showTrackList) {
    return null;
  }

  return (
    <Box fillWidth flexDirection="column" className={trackListCss}>
      <h1>Tracklist</h1>
      <ul>
        {trackList.map((track, index) => (
          <li
            key={track.title}
            className={cx({ active: currentTrack === track })}
            onDoubleClick={() => {
              setTrackIndex(index);
              setIsPlaying(true);
            }}
          >
            {track.author} - {track.title}
          </li>
        ))}
      </ul>
    </Box>
  );
}
