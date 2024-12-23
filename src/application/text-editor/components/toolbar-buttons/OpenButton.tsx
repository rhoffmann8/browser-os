import { faTrash, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef } from "react";
import { useOutsideClick } from "rooks";
import { Box } from "../../../../components/Box";
import { StorageKeys } from "../../../../constants/constants";
import { getStorageJSON } from "../../../../utils/storage";
import { Note } from "../../TextEditor";
import { deleteButtonCss, openFileMenuCss, openIconCss } from "../../styles";

interface Props {
  onDeleteFile: (file: Note) => void;
  onOpen: (note: Note) => void;
}

export function OpenButton({ onDeleteFile, onOpen }: Props) {
  const [showOpenMenu, setShowOpenMenu] = useState(false);

  const openFileRef = useRef<HTMLUListElement>(null);
  useOutsideClick(openFileRef, () => setShowOpenMenu(false));

  const notes: Note[] = getStorageJSON(StorageKeys.NOTES) ?? [];

  const [, forceUpdate] = useState(0);

  const listItems = (() => {
    if (!notes.length) {
      return (
        <div style={{ padding: 4, whiteSpace: "nowrap" }}>No saved files.</div>
      );
    }

    return notes.map((n) => (
      <li
        key={n.id}
        onClick={() => {
          setShowOpenMenu(false);
          onOpen(n);
        }}
      >
        <Box justifyContent="space-between">
          <Box padding={"4px 4px 4px 12px"}>{n.title}</Box>
          <button
            className={deleteButtonCss}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteFile(n);
              forceUpdate((prev) => prev + 1);
            }}
          >
            <FontAwesomeIcon size="xs" color="#444" icon={faTrash} />
          </button>
        </Box>
      </li>
    ));
  })();

  return (
    <div style={{ position: "relative" }}>
      <button
        title="Open"
        onClick={(e) => {
          e.stopPropagation();
          setShowOpenMenu((prev) => !prev);
        }}
      >
        <FontAwesomeIcon
          icon={faFolder}
          className={openIconCss}
          size="lg"
          color="#444"
        />
      </button>
      {showOpenMenu && (
        <ul className={openFileMenuCss} ref={openFileRef}>
          {listItems}
        </ul>
      )}
    </div>
  );
}
