import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { getButtonCss } from "../styles";
import { useCallback, useState } from "react";
import { useAudioPlayerContext } from "../context/AudioPlayerContext";
import { getTags } from "../utils";
import { css } from "@emotion/css";
import cx from "classnames";

export function AddTrack() {
  const { trackList, setTrackList } = useAudioPlayerContext();

  const [showAddTrack, setShowAddTrack] = useState(false);
  const [addTrackUrl, setAddTrackUrl] = useState("");

  const onAddTrackClick = useCallback(async () => {
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
  }, [addTrackUrl, setTrackList, trackList]);

  return (
    <>
      <button
        className={cx(buttonGradientCss, toggleAddButtonCss)}
        style={{}}
        onClick={() => setShowAddTrack((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faAdd} />
        Add track from URL
      </button>
      {showAddTrack && (
        <label className={labelCss}>
          Enter URL
          <input
            style={{ flex: 1 }}
            onChange={(e) => setAddTrackUrl(e.currentTarget.value)}
            value={addTrackUrl}
          />
          <button className={buttonGradientCss} onClick={onAddTrackClick}>
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </label>
      )}
    </>
  );
}

const labelCss = css`
  display: flex;
  justify-content: space-between;
  gap: 4px;
  margin-top: 4px;
  width: 100%;
  align-items: stretch;
`;

const toggleAddButtonCss = css`
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
`;

const buttonGradientCss = getButtonCss(
  "var(--color-theme-primary)",
  "var(--color-theme-secondary)"
);
