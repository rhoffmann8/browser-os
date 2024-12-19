import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useState,
  useRef,
  MouseEventHandler,
  useCallback,
  KeyboardEventHandler,
} from "react";
import { useOutsideClick } from "rooks";
import { Box } from "../../../../components/Box";
import { Note } from "../../TextEditor";
import { saveIconCss, saveInputContainerCss, saveMenuCss } from "../../styles";

interface Props {
  activeFile: Note | undefined;
  onSave: (id: string | undefined, title: string) => void;
}

export function SaveButton({ activeFile, onSave }: Props) {
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [saveInput, setSaveInput] = useState("");

  const saveInputRef = useRef<HTMLDivElement>(null);
  useOutsideClick(saveInputRef, () => setShowSaveInput(false));

  const saveMenuRef = useRef<HTMLUListElement>(null);
  useOutsideClick(saveMenuRef, () => setShowSaveMenu(false));

  const onSaveMenuSaveClick: MouseEventHandler = useCallback(
    (e) => {
      e.stopPropagation();
      if (!activeFile) {
        return;
      }

      setShowSaveMenu(false);
      onSave(activeFile.id, activeFile.title);
    },
    [activeFile, onSave]
  );

  const onSaveMenuSaveAsClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    setShowSaveMenu(false);
    setShowSaveInput(true);
  };

  const onSaveButtonClick = () => {
    setShowSaveMenu((prev) => !prev);
  };

  const onSaveInputSaveClick = () => {
    onSave(undefined, saveInput);
    setShowSaveMenu(false);
    setShowSaveInput(false);
    setSaveInput("");
  };

  const onSaveInputKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSaveInputSaveClick();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowSaveInput(false);
      setSaveInput("");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button title="Save" onClick={onSaveButtonClick}>
        <FontAwesomeIcon
          icon={faFloppyDisk}
          className={saveIconCss}
          size="lg"
        />
      </button>
      {showSaveMenu && (
        <ul className={saveMenuCss} ref={saveMenuRef}>
          {activeFile && <li onClick={onSaveMenuSaveClick}>Save</li>}
          <li onClick={onSaveMenuSaveAsClick}>Save as...</li>
        </ul>
      )}
      {showSaveInput && (
        <Box
          ref={saveInputRef}
          className={saveInputContainerCss}
          onClick={(e) => e.stopPropagation()}
        >
          <label style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ textWrap: "nowrap" }}>Save as</span>
            <input
              autoFocus
              onClick={(e) => e.stopPropagation()}
              onKeyDown={onSaveInputKeyDown}
              onChange={(e) => setSaveInput(e.currentTarget.value)}
              value={saveInput}
            />
          </label>
          <button
            disabled={!saveInput}
            onClick={(e) => {
              e.stopPropagation();
              onSaveInputSaveClick();
            }}
          >
            <FontAwesomeIcon icon={faFloppyDisk} className={saveIconCss} />
          </button>
        </Box>
      )}
    </div>
  );
}