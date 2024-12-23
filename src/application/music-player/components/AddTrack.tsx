import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import * as id3 from "id3js";
import { getButtonCss } from "../styles";
import { ChangeEventHandler, useCallback, useRef, useState } from "react";
import { useAudioPlayerContext } from "../context/AudioPlayerContext";
import { css } from "@emotion/css";
import cx from "classnames";
import { BoxCol } from "../../../components/Box";
import { Div } from "../../../components/Div";
import { ID3Tag } from "id3js/lib/id3Tag";

export function AddTrack() {
  const { trackList, setTrackList } = useAudioPlayerContext();

  const [showAddTrack, setShowAddTrack] = useState(false);
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
      setShowAddTrack(false);
    },
    [setTrackList, trackList]
  );

  const onUploadFile: ChangeEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      const files = e.currentTarget.files;
      if (!files || !files.length) return;
      const file = files[0];
      try {
        const tags = await id3.fromFile(file);
        const src = URL.createObjectURL(file);
        onAddTrack(tags, src);
      } catch (e) {
        toast.error(
          `Error uploading file: ${
            e && typeof e === "object" && "message" in e ? e.message : e
          }`
        );
      }
    },
    [onAddTrack]
  );

  const onAddTrackClick = useCallback(async () => {
    const tags = await id3.fromUrl(addTrackUrl);
    onAddTrack(tags, addTrackUrl);
  }, [addTrackUrl, onAddTrack]);

  const fileUploadRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        className={cx(buttonGradientCss, toggleAddButtonCss)}
        style={{}}
        onClick={() => setShowAddTrack((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faAdd} />
        Add track
      </button>
      {showAddTrack && (
        <BoxCol>
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
          <Div fillWidth style={{ textAlign: "center" }}>
            or
          </Div>
          <label className={labelCss} style={{ flexDirection: "column" }}>
            <button
              className={buttonGradientCss}
              style={{ flex: 1, padding: 4 }}
              onClick={() => fileUploadRef.current?.click()}
            >
              Upload file
            </button>
            <input
              ref={fileUploadRef}
              className={fileUploadCss}
              type="file"
              onChange={onUploadFile}
              style={{ flex: 1 }}
            />
          </label>
        </BoxCol>
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

const fileUploadCss = css`
  position: absolute;
  visibility: hidden;
`;
