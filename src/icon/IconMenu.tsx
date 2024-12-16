import { useOutsideClick } from "rooks";
import { useRef } from "react";
import { css } from "@emotion/css";
import { useIconStore } from "../state/iconState";
import * as faIcons from "@fortawesome/free-regular-svg-icons";

const allIcons = Object.keys(faIcons)
  .filter((key) => key !== "fas" && key !== "prefix")
  .map((icon) => (faIcons as any)[icon]);

const menuCss = css`
  list-style: none;
  padding: 0;
  position: absolute;
  background: var(--color-theme-primary);
  font-size: 12px;

  cursor: pointer;

  li {
    padding: 4px 12px;
  }

  li:hover {
    background: var(--color-theme-hover);
  }
`;

interface Props {
  icons: Set<string>;
  pos?: { x: number; y: number };
  onClose: () => void;

  onRename: () => void;
}

export function IconMenu({ icons, pos, onClose, onRename }: Props) {
  const menuRef = useRef<HTMLUListElement>(document.createElement("ul"));

  useOutsideClick(menuRef, onClose);

  const updateIconImage = useIconStore((state) => state.updateIconImage);

  if (!pos) {
    return null;
  }

  return (
    <ul // should be global
      ref={menuRef}
      className={menuCss}
      style={{ top: pos.y, left: pos.x }}
    >
      <li onClick={onRename}>Rename</li>
      <li
        onClick={() => {
          icons.forEach((iconId) =>
            updateIconImage(
              iconId,
              allIcons[Math.floor(Math.random() * allIcons.length)]
            )
          );
        }}
      >
        Randomize icon image
      </li>
    </ul>
  );
}
