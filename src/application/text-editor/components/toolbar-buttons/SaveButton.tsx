import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, MouseEventHandler, useCallback } from "react";
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

  const onSaveMenuSaveAsClick: MouseEventHandler = useCallback((e) => {
    e.stopPropagation();
    setShowSaveMenu(false);
    setShowSaveInput(true);
  }, []);

  const onSaveButtonClick = () => {
    setShowSaveMenu((prev) => !prev);
  };

  const onSaveInputSaveClick = () => {
    onSave(undefined, saveInput);
    setShowSaveMenu(false);
    setShowSaveInput(false);
    setSaveInput("");
  };

  return (
    <div style={{ position: "relative" }}>
      <button title="Save" onClick={onSaveButtonClick}>
        <FontAwesomeIcon
          icon={faFloppyDisk}
          className={saveIconCss}
          size="lg"
          color="#444"
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
          className={saveInputContainerCss}
          ref={saveInputRef}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            autoFocus
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSaveInputSaveClick();
              }
            }}
            onChange={(e) => setSaveInput(e.currentTarget.value)}
            value={saveInput}
          />
          <button
            disabled={!saveInput}
            onClick={(e) => {
              e.stopPropagation();
              onSaveInputSaveClick();
            }}
          >
            <FontAwesomeIcon
              icon={faFloppyDisk}
              className={saveIconCss}
              color="#444"
            />
          </button>
        </Box>
      )}
    </div>
  );
}
