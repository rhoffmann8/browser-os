import { css } from "@emotion/css";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { useState } from "react";
import { toast } from "react-toastify";
import { Box } from "../../../components/Box";
import { useAudioPlayerContext } from "../context/AudioPlayerContext";

import * as id3 from "id3js";
import { getButtonCss } from "../styles";

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

export function TrackList() {
  const {
    trackList,
    setTrackList,
    showTrackList,
    currentTrack,
    setTrackIndex,
    setIsPlaying,
  } = useAudioPlayerContext();

  const [showAddTrack, setShowAddTrack] = useState(false);
  const [addTrackUrl, setAddTrackUrl] = useState("");

  if (!showTrackList) {
    return null;
  }

  return (
    <Box fillWidth flexDirection="column" className={trackListCss}>
      <ul>
        {trackList.map((track, index) => {
          const displayName = `${track.author ? `${track.author} - ` : ""}${
            track.title
          }`;
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
        })}
      </ul>
      <button
        className={getButtonCss(
          "var(--color-theme-primary)",
          "var(--color-theme-secondary)"
        )}
        style={{
          display: "flex",
          gap: 4,
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 0",
        }}
        onClick={() => setShowAddTrack((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faAdd} />
        Add track from URL
      </button>
      {showAddTrack && (
        <label
          style={{
            display: "flex",
            marginTop: 4,
            gap: 4,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          Enter URL
          <input
            style={{ flex: 1 }}
            onChange={(e) => setAddTrackUrl(e.currentTarget.value)}
            value={addTrackUrl}
          />
          <button
            className={getButtonCss(
              "var(--color-theme-primary)",
              "var(--color-theme-secondary)"
            )}
            onClick={async () => {
              const tags = await getTags(addTrackUrl);
              if (!tags) {
                toast.error("Invalid audio URL");
                return;
              }
              if (trackList.find((t) => t.src === addTrackUrl)) {
                toast.error("File already in tracklist");
                return;
              }

              setTrackList((prev) => [
                ...prev,
                {
                  src: addTrackUrl,
                  author: tags.artist ?? "",
                  title: tags.title ?? addTrackUrl,
                },
              ]);
              setAddTrackUrl("");
              setShowAddTrack(false);
            }}
          >
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </label>
      )}
    </Box>
  );
}

async function getTags(url: string) {
  return await id3.fromUrl(url);
}
