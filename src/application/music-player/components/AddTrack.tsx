import { css } from "@emotion/css";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as id3 from "id3js";
import { ID3Tag } from "id3js/lib/id3Tag";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { BoxCol } from "../../../components/Box";
import { AnimateHeight } from "../../../components/Fade";
import { useAudioPlayerContext } from "../context/AudioPlayerContext";
import { getButtonCss } from "../styles";

export function AddTrack() {
  const { trackList, setTrackList, showAddTrackUrl, setShowAddTrackUrl } =
    useAudioPlayerContext();

  const [addTrackUrl, setAddTrackUrl] = useState("");

  const onAddTrack = useCallback(
    (tags: ID3Tag | null, src: string) => {
      if (!tags) {
        toast.error("Invalid audio file");
        return;
      }

      if (trackList.find((t) => t.src === src)) {
        toast.error("File already in tracklist");
        return;
      }

      setTrackList((prev) => [
        ...prev,
        {
          src: src,
          author: tags.artist ?? "",
          title: tags.title ?? src,
        },
      ]);
      setAddTrackUrl("");
      setShowAddTrackUrl(false);
    },
    [setShowAddTrackUrl, setTrackList, trackList]
  );

  const onAddTrackClick = useCallback(async () => {
    const tags = await id3.fromUrl(addTrackUrl);
    onAddTrack(tags, addTrackUrl);
  }, [addTrackUrl, onAddTrack]);

  return (
    <AnimateHeight show={showAddTrackUrl} fillWidth>
      <BoxCol className={containerCss}>
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
      </BoxCol>
    </AnimateHeight>
  );
}

const containerCss = css`
  border-top: 1px solid #aaa;
  margin-top: 8px;
  padding-top: 8px;
  width: 100%;
`;

const labelCss = css`
  display: flex;
  justify-content: space-between;
  gap: 4px;
  margin-top: 4px;
  width: 100%;
  align-items: stretch;
`;

const buttonGradientCss = getButtonCss(
  "var(--color-theme-primary)",
  "var(--color-theme-secondary)"
);
