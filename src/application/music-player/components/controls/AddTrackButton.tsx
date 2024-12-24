import { useRef, useState, useCallback, useMemo, RefObject } from "react";
import { useOutsideClick } from "rooks";
import { ListItem, List } from "../../../../components/List";
import { IconButton } from "../../../../components/IconButton";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/css";
import { Div } from "../../../../components/Div";
import { useAudioPlayerContext } from "../../context/AudioPlayerContext";

interface Props {
  fileUploadRef: RefObject<HTMLInputElement>;
}

export function AddTrackButton({ fileUploadRef }: Props) {
  const { showAddTrackUrl, setShowAddTrackUrl } = useAudioPlayerContext();
  const [showAddTrackMenu, setShowAddTrackMenu] = useState(false);
  const addTrackMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(addTrackMenuRef, (e) => {
    e.stopPropagation();
    setShowAddTrackMenu(false);
  });

  const onAddTrackMenuClick = useCallback(() => {
    if (showAddTrackUrl) {
      setShowAddTrackUrl(false);
      return;
    }
    setShowAddTrackMenu((prev) => !prev);
  }, [setShowAddTrackUrl, showAddTrackUrl]);

  const onAddTrackMenuItemClick = useCallback(
    (item: ListItem) => {
      if (item.value === "file") {
        fileUploadRef.current?.click();
      } else {
        setShowAddTrackUrl(true);
      }
      setShowAddTrackMenu(false);
    },
    [fileUploadRef, setShowAddTrackUrl]
  );

  const addTrackMenuStyle = useMemo(
    () => ({
      color:
        showAddTrackMenu || showAddTrackUrl ? "var(--color-theme-red)" : "",
    }),
    [showAddTrackMenu, showAddTrackUrl]
  );

  return (
    <Div style={{ position: "relative" }}>
      <IconButton
        title="Add track"
        onClick={onAddTrackMenuClick}
        icon={faAdd}
        style={addTrackMenuStyle}
      />
      {showAddTrackMenu && (
        <Div ref={addTrackMenuRef}>
          <List
            border
            shadow
            className={addTrackMenuCss}
            onItemClick={onAddTrackMenuItemClick}
            items={[
              { label: "Add from URL", value: "url" },
              { label: "Add from file", value: "file" },
            ]}
          />
        </Div>
      )}
    </Div>
  );
}

const addTrackMenuCss = css`
  white-space: nowrap;
  position: absolute;
  bottom: 0;
  left: 8;
  transform: translateY(100%);
  z-index: 1;
`;
